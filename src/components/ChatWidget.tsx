"use client";

/**
 * Floating site assistant for Dental Med Austria.
 *
 * - Answers from POST /api/chat (grounded in the website knowledge layer).
 * - Fully localized chrome (EN/SQ/IT/DE/FR, see chat-widget-i18n.ts); the
 *   site locale is also sent to the API as a language tiebreaker so short
 *   replies ("po", "ok") on /sq keep the conversation in Albanian.
 * - Accepts ONE photo per message (panoramic X-ray etc.): downscaled and
 *   re-encoded client-side, previewed in the composer, sent as base64.
 * - Replies are held back ~1.2s behind a typing indicator so the assistant
 *   reads as considered rather than canned.
 * - After a real conversation it proactively asks for name + phone, then POSTs
 *   to /api/chat/lead, which packages a warm lead (reference code, inferred
 *   country + interests, referrer/UTM/landing page/locale, full transcript)
 *   into the CRM.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Stethoscope,
  ClipboardList,
  Check,
  CheckCheck,
  Globe,
  Paperclip,
} from "lucide-react";
import { LOCALES, useLocale } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { CHAT_UI } from "./chat-widget-i18n";

type Source = { title: string; url?: string };
type Msg = {
  role: "user" | "bot";
  text: string;
  /** Data-URL preview of the photo this turn was sent with. */
  image?: string;
  sources?: Source[];
  handoff?: boolean;
  /** Delivery receipt for user messages: appears under the latest one. */
  status?: "sent" | "seen";
};

type Attachment = { dataUrl: string; mediaType: "image/jpeg" };

type Ctx = {
  referrer: string;
  landingPath: string;
  utm: Record<string, string>;
  locale: string;
  ref: string;
};

/**
 * Human pacing. A real coordinator doesn't read a message the instant it
 * lands, and doesn't start typing the instant they've read it, so the widget
 * walks the same beats: sent → (pause, occasionally a longer one) → seen →
 * (short pause) → typing → reply. All randomized per turn.
 */
function seenDelayMs(): number {
  // ~0.5–2s, with roughly 1 in 5 messages taking a distinctly human extra beat.
  return 500 + Math.random() * 1500 + (Math.random() < 0.2 ? 800 + Math.random() * 1300 : 0);
}
const typingPauseMs = () => 250 + Math.random() * 650;
const minTypingMs = () => 950 + Math.random() * 750;

/** Longest image edge sent to the API (px), plenty for a panoramic X-ray. */
const MAX_IMAGE_EDGE = 1600;
const MAX_FILE_BYTES = 25 * 1024 * 1024;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** True on desktop-ish devices where autofocus won't summon a keyboard. */
function finePointer(): boolean {
  return window.matchMedia("(min-width: 640px) and (pointer: fine)").matches;
}

/** Capture where the visitor came from (run once, client-side). */
function captureContext(): Ctx {
  const utm: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const v = params.get(k);
      if (v) utm[k.replace("utm_", "")] = v;
    }
  } catch {
    /* ignore */
  }
  let locale = "";
  try {
    locale =
      document.cookie.match(/(?:^|;\s*)dma_locale=([^;]+)/)?.[1] ||
      navigator.language ||
      "";
  } catch {
    /* ignore */
  }
  // Affiliate ref: take it from the URL when present and remember it (90 days)
  // so it still attributes after the visitor browses around before chatting.
  let ref = "";
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("ref") || "";
    const fromCookie = document.cookie.match(/(?:^|;\s*)dma_ref=([^;]+)/)?.[1] || "";
    ref = fromUrl || decodeURIComponent(fromCookie);
    if (fromUrl) {
      document.cookie = `dma_ref=${encodeURIComponent(fromUrl)}; path=/; max-age=${60 * 60 * 24 * 90}; samesite=lax`;
    }
  } catch {
    /* ignore */
  }
  return {
    referrer: typeof document !== "undefined" ? document.referrer : "",
    landingPath: typeof window !== "undefined" ? window.location.pathname : "",
    utm,
    locale,
    ref,
  };
}

/**
 * Decode the picked image and re-encode it as a bounded JPEG. Keeps uploads
 * fast on mobile data and guarantees the API only ever sees a sane payload.
 */
async function toBoundedJpeg(file: File): Promise<Attachment> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode"));
      el.src = url;
    });
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    // X-rays are dark-on-black; a white fill would bleed through any alpha.
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return { dataUrl: canvas.toDataURL("image/jpeg", 0.85), mediaType: "image/jpeg" };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ChatWidget() {
  const { locale, setLocale } = useLocale();
  const ui = CHAT_UI[locale] ?? CHAT_UI.en;
  const prefersReducedMotion = usePrefersReducedMotion();

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  // `busy` = a turn is in flight (locks the composer); `typing` = show the
  // dots. They differ during the read-receipt beats before "typing" starts.
  const [typing, setTyping] = useState(false);
  const [attached, setAttached] = useState<Attachment | null>(null);
  const [attachError, setAttachError] = useState("");

  // Lead-capture state.
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [proactiveAsked, setProactiveAsked] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lsending, setLsending] = useState(false);
  const [lerror, setLerror] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pickSeq = useRef(0);
  const restoreFocus = useRef(false);
  const ctxRef = useRef<Ctx | null>(null);

  // Hand keyboard focus back to the launcher AFTER the close re-render commits
  // (while the panel is open the launcher is display:none and unfocusable).
  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    ctxRef.current = captureContext();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, typing, leadOpen]);

  // Focus the composer when the panel opens, but only on fine-pointer
  // desktops; on touch, autofocus would pop the keyboard over the welcome
  // message and suggestion chips.
  useEffect(() => {
    if (open && !closing && finePointer()) inputRef.current?.focus();
  }, [open, closing, leadOpen]);

  // Full-screen sheet on phones: freeze the page behind it. `position: fixed`
  // on <body> (with the scroll offset pinned) is the lock that actually holds
  // on iOS Safari, where overflow:hidden alone still rubber-bands. Tracks
  // viewport changes so a rotate/resize while open still locks correctly.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 639px)");
    let lockedAt: number | null = null;
    const lock = () => {
      if (lockedAt !== null) return;
      lockedAt = window.scrollY;
      Object.assign(document.body.style, {
        position: "fixed",
        top: `-${lockedAt}px`,
        left: "0",
        right: "0",
        overflow: "hidden",
      });
    };
    const unlock = () => {
      if (lockedAt === null) return;
      Object.assign(document.body.style, { position: "", top: "", left: "", right: "", overflow: "" });
      window.scrollTo(0, lockedAt);
      lockedAt = null;
    };
    const apply = () => (mq.matches ? lock() : unlock());
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      unlock();
    };
  }, [open]);

  // Escape closes, like every well-behaved overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // After a real conversation, proactively offer the free-plan form (once).
  // Waits for the pending reply (`!busy`) so the ask lands AFTER the answer
  // instead of interleaving with the typing indicator.
  useEffect(() => {
    const userTurns = messages.filter((m) => m.role === "user").length;
    if (open && !busy && !leadSent && !leadOpen && !proactiveAsked && userTurns >= 3) {
      setProactiveAsked(true);
      setMessages((m) => [...m, { role: "bot", text: ui.proactive }]);
      setLerror("");
      setLeadOpen(true);
    }
  }, [messages, open, busy, leadSent, leadOpen, proactiveAsked, ui.proactive]);

  function close() {
    restoreFocus.current = true;
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 200);
  }

  // Keep keyboard focus inside the dialog while it is open.
  function trapTab(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = [...panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    )].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function toggle() {
    if (open) close();
    else setOpen(true);
  }

  async function pickFile(file: File | undefined | null) {
    if (!file) return;
    // Sequence concurrent picks: only the newest one may apply its result.
    const seq = ++pickSeq.current;
    if (!file.type.startsWith("image/")) {
      setAttachError(ui.attachTypeError);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setAttachError(ui.attachReadError);
      return;
    }
    try {
      const encoded = await toBoundedJpeg(file);
      if (seq !== pickSeq.current) return;
      setAttached(encoded);
      setAttachError("");
      if (finePointer()) inputRef.current?.focus();
    } catch {
      if (seq !== pickSeq.current) return;
      setAttachError(ui.attachReadError);
    }
  }

  async function send(text: string) {
    const message = text.trim();
    const image = attached;
    if ((!message && !image) || busy) return;
    setInput("");
    setAttached(null);
    setAttachError("");
    // `messages` here is the conversation BEFORE this turn, send it as history
    // so the assistant can answer follow-ups ("yes", "how much for that?") in
    // context. Bot turns map to "assistant"; the server re-sanitises and caps.
    const history = messages
      .filter((m) => m.text.trim() || m.image)
      .slice(-10)
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text.trim() || "(sent an X-ray photo)",
      }));
    setMessages((m) => [...m, { role: "user", text: message, image: image?.dataUrl, status: "sent" }]);
    setBusy(true);

    // Fire the request immediately; the receipt/typing beats run in parallel.
    // Failures flip `failed` and resolve to null so a rejection during the
    // beats stays handled, and so we never show "seen" for a message that was
    // in fact never delivered.
    let failed = false;
    const request: Promise<{
      text?: string;
      sources?: Source[];
      handoff?: boolean;
    } | null> = fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        locale,
        image: image ? { data: image.dataUrl, mediaType: image.mediaType } : undefined,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        failed = true;
        return null;
      });

    try {
      // sent → seen, after a human beat (sporadically a longer one)
      await sleep(seenDelayMs());
      if (!failed) {
        setMessages((m) => m.map((msg) => (msg.role === "user" ? { ...msg, status: "seen" } : msg)));
      }
      // seen → typing, a moment later
      await sleep(typingPauseMs());
      setTyping(true);
      const [data] = await Promise.all([request, sleep(minTypingMs())]);
      if (data && typeof data === "object") {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: data.text ?? ui.errorServer,
            sources: data.sources,
            handoff: data.handoff,
          },
        ]);
      } else {
        // Undelivered: walk the receipt back to "sent" before apologising.
        setMessages((m) => [
          ...m.map((msg) => (msg.role === "user" && msg.status === "seen" ? { ...msg, status: "sent" as const } : msg)),
          { role: "bot", text: ui.errorNetwork },
        ]);
      }
    } finally {
      setTyping(false);
      setBusy(false);
    }
  }

  function openLead() {
    setLerror("");
    setLeadOpen(true);
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    if (lsending) return;
    if (first.trim().length < 1 || phone.trim().length < 3) {
      setLerror(ui.leadErrorFill);
      return;
    }
    setLsending(true);
    setLerror("");

    const userMessages = messages.filter((m) => m.role === "user").map((m) => m.text);
    const transcript = messages
      .map((m) => `${m.role === "user" ? "Visitor" : "DMA"}: ${m.text || "(sent an X-ray photo)"}`)
      .join("\n");
    const ctx = ctxRef.current ?? { referrer: "", landingPath: "", utm: {}, locale: "", ref: "" };

    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first.trim(),
          lastName: last.trim(),
          phone: phone.trim(),
          email: email.trim(),
          channel: "webchat",
          userMessages,
          transcript,
          referrer: ctx.referrer,
          landingPath: ctx.landingPath,
          utm: ctx.utm,
          locale: ctx.locale || locale,
          ref: ctx.ref,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setLeadSent(true);
      setLeadOpen(false);
      setMessages((m) => [...m, { role: "bot", text: ui.leadThanks(first.trim()) }]);
    } catch {
      setLerror(ui.leadErrorSend);
    } finally {
      setLsending(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-[#071522]/40 focus:ring-2 focus:ring-[#071522]/10";

  const bubbleIn =
    "animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-out motion-reduce:animate-none";

  // Delivery receipt shows only under the visitor's most recent message.
  const lastUserIdx = messages.reduce((acc, m, i) => (m.role === "user" ? i : acc), -1);

  return (
    <>
      {/* Launcher (hidden while the panel is open, the panel owns closing) */}
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        aria-label={ui.openChat}
        aria-expanded={open}
        aria-controls="dma-chat-panel"
        className={`fixed bottom-[9.5rem] right-4 z-50 h-14 w-14 items-center justify-center rounded-full bg-[#071522] text-white shadow-[0_10px_32px_rgba(7,21,34,0.38)] ring-1 ring-white/10 transition-all duration-300 hover:scale-105 hover:bg-[#0c2236] hover:shadow-[0_14px_40px_rgba(7,21,34,0.5)] active:scale-95 ${
          open ? "hidden" : "flex"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-[#071522] bg-emerald-400" />
      </button>

      {/* Panel, full-screen sheet on phones, floating card from sm: up. Springs in
          "materialized" (blur+scale+opacity together, anchored to the launcher's
          bottom-right corner) rather than just fading; closing mirrors the same
          motion so it reads as the same physical object leaving. */}
      {open && (
        <motion.div
          ref={panelRef}
          id="dma-chat-panel"
          role="dialog"
          aria-modal="true"
          aria-label={ui.openChat}
          onKeyDown={trapTab}
          initial={
            prefersReducedMotion ? false : { opacity: 0, scale: 0.94, y: 24, filter: "blur(8px)" }
          }
          animate={
            closing
              ? prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, y: 16, filter: "blur(6px)" }
              : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
          }
          transition={
            prefersReducedMotion
              ? { duration: closing ? 0.15 : 0.2 }
              : { type: "spring", bounce: closing ? 0 : 0.15, duration: closing ? 0.2 : 0.4 }
          }
          className="material-sheet fixed inset-0 z-[70] flex flex-col overflow-hidden sm:inset-auto sm:bottom-24 sm:right-4 sm:h-[min(660px,calc(100dvh-8rem))] sm:w-[min(400px,calc(100vw-2.5rem))] sm:origin-bottom-right sm:rounded-3xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#071522] via-[#0c2236] to-[#123049] px-5 pb-3.5 pt-[max(1rem,env(safe-area-inset-top))] text-white sm:pt-4">
            <div className="flex items-center gap-3.5">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <Stethoscope className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c2236] bg-emerald-400" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate font-serif text-[17px]">Dental Med Austria</p>
                <p className="mt-0.5 truncate text-[11px] text-white/60">{ui.status}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={ui.closeChat}
                className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Languages the assistant speaks, tap to switch instantly */}
            <div className="mt-3 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 shrink-0 text-white/45" aria-hidden="true" />
              <div className="flex flex-wrap gap-1.5">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLocale(l.code)}
                    aria-label={l.name}
                    aria-pressed={l.code === locale}
                    title={l.name}
                    className={`rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[1px] transition ${
                      l.code === locale
                        ? "border-white/40 bg-white/15 text-white"
                        : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[#f6f7f8] px-4 py-5 sm:px-5"
          >
            {/* Welcome bubble is virtual so it always speaks the current locale. */}
            <div className={`flex justify-start ${bubbleIn}`}>
              <div className="max-w-[88%] min-w-0 rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 text-[13.5px] leading-relaxed text-[#343434] shadow-sm">
                <p className="whitespace-pre-wrap break-words">{ui.welcome}</p>
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} ${bubbleIn}`}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] min-w-0 rounded-2xl rounded-br-md bg-[#071522] px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-sm"
                      : "max-w-[88%] min-w-0 rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 text-[13.5px] leading-relaxed text-[#343434] shadow-sm"
                  }
                >
                  {m.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.image}
                      alt={ui.imageAlt}
                      className={`${m.text ? "mb-2" : ""} max-h-52 w-full rounded-xl object-cover`}
                    />
                  )}
                  {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {m.sources.map((s, j) =>
                        s.url ? (
                          <a
                            key={j}
                            href={s.url}
                            className="rounded-full border border-[#071522]/15 bg-white px-2.5 py-1 text-[11px] text-[#071522] transition hover:bg-[#071522] hover:text-white"
                          >
                            {s.title}
                          </a>
                        ) : (
                          <span
                            key={j}
                            className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] text-neutral-500"
                          >
                            {s.title}
                          </span>
                        ),
                      )}
                    </div>
                  )}

                  {m.handoff && (
                    <p className="mt-2 text-[11px] italic text-neutral-500">{ui.coordinatorNote}</p>
                  )}

                  {m.role === "bot" && m.handoff && !leadSent && (
                    <button
                      type="button"
                      onClick={openLead}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#071522] px-3.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#0c2236] active:scale-95"
                    >
                      <ClipboardList className="h-3.5 w-3.5" /> {ui.planCta}
                    </button>
                  )}
                </div>

                {m.role === "user" && m.status && i === lastUserIdx && (
                  <p
                    key={m.status}
                    className="mt-1 flex items-center gap-1 pr-1 text-[10px] tracking-wide text-neutral-400 animate-in fade-in-0 duration-300 motion-reduce:animate-none"
                  >
                    {m.status === "seen" ? (
                      <>
                        <CheckCheck className="h-3 w-3 text-[#3aa4dc]" /> {ui.seen}
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3" /> {ui.sent}
                      </>
                    )}
                  </p>
                )}
              </div>
            ))}

            {typing && (
              <div className={`flex justify-start ${bubbleIn}`}>
                <div className="rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3.5 shadow-sm">
                  <span className="flex items-center gap-1">
                    <Dot delay="0ms" /> <Dot delay="160ms" /> <Dot delay="320ms" />
                  </span>
                </div>
              </div>
            )}

            {/* Suggestion chips (only before the first user message) */}
            {messages.length === 0 && !busy && (
              <div className="flex flex-wrap gap-2 pt-1">
                {ui.suggestions.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    style={{ animationDelay: `${120 + i * 70}ms` }}
                    className="animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-backwards motion-reduce:animate-none rounded-full border border-[#071522]/20 bg-white px-3.5 py-1.5 text-xs text-[#071522] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#071522] hover:text-white hover:shadow-md active:translate-y-0"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lead-capture form */}
          {leadOpen && !leadSent && (
            <form
              onSubmit={submitLead}
              className={`space-y-2.5 border-t border-black/10 bg-neutral-50 px-4 py-4 sm:px-5 ${bubbleIn}`}
            >
              <p className="text-xs font-semibold text-[#071522]">{ui.leadTitle}</p>
              <div className="flex gap-2">
                <input
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder={ui.firstName}
                  aria-label={ui.firstName}
                  name="given-name"
                  autoComplete="given-name"
                  className={inputCls}
                  autoFocus={finePointer()}
                />
                <input
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder={ui.lastName}
                  aria-label={ui.lastName}
                  name="family-name"
                  autoComplete="family-name"
                  className={inputCls}
                />
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={ui.phone}
                aria-label={ui.phone}
                type="tel"
                name="tel"
                autoComplete="tel"
                className={inputCls}
                inputMode="tel"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ui.email}
                aria-label={ui.email}
                type="email"
                name="email"
                autoComplete="email"
                className={inputCls}
                inputMode="email"
              />
              {lerror && <p className="text-[11px] text-red-600">{lerror}</p>}
              <div className="flex gap-2 pt-0.5">
                <button
                  type="submit"
                  disabled={lsending}
                  className="flex-1 rounded-xl bg-[#071522] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#0c2236] active:scale-[0.99] disabled:opacity-50"
                >
                  {lsending ? ui.sending : ui.sendRequest}
                </button>
                <button
                  type="button"
                  onClick={() => setLeadOpen(false)}
                  className="rounded-xl border border-black/10 px-3.5 py-2.5 text-sm text-neutral-600 transition hover:bg-neutral-100"
                >
                  {ui.cancel}
                </button>
              </div>
            </form>
          )}

          {leadSent && (
            <div className="flex items-center gap-2 border-t border-emerald-200 bg-emerald-50 px-5 py-3 text-[12px] text-emerald-800">
              <Check className="h-4 w-4 shrink-0" /> {ui.leadReceived}
            </div>
          )}

          {/* Composer */}
          {!leadOpen && (
            <>
              {!leadSent && (
                <button
                  type="button"
                  onClick={openLead}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-black/10 bg-[#071522]/[0.03] py-2.5 text-[12px] font-medium text-[#071522] transition hover:bg-[#071522]/[0.07]"
                >
                  <ClipboardList className="h-3.5 w-3.5" /> {ui.planCtaFooter}
                </button>
              )}

              {/* Attachment preview */}
              {attached && (
                <div
                  className={`flex items-center gap-3 border-t border-black/10 bg-white px-4 pt-3 sm:px-5 ${bubbleIn}`}
                >
                  <span className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={attached.dataUrl}
                      alt={ui.imageAlt}
                      className="h-14 w-14 rounded-xl border border-black/10 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setAttached(null)}
                      aria-label={ui.removePhoto}
                      className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-110"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#071522] text-white shadow">
                        <X className="h-3 w-3" />
                      </span>
                    </button>
                  </span>
                  <p className="text-xs text-neutral-500">{ui.attachReady}</p>
                </div>
              )}
              {attachError && (
                <p className="border-t border-black/10 bg-white px-4 pt-2 text-[11px] text-red-600 sm:px-5">
                  {attachError}
                </p>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className={`flex items-center gap-2 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 ${
                  attached || attachError ? "" : "border-t border-black/10"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    void pickFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label={ui.attach}
                  title={ui.attach}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-[#071522] active:scale-95"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={ui.placeholder}
                  aria-label={ui.placeholder}
                  className="min-w-0 flex-1 rounded-full border border-black/10 bg-neutral-100/70 px-4 py-2.5 text-sm outline-none transition focus:border-[#071522]/30 focus:bg-white focus:ring-2 focus:ring-[#071522]/10"
                />
                <button
                  type="submit"
                  disabled={busy || (!input.trim() && !attached)}
                  aria-label={ui.send}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#071522] text-white transition-all duration-200 hover:scale-105 hover:bg-[#0c2236] active:scale-95 disabled:scale-100 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="dma-typing-dot inline-block h-2 w-2 rounded-full bg-neutral-400"
      style={{ animationDelay: delay }}
    />
  );
}

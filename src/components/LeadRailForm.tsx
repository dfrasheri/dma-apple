"use client";

import { useEffect, useState } from "react";
import { CONTACT } from "@/lib/site";
import { useLocale, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "dma:lead-rail-dismissed";

/**
 * Right-docked lead-capture rail for detail pages (treatments, care, blog posts).
 *
 * Submits through the SAME packaged pipeline as the chatbot and WhatsApp FAB
 * (`POST /api/chat/lead`): the lead is stored in the CRM database (contacts +
 * leads + activity timeline, visible at /crm/leads), scored, deduped against an
 * existing open lead, round-robin assigned to a coordinator, team-notified
 * (webhook + email seam) and mirrored to the external CRM inbox. One funnel,
 * every channel.
 *
 * Open by default on wide screens; collapses to a slim vertical tab on smaller
 * ones (and after the visitor dismisses it). Success state shows the reference
 * code and offers to continue on WhatsApp.
 */
export function LeadRailForm({ service }: { service?: string }) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [refCode, setRefCode] = useState("");

  // Open by default only where there's room for a side rail, but never
  // auto-open again once the visitor has dismissed it (persisted across
  // page views and sessions).
  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // localStorage unavailable (private mode, etc.), fall through and open.
    }
    if (window.matchMedia("(min-width: 1280px)").matches) setOpen(true);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore, dismissal just won't persist if storage is blocked.
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (first.trim().length < 1 || phone.trim().length < 3) {
      setState("error");
      return;
    }
    setState("sending");
    const note = [service ? `Interested in: ${service}` : "", message.trim()]
      .filter(Boolean)
      .join("\n");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: first.trim(),
          lastName: last.trim(),
          phone: phone.trim(),
          email: email.trim(),
          channel: "web_form",
          userMessages: note ? [note] : [],
          transcript: note,
          referrer: document.referrer || "",
          landingPath: window.location.pathname,
          locale,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; refCode?: string };
      if (!res.ok || !json.ok) throw new Error("lead failed");
      setRefCode(json.refCode ?? "");
      setState("sent");
    } catch {
      setState("error");
    }
  }

  const inputCls =
    "w-full border-0 border-b border-[#d8d8d5] bg-transparent pb-1.5 pt-1 text-[14px] text-[#343434] placeholder:text-[#9a9a9a] focus:border-[#071522] focus:outline-none";

  return (
    <>
      {/* Collapsed vertical tab */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("lead.rail.tab")}
        className={cn(
          "fixed right-0 top-[42%] z-40 -translate-y-1/2 rounded-l-md bg-[#071522] px-2 py-4 text-[11px] font-medium uppercase tracking-[1.6px] text-white shadow-lg transition-opacity hover:bg-[#0d2233]",
          open ? "pointer-events-none opacity-0" : "opacity-100",
        )}
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        {t("lead.rail.tab")}
      </button>

      {/* Rail panel */}
      <aside
        aria-hidden={!open}
        className={cn(
          // top-[42%] (not dead centre) keeps clear of the WhatsApp FAB + chat
          // launcher that live in the lower-right corner.
          "fixed right-4 top-[42%] z-40 w-[300px] max-w-[calc(100vw-2rem)] -translate-y-1/2 border border-[#ececec] bg-white shadow-[0_24px_60px_-30px_rgba(7,21,34,0.45)] transition-all duration-500",
          open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0",
        )}
      >
        <div className="flex items-start justify-between gap-3 bg-[#071522] px-5 py-4 text-white">
          <div>
            <p className="font-serif text-[17px] leading-tight">{t("lead.rail.title")}</p>
            <p className="mt-1 text-[11.5px] font-light leading-snug text-white/70">{t("lead.rail.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close"
            className="mt-0.5 text-white/70 transition hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {state === "sent" ? (
          <div className="px-5 py-6">
            <p className="font-serif text-[18px] text-[#071522]">{t("lead.rail.success")}</p>
            <p className="mt-2 text-[13px] font-light leading-[1.55] text-[#555]">
              {t("lead.rail.successNote")}
              {refCode && (
                <>
                  {" "}
                  <span className="font-medium text-[#071522]">{refCode}</span>
                </>
              )}
            </p>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#071522] px-4 py-2.5 text-[12px] uppercase tracking-[1.4px] text-white transition hover:bg-[#0d2233]"
            >
              {t("lead.rail.whatsapp")}
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3.5 px-5 py-5">
            <div className="grid grid-cols-2 gap-3">
              <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder={t("footer.form.first")} aria-label={t("footer.form.first")} className={inputCls} />
              <input value={last} onChange={(e) => setLast(e.target.value)} placeholder={t("footer.form.last")} aria-label={t("footer.form.last")} className={inputCls} />
            </div>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("footer.form.phone")} inputMode="tel" aria-label={t("footer.form.phone")} className={inputCls} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("footer.form.email")} inputMode="email" aria-label={t("footer.form.email")} className={inputCls} />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("footer.form.comments")}
              aria-label={t("footer.form.comments")}
              className={cn(inputCls, "min-h-[54px] resize-y")}
            />
            {state === "error" && (
              <p className="text-[11.5px] font-medium text-red-600">{t("lead.rail.error")}</p>
            )}
            <button
              type="submit"
              disabled={state === "sending"}
              className="w-full bg-[#071522] px-4 py-2.5 text-[12px] uppercase tracking-[1.4px] text-white transition hover:bg-[#0d2233] disabled:opacity-60"
            >
              {state === "sending" ? t("lead.rail.sending") : t("lead.rail.send")}
            </button>
            <p className="text-[10.5px] font-light leading-snug text-[#9a9a9a]">{t("lead.rail.privacy")}</p>
          </form>
        )}
      </aside>
    </>
  );
}

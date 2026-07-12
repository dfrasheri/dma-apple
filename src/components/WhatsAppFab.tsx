"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";

/**
 * Floating WhatsApp button + in-site lead form.
 *
 * Clicking the button opens a small panel INSIDE the website. The visitor fills
 * in first name, surname, phone and (optional) email; pressing "Open WhatsApp"
 * builds a prefilled message with those details and opens a chat with the clinic
 * (wa.me/<WHATSAPP_NUMBER>), so they only have to press send in WhatsApp.
 *
 * Mounted only on the public marketing site (see PublicChrome, hidden on
 * /crm). Override the number with NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "355675562354").replace(/\D/g, "");

function WaIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.001 3.2C8.94 3.2 3.2 8.94 3.2 16c0 2.26.6 4.46 1.72 6.4L3.2 28.8l6.56-1.72a12.74 12.74 0 0 0 6.24 1.6h.01c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.33-6.63-3.75-9.05A12.7 12.7 0 0 0 16.001 3.2Zm0 23.02h-.01a10.62 10.62 0 0 1-5.41-1.48l-.39-.23-4.03 1.06 1.08-3.93-.25-.4A10.6 10.6 0 0 1 5.35 16c0-5.87 4.78-10.65 10.66-10.65 2.85 0 5.52 1.11 7.53 3.13a10.57 10.57 0 0 1 3.12 7.53c0 5.87-4.78 10.63-10.66 10.63Zm5.84-7.97c-.32-.16-1.9-.94-2.19-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.44 4.81.76.33 1.35.53 1.81.68.76.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.14-.29-.21-.61-.37Z" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppFab() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function openWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (first.trim().length < 1 || phone.trim().length < 3) {
      setError("Please add your name and phone number.");
      return;
    }
    setError("");
    // Unified capture: log this as a CRM lead (channel "whatsapp", same packaged
    // pipeline as the chatbot: ref code, country inference, dedupe, notify).
    // Fire-and-forget so WhatsApp always opens even if the API hiccups.
    fetch("/api/chat/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        firstName: first.trim(),
        lastName: last.trim(),
        phone: phone.trim(),
        email: email.trim(),
        channel: "whatsapp",
        referrer: document.referrer || "",
        landingPath: window.location.pathname,
        locale,
      }),
    }).catch(() => {});
    const message = [
      "Hello Dental Med Austria!",
      "",
      `Name: ${`${first.trim()} ${last.trim()}`.trim()}`,
      `Phone: ${phone.trim()}`, ...(email.trim() ? [`Email: ${email.trim()}`] : []),
    ].join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const inputCls =
    "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-[#111b21] outline-none focus:border-[#25D366]";

  return (
    <>
      {/* In-site panel */}
      {open && (
        // opens ABOVE the chat launcher (at 9.5rem) so the widgets never overlap
        <div className="fixed bottom-[13.5rem] right-4 z-50 w-[min(340px,calc(100vw-2rem))] max-h-[calc(100svh-15rem)] overflow-y-auto overscroll-contain rounded-2xl border border-black/10 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <WaIcon className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="font-serif text-[15px]">Chat on WhatsApp</p>
              <p className="text-[11px] text-white/70">Dental Med Austria · replies quickly</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="ml-auto text-white/80 transition hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Form (WhatsApp-paper background) */}
          <form onSubmit={openWhatsApp} className="space-y-2 px-4 py-4" style={{ background: "#efeae2" }}>
            <p className="text-[12px] leading-snug text-[#54656f]">
              Leave your details and we&rsquo;ll open WhatsApp with your message ready, just press send.
            </p>
            <div className="flex gap-2">
              <input value={first} onChange={(e) => setFirst(e.target.value)} placeholder="First name" className={inputCls} autoFocus />
              <input value={last} onChange={(e) => setLast(e.target.value)} placeholder="Surname" className={inputCls} />
            </div>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (with country code)" inputMode="tel" className={inputCls} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" inputMode="email" className={inputCls} />
            {error && <p className="text-[11px] font-medium text-red-600">{error}</p>}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5d] active:scale-[0.99]"
            >
              <WaIcon className="h-4 w-4" /> Open WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close WhatsApp form" : "Chat with us on WhatsApp"}
        title="Chat with us on WhatsApp"
        className="fixed bottom-[4.5rem] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-1 ring-black/10 transition hover:scale-105 hover:bg-[#1ebe5d] active:scale-95"
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <WaIcon className="h-7 w-7" />}
      </button>
    </>
  );
}

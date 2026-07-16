"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n";

/**
 * Minimal, on-brand cookie/consent banner. The chat assistant (a third-party
 * widget that can store messages + patient photos) must not load until the
 * visitor accepts, ChatWidgetLazy watches `localStorage[CONSENT_KEY]` and the
 * `dma:consent` event this dispatches. Decline = no chat.
 *
 * NOTE: this is a functional consent gate, not a full CMP. The linked privacy
 * page is a draft that must be finalised + translated by legal.
 */
const CONSENT_KEY = "dma_cookie_consent";

const I18N: Record<
  string,
  { title: string; body: string; accept: string; decline: string; privacy: string }
> = {
  en: {
    title: "Cookies & chat assistant",
    body: "We use essential cookies and a chat assistant to help you plan treatment. The chat is provided by Dental Med Austria and may store your messages and any photos you send.",
    accept: "Accept",
    decline: "Decline",
    privacy: "Privacy policy"
  },
  de: {
    title: "Cookies & Chat-Assistent",
    body: "Wir verwenden notwendige Cookies und einen Chat-Assistenten, der Sie bei der Behandlungsplanung unterstuetzt. Der Chat wird von Dental Med Austria bereitgestellt und kann Ihre Nachrichten und gesendete Fotos speichern.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
    privacy: "Datenschutz"
  },
  it: {
    title: "Cookie e assistente chat",
    body: "Utilizziamo cookie essenziali e un assistente chat per aiutarti a pianificare il trattamento. La chat e fornita da Dental Med Austria e puo memorizzare i tuoi messaggi e le foto inviate.",
    accept: "Accetta",
    decline: "Rifiuta",
    privacy: "Privacy"
  },
  sq: {
    title: "Cookie dhe asistenti i bisedes",
    body: "Perdorim cookie thelbesore dhe nje asistent bisede per t'ju ndihmuar te planifikoni trajtimin. Biseda ofrohet nga Dental Med Austria dhe mund te ruaje mesazhet dhe fotot qe dergoni.",
    accept: "Prano",
    decline: "Refuzo",
    privacy: "Privatesia"
  }
};

// The stored choice is external state (localStorage + the dma:consent event),
// so subscribe to it instead of mirroring it into component state.
function subscribeConsent(onChange: () => void) {
  window.addEventListener("dma:consent", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("dma:consent", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return "unavailable"; // no storage → never show a banner we can't honour
  }
}

export function CookieConsent() {
  const { locale } = useLocale();
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => "ssr");
  const visible = consent === null;

  const choose = (v: "accepted" | "declined") => {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("dma:consent"));
  };

  if (!visible) return null;
  const c = I18N[locale] ?? I18N.en;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={c.title}
      // z-40: above page content, but BELOW the floating chat stack (launcher
      // z-50, panel z-[70]) so the assistant stays reachable pre-consent, the
      // widget is first-party and needs no consent to render.
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#c6a15b]/25 bg-[#241c15]/95 px-4 py-5 text-[#fbf7f2] shadow-2xl backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-relaxed">
          <p className="mb-1 font-serif text-[16px] font-medium text-[#fbf7f2]">{c.title}</p>
          <p className="text-[#fbf7f2]/70">
            {c.body}{" "}
            <Link
              href={`/${locale}/privacy`}
              className="text-[#e4cd9a] underline decoration-[#c6a15b]/60 underline-offset-2 transition-colors duration-300 hover:text-[#fbf7f2] hover:decoration-[#e4cd9a]"
            >
              {c.privacy}
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="rounded-full border border-[#e4cd9a]/40 px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e4cd9a] transition-colors duration-300 hover:border-[#e4cd9a] hover:bg-[#e4cd9a]/10"
          >
            {c.decline}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="gold-shimmer-host rounded-full bg-[#c6a15b] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { CONTACT } from "@/lib/site";

/**
 * 360° Tourmake walkthrough of the clinic (same tour as the old
 * dentalmedtravel.com/our-clinic), on the Gilded system.
 *
 * Mobile-first interaction model:
 * - The frame is PORTRAIT-TALL on phones (72svh) so the tour is actually
 *   explorable, not a 4:3 letterbox sliver.
 * - A tap-to-explore overlay keeps page scrolling smooth: until tapped, the
 *   iframe ignores touches (no scroll-trap); after tapping, the tour owns
 *   every gesture and a "back to the page" chip releases it again.
 * - Fullscreen button for total immersion; iPhones forbid element fullscreen,
 *   so a failed request falls back to opening the tour in its own tab.
 */
const TOUR_URL = "https://tourmake.net/en/tour/fc58c6776f2de688a8c88576cde2c0ad";

function FullscreenIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function VirtualTour() {
  const t = useT();
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  async function goFullscreen() {
    const el = frameRef.current;
    setActive(true);
    try {
      if (el?.requestFullscreen) {
        await el.requestFullscreen();
        return;
      }
      throw new Error("unsupported");
    } catch {
      // iOS Safari (and blocked contexts): the tour in its own tab is the
      // best full-screen experience available.
      window.open(TOUR_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section id="virtual-tour" className="section-y bg-[#f4ecdd]">
      <div className="tpds-container">
        <div className="mb-10 text-center">
          <p className="eyebrow gold-foil mb-4">{t("tour360.eyebrow")}</p>
          <h2 className="serif-title text-h2 [text-wrap:balance]">{t("tour360.title")}</h2>
          <span className="mx-auto mt-6 block h-px w-20 bg-gradient-to-r from-transparent via-[#c6a15b] to-transparent" />
          <p className="mx-auto mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-[#6e6152]">
            {t("tour360.hint")}
          </p>
        </div>

        <div
          ref={frameRef}
          className="relative h-[72svh] max-h-[680px] overflow-hidden rounded-3xl bg-[#171310] shadow-[var(--shadow-brand-xl)] sm:aspect-[16/9] sm:h-auto sm:max-h-none"
        >
          <iframe
            src={TOUR_URL}
            title="Dental Med Austria 360° virtual clinic tour"
            loading="lazy"
            allowFullScreen
            allow="gyroscope; accelerometer; vr; fullscreen"
            className={`absolute inset-0 h-full w-full border-0 ${active ? "" : "pointer-events-none"}`}
          />

          {/* gold hairline frame */}
          <span aria-hidden className="pointer-events-none absolute inset-3 z-10 rounded-2xl border border-[#e4cd9a]/40" />

          {/* Tap-to-explore overlay: keeps page scrolling fluid until the
              visitor deliberately enters the tour. */}
          {!active && (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 z-20 flex w-full flex-col items-center justify-end pb-12 sm:pb-14"
              aria-label={t("tour360.explore")}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-[#171310]/70 via-transparent to-[#171310]/20 transition-opacity duration-300 group-hover:opacity-80" />
              <span className="gold-shimmer-host relative inline-flex items-center gap-2.5 rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.6)] transition-transform duration-200 group-hover:-translate-y-0.5">
                <span aria-hidden className="text-[15px]">↻</span>
                {t("tour360.explore")}
              </span>
            </button>
          )}

          {/* In-tour controls: release the gestures back to the page, or go all-in. */}
          {active && (
            <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={goFullscreen}
                title={t("tour360.fullscreen")}
                aria-label={t("tour360.fullscreen")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e4cd9a]/50 bg-[#171310]/70 text-[#e4cd9a] backdrop-blur-sm transition hover:bg-[#c6a15b] hover:text-[#241c15]"
              >
                <FullscreenIcon />
              </button>
              <button
                type="button"
                onClick={() => setActive(false)}
                className="rounded-full border border-[#e4cd9a]/50 bg-[#171310]/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#e4cd9a] backdrop-blur-sm transition hover:bg-[#c6a15b] hover:text-[#241c15]"
              >
                {t("tour360.exit")}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center text-[13.5px] text-[#6e6152] sm:flex-row sm:text-left">
          <p>
            {CONTACT.address1}, {CONTACT.address2}
          </p>
          <a
            href={CONTACT.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#9a7638] underline decoration-[#c6a15b]/60 underline-offset-4 transition-colors hover:text-[#c6a15b]"
          >
            Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}

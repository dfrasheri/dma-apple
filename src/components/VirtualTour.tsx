"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { CONTACT } from "@/lib/site";

/**
 * 360° Tourmake walkthrough of the clinic (same tour as the old
 * dentalmedtravel.com/our-clinic), on the Gilded system.
 *
 * Resilience: the iframe is only mounted after /api/tour-health confirms
 * Tourmake is answering (an iframe can't report a cross-origin 502, so the
 * server probes for us). If the tour is down, visitors get a branded
 * fallback — clinic photo, a calm "momentarily unavailable" note, a retry
 * button and a direct link — and the section re-probes on a backoff timer,
 * swapping the live tour back in automatically when Tourmake recovers.
 * A raw gateway-error page can never render inside the gold frame.
 *
 * Mobile interaction model:
 * - PORTRAIT-TALL frame on phones (72svh), 16:9 on desktop.
 * - Tap-to-explore overlay so page scrolling is never trapped; once inside,
 *   a "back to the page" chip releases the gestures again.
 * - Fullscreen button; iPhones forbid element fullscreen, so failure falls
 *   back to opening the tour in its own tab.
 */
const TOUR_URL = "https://tourmake.net/en/tour/fc58c6776f2de688a8c88576cde2c0ad";
const FALLBACK_IMAGE = "/images/dma/interiors/reception-wide.jpg";
/** Re-probe cadence while down: quick first retries, then gentle. */
const RETRY_DELAYS_MS = [10_000, 20_000, 30_000, 60_000];

type TourStatus = "checking" | "up" | "down";

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
  const [status, setStatus] = useState<TourStatus>("checking");
  const retryCount = useRef(0);
  const retryTimer = useRef<number | null>(null);

  const probe = useCallback(async () => {
    try {
      const res = await fetch("/api/tour-health", { cache: "no-store" });
      const data = (await res.json()) as { ok?: boolean };
      setStatus(data.ok ? "up" : "down");
      return Boolean(data.ok);
    } catch {
      setStatus("down");
      return false;
    }
  }, []);

  // Initial probe + self-healing retry loop while down.
  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      const delay = RETRY_DELAYS_MS[Math.min(retryCount.current, RETRY_DELAYS_MS.length - 1)];
      retryCount.current += 1;
      retryTimer.current = window.setTimeout(async () => {
        if (cancelled) return;
        const ok = await probe();
        if (!ok && !cancelled) schedule();
      }, delay);
    };
    void probe().then((ok) => {
      if (!ok && !cancelled) schedule();
    });
    return () => {
      cancelled = true;
      if (retryTimer.current !== null) window.clearTimeout(retryTimer.current);
    };
  }, [probe]);

  async function manualRetry() {
    setStatus("checking");
    retryCount.current = 0;
    await probe();
  }

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
          {/* The tour itself — mounted ONLY when the health probe passes, so a
              Tourmake 502 can never paint inside the frame. */}
          {status === "up" && (
            <iframe
              src={TOUR_URL}
              title="Dental Med Austria 360° virtual clinic tour"
              loading="lazy"
              allowFullScreen
              allow="gyroscope; accelerometer; vr; fullscreen"
              className={`absolute inset-0 h-full w-full border-0 ${active ? "" : "pointer-events-none"}`}
            />
          )}

          {/* Checking / down: branded clinic photo keeps the frame beautiful. */}
          {status !== "up" && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${FALLBACK_IMAGE})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/85 via-[#171310]/40 to-[#171310]/30" />
            </div>
          )}

          {/* gold hairline frame */}
          <span aria-hidden className="pointer-events-none absolute inset-3 z-10 rounded-2xl border border-[#e4cd9a]/40" />

          {status === "checking" && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#e4cd9a]/30 border-t-[#c6a15b]" aria-hidden />
            </div>
          )}

          {status === "down" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6 text-center">
              <p className="max-w-[420px] font-serif text-[clamp(20px,2.4vw,26px)] font-medium leading-snug text-[#fbf7f2]">
                {t("tour360.down")}
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={manualRetry}
                  className="gold-shimmer-host inline-flex items-center gap-2 rounded-full bg-[#c6a15b] px-7 py-3 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.6)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  ↻ {t("tour360.retry")}
                </button>
                <a
                  href={TOUR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4cd9a]/50 px-7 py-3 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-[#e4cd9a] transition-colors hover:border-[#e4cd9a] hover:bg-[#fbf7f2]/10"
                >
                  {t("tour360.open")} →
                </a>
              </div>
            </div>
          )}

          {/* Tap-to-explore overlay (only when the tour is live). */}
          {status === "up" && !active && (
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

          {/* In-tour controls: release gestures, or go all-in. */}
          {status === "up" && active && (
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

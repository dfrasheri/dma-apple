"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/Reveal";
import { InstagramIcon, ChevronLeft, ChevronRight, CloseIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Real patient testimonial reels, published on the clinic's Instagram.
 *
 * Rendered as a CONTINUOUS marquee of vertical (9:16) cover cards (duplicated
 * once so the loop is seamless, pausing on hover so a moving card stays
 * clickable). Each card shows the real Instagram cover thumbnail, downloaded
 * locally to `/public/images/dma/testimonials/{code}.jpg`, so there are no
 * expiring hotlinked CDN URLs. The heavy Instagram video embed loads ONLY when
 * a card is opened in the lightbox, never many iframes at once, so the
 * section stays cheap on first paint / Core Web Vitals. The embed uses
 * Instagram's official no-SDK endpoint (`/{p|reel}/{code}/embed`).
 */
type Reel = { code: string; kind: "reel" | "p"; name?: string; from?: string };

// name = patient's name as they appear/consent to on the reel; from = their
// home city/country. Fill both from the real Instagram captions; leave blank
// and the card falls back to a plain "Watch reel" label (never invent these).
const REELS: Reel[] = [
  { code: "Cb0Gw91LYsy", kind: "reel", name: "Lisa", from: "United Kingdom" },
  { code: "DUai_fACD1v", kind: "p", name: "Cosimo", from: "Italy" },
  { code: "DWbwMjoCNHr", kind: "p", name: "Agim", from: "Pisa, Italy" },
  { code: "DX_11YoIBLf", kind: "p", name: "Lucia", from: "California, USA" },
  { code: "DYmfgMbIqeN", kind: "p", name: "Mauro", from: "Italy" },
  { code: "DZct-yBIYJJ", kind: "p", name: "Raffaele", from: "Treviso, Italy" },
];

const permalink = (r: Reel) => `https://www.instagram.com/${r.kind}/${r.code}/`;
const embedUrl = (r: Reel) => `https://www.instagram.com/${r.kind}/${r.code}/embed`;
const thumbUrl = (r: Reel) => `/images/dma/testimonials/${r.code}.jpg`;

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

export function Testimonials() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);

  // Duplicate the reels so the -50% marquee translate loops seamlessly.
  const loop = [...REELS, ...REELS];

  return (
    <section className="section-y overflow-hidden bg-[#fbf7f2]">
      <Reveal className="tpds-container text-center" stagger={0.1} y={24}>
        <p className="eyebrow gold-foil mb-3">{t("testi.eyebrow")}</p>
        <h2 className="serif-title" style={{ fontSize: "clamp(30px, 3.8vw, 50px)" }}>
          {t("testi.title")}
        </h2>
        <div className="gold-rule mx-auto mt-6 w-24" aria-hidden="true" />
        <p className="mx-auto mt-5 max-w-[620px] text-[16px] font-light leading-[1.65] text-[#6e6152]">
          {t("testi.subtitle")}
        </p>
      </Reveal>

      <div className="testi-marquee-mask relative mt-11">
        <div className="testi-marquee-track flex w-max gap-5 px-2.5">
          {loop.map((r, i) => {
            const idx = i % REELS.length;
            return (
              <button
                key={`${r.code}-${i}`}
                type="button"
                onClick={() => setOpen(idx)}
                aria-label={`${t("testi.badge")} ${idx + 1}, ${t("testi.watch")}`}
                aria-hidden={i >= REELS.length}
                tabIndex={i >= REELS.length ? -1 : 0}
                className="group relative aspect-[9/16] w-[260px] shrink-0 overflow-hidden rounded-3xl bg-[#241c15] text-left shadow-[var(--shadow-brand-lg)] ring-1 ring-[#9a7638]/15 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-brand-xl)]"
              >
                {/* real Instagram cover */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl(r)}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* legibility gradient — warm espresso, not cold black */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#241c15]/30 via-transparent to-[#171310]/80" />

                {/* top row: IG glyph + badge */}
                <span className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#241c15]/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#fbf7f2] ring-1 ring-[#e4cd9a]/25 backdrop-blur-sm">
                    <InstagramIcon className="h-3.5 w-3.5 text-[#e4cd9a]" />
                    {t("testi.badge")}
                  </span>
                </span>

                {/* play button, frosted gold + understated; firms up on hover */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c6a15b]/25 text-[#fbf7f2] ring-1 ring-[#e4cd9a]/60 backdrop-blur-md transition-all duration-500 group-hover:scale-105 group-hover:bg-[#c6a15b]/45">
                    <PlayIcon className="ml-0.5 h-5 w-5" />
                  </span>
                </span>

                {/* bottom label: patient name + origin when known, else a
                    plain watch prompt */}
                <span className="absolute inset-x-0 bottom-0 p-4">
                  {r.name ? (
                    <>
                      <span className="block font-serif text-[19px] font-medium leading-tight text-[#fbf7f2] drop-shadow">
                        {r.name}
                      </span>
                      {r.from && (
                        <span className="mt-0.5 block text-[12px] font-light tracking-wide text-[#fbf7f2]/80 drop-shadow">
                          {r.from}
                        </span>
                      )}
                      <span className="mt-2 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#e4cd9a]">
                        {t("testi.watch")}
                        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#e4cd9a] drop-shadow">
                        {t("testi.watch")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-[#e4cd9a]/90 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="tpds-container mt-10 text-center">
        <a
          href={CONTACT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="gold-shimmer-host inline-flex items-center justify-center gap-2 rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          <InstagramIcon className="h-4 w-4" />
          {t("testi.follow")}
        </a>
      </div>

      {open !== null && (
        <ReelLightbox
          reels={REELS}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          labels={{
            close: t("testi.close"),
            prev: t("testi.prev"),
            next: t("testi.next"),
            loading: t("testi.loading"),
            openIg: t("testi.follow"),
          }}
        />
      )}
    </section>
  );
}

function ReelLightbox({
  reels,
  index,
  onIndex,
  onClose,
  labels,
}: {
  reels: Reel[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  labels: { close: string; prev: string; next: string; loading: string; openIg: string };
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const reel = reels[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      setLoaded(false);
      onIndex((index + dir + reels.length) % reels.length);
    },
    [index, reels.length, onIndex],
  );

  // Keyboard: ESC closes, ←/→ navigate. Lock body scroll while open.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.close}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#171310]/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#fbf7f2]/10 text-[#fbf7f2] ring-1 ring-[#c6a15b]/25 transition hover:bg-[#c6a15b]/25"
      >
        <CloseIcon className="h-6 w-6" />
      </button>

      {/* prev */}
      <button
        type="button"
        aria-label={labels.prev}
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#fbf7f2]/10 text-[#fbf7f2] ring-1 ring-[#c6a15b]/25 transition hover:bg-[#c6a15b]/25 sm:left-6"
      >
        <ChevronLeft className="h-7 w-7" />
      </button>

      {/* stage */}
      <div
        className="relative flex h-[min(82vh,720px)] w-[min(420px,92vw)] items-center justify-center overflow-hidden rounded-3xl bg-[#fffefb] shadow-[var(--shadow-brand-2xl)] ring-1 ring-[#c6a15b]/25"
        onClick={(e) => e.stopPropagation()}
      >
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#a99a8b]">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#e8ddc9] border-t-[#c6a15b]" />
            <span className="text-[13px] uppercase tracking-[0.14em]">{labels.loading}</span>
          </div>
        )}
        <iframe
          key={reel.code}
          src={embedUrl(reel)}
          title={`Instagram testimonial ${index + 1}`}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className={cn("h-full w-full border-0 transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
        />
      </div>

      {/* next */}
      <button
        type="button"
        aria-label={labels.next}
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#fbf7f2]/10 text-[#fbf7f2] ring-1 ring-[#c6a15b]/25 transition hover:bg-[#c6a15b]/25 sm:right-6"
      >
        <ChevronRight className="h-7 w-7" />
      </button>

      {/* counter + open-original */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2.5 text-[#fbf7f2]/90">
        <span className="rounded-full bg-[#fbf7f2]/10 px-3 py-1 text-[12px] font-medium tracking-[0.08em] ring-1 ring-[#c6a15b]/25">
          {index + 1} / {reels.length}
        </span>
        <a
          href={permalink(reel)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf7f2]/10 px-3 py-1 text-[12px] font-medium tracking-[0.08em] ring-1 ring-[#c6a15b]/25 transition hover:bg-[#c6a15b]/25"
        >
          <InstagramIcon className="h-3.5 w-3.5 text-[#e4cd9a]" />
          Instagram
        </a>
      </div>
    </div>
  );
}

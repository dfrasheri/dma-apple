"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { useT, useLocale } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOUR = [
  "/images/dma/interiors/reception-wide.jpg",
  "/images/dma/interiors/corridor-lounge.jpg",
  "/images/dma/interiors/meeting-room.jpg",
  "/images/dma/interiors/treatment-room-view.jpg",
  "/images/dma/interiors/treatment-room-green.jpg",
  "/images/dma/interiors/clinic-room-03.jpg",
];

/**
 * Clinic tour as a scroll scene: the photography starts as a framed, rounded
 * plate and swells to a full-bleed panorama as it crosses the viewport
 * (clip-path scrub — compositor-only, no reflow). The carousel behaviour
 * (arrows, crossfade, dots) is unchanged.
 */
export function TourOffice() {
  const [active, setActive] = useState(0);
  const t = useT();
  const { locale } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const go = useCallback((d: number) => setActive((a) => (a + d + TOUR.length) % TOUR.length), []);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frame,
        { clipPath: "inset(0% 7% round 28px)" },
        {
          clipPath: "inset(0% 0% round 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "top 12%",
            scrub: true,
          },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="section-y-sm bg-[#fbf7f2]">
      <div ref={frameRef} className="relative h-[74vh] min-h-[480px] w-full overflow-hidden" style={{ clipPath: prefersReducedMotion ? undefined : "inset(0% 7% round 28px)" }}>
        {TOUR.map((src, i) => (
          <div
            key={src}
            className={cn(
              "absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        {/* espresso wash + gold breath at the base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/75 via-transparent to-[#171310]/25" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(90% 60% at 50% 100%, rgba(198,161,91,0.18), transparent 60%)" }} />

        <button
          aria-label={t("common.prev")}
          onClick={() => go(-1)}
          className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e4cd9a]/40 bg-[#171310]/40 text-[#e4cd9a] backdrop-blur-sm transition hover:bg-[#c6a15b] hover:text-[#241c15]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          aria-label={t("common.next")}
          onClick={() => go(1)}
          className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e4cd9a]/40 bg-[#171310]/40 text-[#e4cd9a] backdrop-blur-sm transition hover:bg-[#c6a15b] hover:text-[#241c15]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-10 left-6 sm:left-12">
          <p className="eyebrow mb-3 text-[#e4cd9a]">Dental Med Austria · Tirana</p>
          <h2 className="font-serif text-[clamp(34px,5vw,58px)] font-medium leading-none text-[#fbf7f2]">
            {t("tour.title")}
          </h2>
          <Link
            href={`/${locale}/clinic/our-clinic#virtual-tour`}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#e4cd9a]/50 px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#fbf7f2] backdrop-blur-sm transition-colors duration-200 hover:border-[#e4cd9a] hover:bg-[#fbf7f2]/10"
          >
            {t("tour360.cta")}
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* frame counter, formal and precise */}
        <div className="absolute bottom-10 right-6 flex items-baseline gap-1 font-serif text-[#e4cd9a] sm:right-12">
          <span className="text-[34px] leading-none">{String(active + 1).padStart(2, "0")}</span>
          <span className="text-[15px] opacity-60">/ {String(TOUR.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}

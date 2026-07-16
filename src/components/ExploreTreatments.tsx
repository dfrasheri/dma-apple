"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealLines } from "@/components/fx/RevealLines";
import { ArrowRight } from "@/components/icons";
import { useT, useLocale } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARDS = [
  { key: "treat.implants", img: "/images/dma/before-after/full-mouth-rehabilitation.jpg", href: "/care/dental-implants" },
  { key: "treat.crowns", img: "/images/dma/before-after/crowns.jpg", href: "/care/dental-crowns" },
  { key: "treat.veneers", img: "/images/dma/before-after/veneers.jpg", href: "/care/dental-veneers" },
  { key: "treat.prostheses", img: "/images/dma/before-after/full-mouth-rehabilation-all-on-6.jpg", href: "/care/dental-prostheses" },
  { key: "treat.orthodontics", img: "/images/dma/before-after/bfa14.jpg", href: "/care/orthodontics" },
];

/**
 * Treatments as a scroll-driven editorial gallery.
 *
 * Desktop: the section pins and the card train drives horizontally with the
 * scroll (scrubbed, interruptible, reversible). Mobile: a native snap-scroll
 * carousel of the same cards. Each card carries a gigantic outline index
 * numeral (01–05), a serif title plate, and a gold hover frame.
 */
export function ExploreTreatments() {
  const t = useT();
  const { locale } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || prefersReducedMotion) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const getDistance = () => track.scrollWidth - section.clientWidth + 96;
      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#fbf7f2] py-16 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      {/* colossal ghost word behind the scene */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 left-4 select-none font-serif italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(154,118,56,0.15)]"
        style={{ fontSize: "clamp(90px, 16vw, 230px)" }}
      >
        Smile
      </span>

      <div className="tpds-container relative mb-10 flex items-end justify-between gap-6 lg:mb-14">
        <div>
          <p className="eyebrow gold-foil mb-4">Dental Med Austria</p>
          <RevealLines
            as="h2"
            text={t("explore.title")}
            className="serif-title text-h1"
          />
        </div>
        <p className="hidden max-w-[300px] pb-2 text-[14px] leading-relaxed text-[#6e6152] md:block">
          {t("footer.col.treatments")} · 01 — 0{CARDS.length}
        </p>
      </div>

      {/* Card train: scrubbed horizontally on desktop, snap-scroll on mobile */}
      <div className="lg:overflow-visible">
        <div
          ref={trackRef}
          className="no-scrollbar flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-5 will-change-transform sm:gap-7 sm:px-8 lg:w-max lg:snap-none lg:overflow-visible lg:pl-[max(2rem,calc((100vw-1300px)/2+2rem))] lg:pr-24"
        >
          {CARDS.map((c, i) => (
            <Link
              key={c.key}
              href={`/${locale}${c.href}`}
              className="group relative h-[64vh] min-h-[420px] max-h-[620px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl sm:w-[380px] lg:w-[420px]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                style={{ backgroundImage: `url(${c.img})` }}
              />
              {/* espresso-gold wash, deepens toward the caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/85 via-[#171310]/20 to-[#171310]/30 transition-colors duration-500" />
              {/* gold frame that breathes in on hover */}
              <span className="pointer-events-none absolute inset-3 rounded-2xl border border-[#e4cd9a]/0 transition-all duration-500 group-hover:inset-4 group-hover:border-[#e4cd9a]/60" />

              {/* giant outline index numeral */}
              <span className="index-numeral absolute left-5 top-4 text-[clamp(72px,9vw,110px)]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6 sm:p-7">
                <div>
                  <span className="mb-2 block h-px w-10 bg-[#c6a15b] transition-all duration-500 group-hover:w-16" />
                  <span className="font-serif text-[28px] font-medium leading-tight text-[#fbf7f2] sm:text-[32px]">
                    {t(c.key)}
                  </span>
                </div>
                <span className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e4cd9a]/50 text-[#e4cd9a] transition-all duration-300 group-hover:bg-[#c6a15b] group-hover:text-[#241c15]">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
                </span>
              </div>
            </Link>
          ))}

          {/* terminal card: the invitation */}
          <Link
            href={`/${locale}/catalogue`}
            className="group relative flex h-[64vh] min-h-[420px] max-h-[620px] w-[82vw] shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-3xl marble-dark sm:w-[380px] lg:w-[420px]"
          >
            <p className="eyebrow mb-5 text-[#e4cd9a]">{t("cat.hero.eyebrow")}</p>
            <span className="px-8 text-center font-serif text-[32px] font-medium leading-tight text-[#fbf7f2]">
              {t("cat.hero.title")}
            </span>
            <span className="mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#c6a15b] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.6)] transition-transform duration-300 group-hover:scale-110">
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

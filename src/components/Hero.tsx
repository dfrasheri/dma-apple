"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealLines } from "@/components/fx/RevealLines";
import { useT, useLocale } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Two DISTINCT slide sets (owner's direction): desktop keeps the landscape
// photography (slide 2 replaced with the park family portrait); mobile shows
// ONLY the two portrait-orientation family photos — none of the desktop shots.
const DESKTOP_SLIDES = [
  { src: "/images/dma/interiors/family-hero.jpg", pos: "center 12%" }, // opening slide
  { src: "/images/dma/heroes/family-park-hero.jpg", pos: "center 30%" },
  { src: "/images/dma/interiors/couple2-hero.jpg", pos: "center 24%" },
];
const MOBILE_SLIDES = [
  { src: "/images/dma/heroes/family-sofa-mobile.jpg", pos: "center 30%" },
  { src: "/images/dma/heroes/family-generations-mobile.jpg", pos: "center 25%" },
];

const INTERVAL = 5500; // autoplay interval
const SPEED = 900; // crossfade duration (ms)

/** Viewport-based mobile detection (same 639px breakpoint the chat sheet uses). */
function useIsMobileViewport(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return mobile;
}

export function Hero() {
  const isMobile = useIsMobileViewport();
  const slides = isMobile ? MOBILE_SLIDES : DESKTOP_SLIDES;
  const [active, setActive] = useState(0);
  // Previous slide index, tracked without a ref so it's safe to read during
  // render (see "Storing information from previous renders" in the React docs).
  const [prev, setPrev] = useState(0);
  const [trackedActive, setTrackedActive] = useState(0);
  if (active !== trackedActive) {
    setPrev(trackedActive);
    setTrackedActive(active);
  }
  // Switching slide sets (mobile ↔ desktop) restarts the deck cleanly. Done
  // during render (not in an effect) per the same previous-render pattern.
  const [trackedIsMobile, setTrackedIsMobile] = useState(isMobile);
  if (trackedIsMobile !== isMobile) {
    setTrackedIsMobile(isMobile);
    setActive(0);
    setPrev(0);
    setTrackedActive(0);
  }
  const t = useT();
  const { locale } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (i: number) => {
      setActive((i + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    const id = setInterval(() => go(active + 1), INTERVAL);
    return () => clearInterval(id);
  }, [active, go]);

  // Scroll-away scene: as the visitor leaves the hero, the copy rises and
  // dissolves faster than the photography (which sinks and swells) — a
  // depth-of-field parting-of-layers rather than a flat scroll-off.
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const copy = copyRef.current;
    if (!section || !media || !copy || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to(copy, { yPercent: -34, opacity: 0, ease: "none" }, 0);
      tl.to(media, { yPercent: 16, scale: 1.08, ease: "none" }, 0);
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Entrance for everything around the masked headline.
  const container = {
    hidden: {},
    show: {
      transition: prefersReducedMotion ? {} : { staggerChildren: 0.12, delayChildren: 0.9 },
    },
  };
  const item = prefersReducedMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 0.9 } },
      };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-[100svh] min-h-[560px] max-h-[1000px] w-full items-center justify-center overflow-hidden bg-[#171310]"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        {slides.map((s, i) => {
          const isActive = i === active;
          const isPrev = i === prev && !isActive;
          const x = prefersReducedMotion ? "0%" : isActive ? "0%" : isPrev ? "-18%" : "100%";
          return (
            <motion.div
              key={s.src}
              className="absolute inset-0"
              initial={false}
              animate={{ x, opacity: isActive ? 1 : 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.3, ease: "easeOut" }
                  : { type: "spring", bounce: 0, duration: SPEED / 1000 }
              }
              style={{ zIndex: isActive ? 2 : 1, willChange: "transform, opacity" }}
            >
              <motion.div
                className="h-full w-full bg-cover"
                initial={false}
                animate={{ scale: isActive && !prefersReducedMotion ? 1.07 : 1 }}
                transition={{ duration: (INTERVAL + SPEED) / 1000, ease: "easeOut" }}
                style={{
                  backgroundImage: `url(${s.src})`,
                  backgroundPosition: s.pos,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Warm espresso scrim + gold vignette — dark-marble mood, never grey */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#171310]/60 via-[#171310]/25 to-[#171310]/85" />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(120% 80% at 50% 42%, transparent 55%, rgba(154,118,56,0.25))" }}
      />

      {/* Gold corner brackets — the formal frame (desktop). */}
      <div aria-hidden className="pointer-events-none absolute inset-6 z-20 hidden sm:block">
        <span className="absolute left-0 top-0 h-12 w-12 border-l border-t border-[#e4cd9a]/50" />
        <span className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#e4cd9a]/50" />
        <span className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#e4cd9a]/50" />
        <span className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#e4cd9a]/50" />
      </div>

      {/* Overlay content */}
      <div ref={copyRef} className="relative z-30 flex max-w-[960px] flex-col items-center px-6 text-center will-change-transform">
        <motion.div variants={container} initial="hidden" animate="show" className="contents">
          <motion.p variants={item} className="eyebrow mb-6 text-[#e4cd9a]" style={{ order: 0 }}>
            {t("hero.eyebrow")}
          </motion.p>
        </motion.div>

        {/* The showpiece: masked, word-by-word cinematic reveal */}
        <RevealLines
          as="h1"
          text={t("hero.title")}
          start={null}
          delay={0.35}
          stagger={0.09}
          className="text-display font-serif font-medium text-[#fbf7f2] [text-wrap:balance]"
        />

        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.span variants={item} className="mt-8 h-px w-20 bg-gradient-to-r from-transparent via-[#c6a15b] to-transparent" />
          <motion.p
            variants={item}
            className="mt-6 font-sans text-[13px] uppercase tracking-[0.32em] text-[#e4cd9a]/90"
          >
            Dental Med Austria · Tirana, Albania
          </motion.p>
          <motion.div variants={item} className="mt-10 flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={`/${locale}/contact`}
              className="gold-shimmer-host inline-flex items-center justify-center rounded-full bg-[#c6a15b] px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("nav.contact")}
            </Link>
            <Link
              href={`/${locale}/care`}
              className="inline-flex items-center justify-center rounded-full border border-[#e4cd9a]/50 px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#fbf7f2] backdrop-blur-sm transition-colors duration-200 hover:border-[#e4cd9a] hover:bg-[#fbf7f2]/10"
            >
              {t("btn.services")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className={
              "h-[6px] rounded-full transition-all duration-500 " +
              (i === active ? "w-8 bg-[#c6a15b]" : "w-[6px] bg-[#fbf7f2]/40 hover:bg-[#fbf7f2]/70")
            }
          />
        ))}
      </div>

      {/* Scroll cue — a gold thread that keeps drawing downward */}
      <div aria-hidden className="absolute bottom-0 right-8 z-30 hidden h-24 w-px overflow-hidden sm:block">
        <motion.span
          className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#e4cd9a] to-[#c6a15b]"
          animate={prefersReducedMotion ? undefined : { y: ["-100%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}

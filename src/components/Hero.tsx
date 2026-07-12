"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useT } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

// Unique interior shots only, no repeats. Opens on the corridor/lounge.
const SLIDES = [
  "/images/dma/interiors/family-hero.jpg", // opening slide
  "/images/dma/interiors/couple-hero.jpg",
  "/images/dma/interiors/couple2-hero.jpg",
];

const INTERVAL = 5000; // autoplay interval
const SPEED = 900; // crossfade duration (ms)

export function Hero() {
  const [active, setActive] = useState(0);
  // Previous slide index, tracked without a ref so it's safe to read during
  // render (see "Storing information from previous renders" in the React
  // docs) -- adjusts synchronously before paint, no extra effect/frame.
  const [prev, setPrev] = useState(0);
  const [trackedActive, setTrackedActive] = useState(0);
  if (active !== trackedActive) {
    setPrev(trackedActive);
    setTrackedActive(active);
  }
  const t = useT();
  const prefersReducedMotion = usePrefersReducedMotion();

  const go = useCallback((i: number) => {
    setActive((i + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(active + 1), INTERVAL);
    return () => clearInterval(t);
  }, [active, go]);

  return (
    <section id="top" className="relative h-[100svh] min-h-[500px] max-h-[945px] w-full overflow-hidden bg-[#071522]">
      {SLIDES.map((src, i) => {
        const isActive = i === active;
        const isPrev = i === prev && !isActive;
        // incoming parks at right; outgoing exits left; only the two in play animate
        // (reduced motion: cross-fade in place, no slide)
        const x = prefersReducedMotion ? "0%" : isActive ? "0%" : isPrev ? "-22%" : "100%";
        return (
          <motion.div
            key={src}
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
              animate={{ scale: isActive && !prefersReducedMotion ? 1.06 : 1 }}
              transition={{ duration: (INTERVAL + SPEED) / 1000, ease: "easeOut" }}
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: i === 0 ? "center 10%" : "center 22%",
              }}
            />
          </motion.div>
        );
      })}

      {/* scrim */}
      <div className="absolute inset-0 z-10 bg-black/25" />

      {/* overlay content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="eyebrow mb-5 text-white/95">{t("hero.eyebrow")}</p>
        <h1 className="text-display font-serif font-normal">
          {t("hero.title")}
        </h1>
      </div>

      {/* dots */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => go(i)}
            className={
              "h-[10px] w-[10px] rounded-full border border-white/80 transition-all duration-300 " +
              (i === active ? "bg-white" : "bg-transparent hover:bg-white/40")
            }
          />
        ))}
      </div>
    </section>
  );
}

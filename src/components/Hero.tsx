"use client";

import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

// Unique interior shots only, no repeats. Opens on the corridor/lounge.
const SLIDES = [
  "/images/dma/interiors/family-hero.jpg", // opening slide
  "/images/dma/interiors/couple-hero.jpg",
  "/images/dma/interiors/couple2-hero.jpg",
];

const INTERVAL = 5000; // Owl autoplayTimeout
const SPEED = 900; // Owl smartSpeed
const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // smooth easeOutQuad, Owl-like

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
        const x = isActive ? "0%" : isPrev ? "-22%" : "100%";
        const animating = isActive || isPrev;
        return (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              transform: `translateX(${x})`,
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              transition: animating
                ? `transform ${SPEED}ms ${EASE}, opacity ${SPEED}ms ${EASE}`
                : "none",
              willChange: "transform, opacity",
            }}
          >
            <div
              className="h-full w-full bg-cover"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: i === 0 ? "center 10%" : "center 22%",
                transform: isActive ? "scale(1.06)" : "scale(1)",
                transition: isActive ? `transform ${INTERVAL + SPEED}ms ease-out` : "none",
              }}
            />
          </div>
        );
      })}

      {/* scrim */}
      <div className="absolute inset-0 z-10 bg-black/25" />

      {/* overlay content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="eyebrow mb-5 text-white/95">{t("hero.eyebrow")}</p>
        <h1 className="font-serif font-normal leading-[1.04]" style={{ fontSize: "clamp(40px, 5vw, 66px)" }}>
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

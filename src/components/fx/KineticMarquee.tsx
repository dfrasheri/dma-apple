"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Kinetic type band — gigantic Newsreader italic words drifting horizontally,
 * outline-stroked except one gold-foil word, with a scroll-velocity-reactive
 * nudge (the strip leans into your scroll). Pure showpiece, zero layout cost.
 */
export function KineticMarquee({
  words,
  className,
  /** index of the word rendered in solid gold foil */
  goldIndex = 0,
  /** background treatment */
  dark = false,
}: {
  words: string[];
  className?: string;
  goldIndex?: number;
  dark?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Base drift: a seamless -50% loop.
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });

      // Scroll-velocity reaction: scrolling speeds the drift and skews the type.
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 220);
          gsap.to(loop, { timeScale: 1 + Math.abs(v) * 0.35, duration: 0.3, overwrite: true });
          gsap.to(track, { skewX: -v * 0.6, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        },
      });
      // Settle back when scrolling stops.
      const settle = gsap.delayedCall(0, () => {});
      const idle = ScrollTrigger.addEventListener("scrollEnd", () => {
        gsap.to(loop, { timeScale: 1, duration: 0.8 });
        gsap.to(track, { skewX: 0, duration: 0.8, ease: "power2.out" });
      });
      return () => {
        st.kill();
        settle.kill();
        ScrollTrigger.removeEventListener("scrollEnd", idle as unknown as () => void);
      };
    }, track);
    return () => ctx.revert();
  }, [prefersReducedMotion, words.length]);

  const sequence = [...words, ...words]; // duplicate for the seamless -50% loop

  return (
    <div
      aria-hidden
      className={cn(
        "relative select-none overflow-hidden py-6 sm:py-10",
        dark ? "bg-[#241c15]" : "bg-[#fbf7f2]",
        className,
      )}
    >
      <div ref={trackRef} className="flex w-max items-baseline gap-[0.9em] whitespace-nowrap will-change-transform">
        {sequence.map((w, i) => {
          const gold = i % words.length === goldIndex;
          return (
            <span key={i} className="flex items-baseline gap-[0.9em]">
              <span
                className={cn(
                  "font-serif italic leading-none tracking-[-0.02em]",
                  "text-[clamp(64px,11vw,150px)]",
                  gold
                    ? "gold-foil not-italic"
                    : dark
                      ? "text-transparent [-webkit-text-stroke:1px_rgba(228,205,154,0.4)]"
                      : "text-transparent [-webkit-text-stroke:1px_rgba(154,118,56,0.38)]",
                )}
              >
                {w}
              </span>
              <span className={cn("h-2 w-2 shrink-0 self-center rounded-full", dark ? "bg-[#c6a15b]/60" : "bg-[#c6a15b]/70")} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

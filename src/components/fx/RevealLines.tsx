"use client";

import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealLinesProps = {
  /** Plain text only — split into words and masked line-by-line. */
  text: string;
  as?: ElementType;
  className?: string;
  /** seconds between each word's reveal */
  stagger?: number;
  delay?: number;
  /** ScrollTrigger start; omit to play immediately on mount (heroes) */
  start?: string | null;
  style?: React.CSSProperties;
};

/**
 * Awwwards-style masked text reveal: each word sits inside an overflow-hidden
 * clip and rises from below with a soft rotation, staggered — the cinematic
 * "curtain" type entrance. Falls back to static text under reduced motion.
 */
export function RevealLines({
  text,
  as,
  className,
  stagger = 0.055,
  delay = 0,
  start = "top 85%",
  style,
}: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-reveal-word]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 115, rotate: 4, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger,
          delay,
          ...(start ? { scrollTrigger: { trigger: el, start, once: true } } : {}),
        },
      );
    }, el);
    return () => ctx.revert();
  }, [text, stagger, delay, start, prefersReducedMotion]);

  const words = text.split(/\s+/).filter(Boolean);

  // createElement sidesteps the polymorphic-JSX ref inference issue (same
  // pattern as Reveal.tsx). Words are pre-wrapped in masks so there is no
  // flash of unstyled text: under reduced motion they render plain.
  return createElement(
    Tag,
    // eslint-disable-next-line react-hooks/refs
    { ref, className, style, "aria-label": text },
    words.map((w, i) => (
      <span
        key={i}
        aria-hidden
        className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-top"
      >
        <span
          data-reveal-word
          className="inline-block will-change-transform"
          style={prefersReducedMotion ? undefined : { transform: "translateY(115%)", opacity: 0 }}
        >
          {w}
        </span>
        {i < words.length - 1 ? " " : null}
      </span>
    )),
  );
}

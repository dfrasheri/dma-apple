"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll-scrubbed parallax. Put an image (or any media) inside; it drifts
 * vertically (and optionally scales) as the wrapper crosses the viewport,
 * giving sections physical depth. The wrapper clips the overdraw.
 */
export function Parallax({
  children,
  className,
  /** total vertical drift in % of element height (positive = media moves down) */
  amount = 12,
  /** scale the media slightly so the drift never reveals edges */
  scale = 1.15,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scale?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -amount / 2, scale },
        {
          yPercent: amount / 2,
          scale,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, wrap);
    return () => ctx.revert();
  }, [amount, scale, prefersReducedMotion]);

  return (
    <div ref={wrapRef} className={cn("overflow-hidden", className)}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

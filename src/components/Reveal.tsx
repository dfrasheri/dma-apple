"use client";

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** vertical offset to travel from (px) */
  y?: number;
  /** micro-scale to grow from, e.g. 0.99 for a subtle "breathe" (omit for none) */
  scale?: number;
  /** seconds */
  duration?: number;
  delay?: number;
  /** GSAP ease, matches the original's power-curve feel */
  ease?: string;
  /** when true, animate direct children with a stagger instead of the element itself */
  stagger?: number;
  /** ScrollTrigger start, e.g. "top 85%" */
  start?: string;
  style?: React.CSSProperties;
};

export function Reveal({
  children,
  as,
  className,
  y = 24,
  scale,
  duration = 0.9,
  delay = 0,
  ease = "power3.out",
  stagger,
  start = "top 85%",
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger != null ? Array.from(el.children) : el;

    if (prefersReduced) {
      gsap.set(targets, { opacity: 1, y: 0, ...(scale != null ? { scale: 1 } : {}) });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y, ...(scale != null ? { scale } : {}) },
        {
          opacity: 1,
          y: 0,
          ...(scale != null ? { scale: 1 } : {}),
          duration,
          delay,
          ease,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, scale, duration, delay, ease, stagger, start, prefersReduced]);

  // createElement (not <Tag/>) sidesteps a JSX children-type inference issue that
  // surfaces on the polymorphic ElementType under the current React 19 typings.
  // Tag is always a host tag name string (e.g. "div"/"footer") at every call
  // site, so ref forwarding here is the normal host-element case, not a
  // custom-component ref read; the linter can't see that statically.
  // eslint-disable-next-line react-hooks/refs
  return createElement(Tag, { ref, className, style }, children);
}

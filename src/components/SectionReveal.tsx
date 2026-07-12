"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * Wraps a home-page section so it "breathes" into view: a soft fade paired with
 * a gentle rise and a micro-scale as the section scrolls in. Reduced-motion
 * visitors simply get the settled state (handled inside Reveal).
 */
export function SectionReveal({ children }: { children: ReactNode }) {
  return (
    <Reveal y={26} scale={0.99} duration={1.1} ease="power2.out" start="top 88%">
      {children}
    </Reveal>
  );
}

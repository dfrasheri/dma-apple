"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion, usePrefersReducedTransparency } from "@/hooks/useReducedMotion";

/**
 * Mirrors the user's reduced-motion/reduced-transparency OS preference onto
 * `<html data-motion="reduce">` / `data-transparency="reduce"` so CSS
 * materials (which can't call a React hook) can key off an attribute
 * selector in addition to the raw `@media` query.
 */
export function MotionPreferenceSync() {
  const reduceMotion = usePrefersReducedMotion();
  const reduceTransparency = usePrefersReducedTransparency();

  useEffect(() => {
    document.documentElement.toggleAttribute("data-motion-reduce", reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-transparency-reduce", reduceTransparency);
  }, [reduceTransparency]);

  return null;
}

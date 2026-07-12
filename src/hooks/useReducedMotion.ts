"use client";

import { useSyncExternalStore } from "react";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when the user has requested reduced motion (OS/browser setting). */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True when the user has requested reduced transparency (OS/browser setting). */
export function usePrefersReducedTransparency() {
  return useMediaQuery("(prefers-reduced-transparency: reduce)");
}

"use client";

import { useEffect, useState } from "react";

export type Tier = "high" | "low";

type NavWithCaps = Navigator & { deviceMemory?: number };

/** Client-only capability probe (reduced-motion + performance tier). */
export function useCapabilities() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tier, setTier] = useState<Tier>("high");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 768;
    const nav = navigator as NavWithCaps;
    const mem = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const low = coarse || narrow || mem <= 4 || cores <= 4;
    // Client-only capability probe (matchMedia/navigator) -- can't run
    // during SSR, so these seed their real values on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(rm);
    setTier(low ? "low" : "high");
    setReady(true);
  }, []);

  return { reducedMotion, tier, ready };
}

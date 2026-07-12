"use client";

/**
 * Drag-to-reveal before/after comparison slider.
 *
 * Takes two separate images (the halves of a dental before/after export,
 * pre-cropped by scripts/crop-before-after.mjs). The "after" image renders
 * in-flow and defines the tile size; the "before" image is overlaid and
 * progressively clipped from the left. On mount it auto-animates from
 * mostly-after to center so the visitor immediately understands the
 * interaction.
 *
 * Dragging tracks the pointer 1:1 (Pointer Events + capture), rubber-bands
 * past the 2–98% bounds instead of hard-clamping, and on release keeps the
 * release velocity: the divider coasts to a momentum-projected rest point
 * instead of stopping dead where the finger lifted.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "motion";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface Props {
  before: string;
  after: string;
  alt: string;
  className?: string;
}

const MIN = 2;
const MAX = 98;
const RUBBER_DIMENSION = 20; // max extra "give" (percentage points) past a bound
const RUBBER_CONSTANT = 0.55;
const DECELERATION = 0.998; // Apple's scroll-feel exponential decay rate
const HISTORY_MS = 100; // how far back to look for a release-velocity sample

/** Progressive resistance past a bound (skill §9) instead of a hard stop. */
function rubberband(overshoot: number) {
  return (overshoot * RUBBER_DIMENSION * RUBBER_CONSTANT) / (RUBBER_DIMENSION + RUBBER_CONSTANT * Math.abs(overshoot));
}

/** Momentum projection (skill §6): exponential decay, not v²/2a. */
function project(velocityPxPerSec: number) {
  return ((velocityPxPerSec / 1000) * DECELERATION) / (1 - DECELERATION);
}

export function BeforeAfterSlider({ before, after, alt, className }: Props) {
  const [pos, setPos] = useState(80); // start mostly showing "before"
  const posRef = useRef(80);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const revealed = useRef(false);
  const settleAnim = useRef<ReturnType<typeof animate> | null>(null);
  const history = useRef<{ x: number; t: number }[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const setPosBoth = useCallback((v: number) => {
    posRef.current = v;
    setPos(v);
  }, []);

  // Auto-reveal: slide from 80 → 50 once the element enters the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || revealed.current) return;
        revealed.current = true;
        if (prefersReducedMotion) {
          setPosBoth(50);
          return;
        }
        settleAnim.current?.stop();
        settleAnim.current = animate(80, 50, {
          type: "spring",
          bounce: 0,
          duration: 1.1,
          onUpdate: setPosBoth,
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion, setPosBoth]);

  const posFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return null;
    const { left, width } = el.getBoundingClientRect();
    const raw = ((clientX - left) / width) * 100;
    if (raw < MIN) return MIN - rubberband(MIN - raw);
    if (raw > MAX) return MAX + rubberband(raw - MAX);
    return raw;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      settleAnim.current?.stop(); // grabbing mid-settle takes over immediately (interruptible)
      dragging.current = true;
      el.setPointerCapture(e.pointerId);
      history.current = [{ x: e.clientX, t: e.timeStamp }];
      const next = posFromClientX(e.clientX);
      if (next != null) setPosBoth(next);
    },
    [posFromClientX, setPosBoth],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      history.current.push({ x: e.clientX, t: e.timeStamp });
      const cutoff = e.timeStamp - HISTORY_MS;
      while (history.current.length > 2 && history.current[0].t < cutoff) history.current.shift();
      const next = posFromClientX(e.clientX);
      if (next != null) setPosBoth(next);
    },
    [posFromClientX, setPosBoth],
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      containerRef.current?.releasePointerCapture(e.pointerId);

      const width = containerRef.current?.getBoundingClientRect().width ?? 1;
      const samples = history.current;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last && first ? (last.t - first.t) / 1000 : 0;
      const velocityPxPerSec = dt > 0.001 ? (last.x - first.x) / dt : 0;

      // If still in rubber-band overshoot, the true resting position is the bound itself.
      const released = Math.max(MIN, Math.min(MAX, posRef.current));
      const target = Math.max(MIN, Math.min(MAX, released + (project(velocityPxPerSec) / width) * 100));
      setPosBoth(released);

      if (prefersReducedMotion || Math.abs(target - released) < 0.05) {
        if (target !== released) setPosBoth(target);
        return;
      }
      settleAnim.current?.stop();
      settleAnim.current = animate(released, target, {
        type: "spring",
        bounce: 0.12,
        velocity: (velocityPxPerSec / width) * 100,
        onUpdate: setPosBoth,
      });
    },
    [prefersReducedMotion, setPosBoth],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full cursor-col-resize touch-none select-none overflow-hidden rounded-sm bg-[#111]",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* After, in-flow, defines the tile's natural aspect ratio */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={alt}
        draggable={false}
        className="pointer-events-none block w-full align-top"
      />

      {/* Before, overlaid, progressively clipped by the slider */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Divider line */}
      <div
        className="pointer-events-none absolute inset-y-0"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)]" />
        {/* Handle circle */}
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-2xl ring-1 ring-black/10">
          <svg
            viewBox="0 0 22 14"
            className="h-[14px] w-[18px] text-[#071522]"
            fill="currentColor"
          >
            <path d="M6.5 1L1 7l5.5 6M15.5 1L21 7l-5.5 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      {pos > 14 && (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-white">
          Before
        </span>
      )}
      {pos < 86 && (
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-white">
          After
        </span>
      )}
    </div>
  );
}

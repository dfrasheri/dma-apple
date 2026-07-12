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
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  before: string;
  after: string;
  alt: string;
  className?: string;
}

export function BeforeAfterSlider({ before, after, alt, className }: Props) {
  const [pos, setPos] = useState(80); // start mostly showing "before"
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const animated = useRef(false);

  // Auto-reveal: slide from 80 → 50 once the element enters the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        const from = 80;
        const to = 50;
        const duration = 1100;
        let start: number | null = null;
        function frame(ts: number) {
          if (start === null) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
          setPos(from + (to - from) * eased);
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const calc = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - left) / width) * 100)));
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full cursor-col-resize select-none overflow-hidden rounded-sm bg-[#111]",
        className,
      )}
      onMouseDown={(e) => { dragging.current = true; calc(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) calc(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; calc(e.touches[0].clientX); }}
      onTouchMove={(e) => { if (dragging.current) calc(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
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

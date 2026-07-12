"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** A plain photo, or a before/after pair rendered as a drag slider. */
export type SmilePhoto = string | { before: string; after: string };

/**
 * Irregular masonry collage. Photos keep their natural aspect ratios and flow
 * across CSS columns, so the layout is intentionally uneven, a real collage,
 * not a rigid grid. Subtle stagger-in + hover zoom, on the navy palette.
 */
export function SmileMasonry({ photos }: { photos: SmilePhoto[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-tile]"),
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="tpds-container">
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-gap:1rem]">
        {photos.map((photo, i) => {
          if (typeof photo !== "string") {
            return (
              <figure
                key={photo.after}
                data-tile
                className="mb-4 block break-inside-avoid"
              >
                <BeforeAfterSlider
                  before={photo.before}
                  after={photo.after}
                  alt={`Before and after smile transformation at Dental Med Austria, result ${i + 1}`}
                />
              </figure>
            );
          }
          const src = photo;
          return (
            <figure
              key={src}
              data-tile
              className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-sm bg-[#eee]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Smile transformation at Dental Med Austria, patient result ${i + 1}`}
                loading="lazy"
                className="w-full align-top transition-transform duration-[1300ms] ease-out group-hover:scale-[1.05]"
              />
              <span className="pointer-events-none absolute inset-0 bg-[#071522]/0 transition-colors duration-300 group-hover:bg-[#071522]/10" />
            </figure>
          );
        })}
      </div>
    </div>
  );
}

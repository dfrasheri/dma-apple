"use client";

import { useRef } from "react";
import { InstagramIcon, ChevronRight } from "@/components/icons";

const POSTS = [
  "/images/dma/t-giovanni.jpg",
  "/images/dma/t-francesca.jpg",
  "/images/dma/t-meriton.jpg",
  "/images/dma/t-amina.jpg",
  "/images/dma/interiors/reception-wide.jpg",
  "/images/dma/reception.jpeg",
];

export function InstagramStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white py-16">
      <div className="tpds-container mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="serif-title" style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>
          Latest on Instagram
        </h2>
        <a
          href="#"
          className="inline-flex items-center gap-2 bg-[#f1f1f1] px-5 py-3 text-[14px] uppercase tracking-[1px] text-[#343434] transition-colors hover:bg-[#e2e2e2]"
        >
          <InstagramIcon className="h-4 w-4" />
          dentalmedaustria
        </a>
      </div>

      <div className="relative">
        <div ref={trackRef} className="no-scrollbar flex gap-1 overflow-x-auto">
          {POSTS.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square w-[19%] min-w-[260px] shrink-0 overflow-hidden"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                <InstagramIcon className="h-8 w-8 text-white" />
              </div>
            </a>
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={() => trackRef.current?.scrollBy({ left: 540, behavior: "smooth" })}
          className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#343434] shadow transition hover:bg-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}

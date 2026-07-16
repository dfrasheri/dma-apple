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
    <section className="section-y-sm bg-[#fbf7f2]">
      <div className="tpds-container mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow gold-foil tracking-[0.14em]">Follow Along</p>
          <h2 className="serif-title mt-2 text-[clamp(26px,3vw,38px)]">Latest on Instagram</h2>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2.5 rounded-full border border-[#9a7638]/35 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#9a7638] transition-colors duration-300 hover:border-[#9a7638] hover:bg-[#f4ecdd]"
        >
          <InstagramIcon className="h-4 w-4" />
          dentalmedaustria
        </a>
      </div>

      <div className="relative">
        <div ref={trackRef} className="no-scrollbar flex gap-4 overflow-x-auto px-4 sm:px-6">
          {POSTS.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square w-[19%] min-w-[240px] shrink-0 overflow-hidden rounded-2xl border border-[#c6a15b]/25 shadow-[var(--shadow-brand-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-brand-md)] sm:min-w-[260px]"
            >
              <div
                className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-[#241c15]/0 opacity-0 transition duration-300 group-hover:bg-[#241c15]/45 group-hover:opacity-100">
                <InstagramIcon className="h-8 w-8 text-[#e4cd9a]" />
              </div>
            </a>
          ))}
        </div>
        <button
          aria-label="Next"
          onClick={() => trackRef.current?.scrollBy({ left: 540, behavior: "smooth" })}
          className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#c6a15b]/30 bg-[#fffefb]/90 text-[#9a7638] shadow-[var(--shadow-brand-md)] backdrop-blur transition-colors duration-300 hover:bg-[#fffefb] hover:text-[#2a2018]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}

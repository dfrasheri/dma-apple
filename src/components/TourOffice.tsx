"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TOUR = [
  "/images/dma/interiors/reception-wide.jpg",
  "/images/dma/interiors/corridor-lounge.jpg",
  "/images/dma/interiors/meeting-room.jpg",
  "/images/dma/interiors/treatment-room-view.jpg",
  "/images/dma/interiors/treatment-room-green.jpg",
  "/images/dma/interiors/clinic-room-03.jpg",
];

// The "advanced technology" and "dental tourism" cards were retired: the
// PressFeatures + Accreditations + implant-systems sections that follow this
// one on the page now carry those stories.
function TourCarousel() {
  const [active, setActive] = useState(0);
  const t = useT();
  const go = useCallback((d: number) => setActive((a) => (a + d + TOUR.length) % TOUR.length), []);

  return (
    <div className="relative h-[640px] w-full overflow-hidden">
      {TOUR.map((src, i) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      <button
        aria-label={t("common.prev")}
        onClick={() => go(-1)}
        className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-[#343434] shadow transition hover:bg-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label={t("common.next")}
        onClick={() => go(1)}
        className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-[#343434] shadow transition hover:bg-white"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <h2 className="absolute bottom-10 left-10 font-serif text-[44px] font-normal text-white drop-shadow">
        {t("tour.title")}
      </h2>
    </div>
  );
}

export function TourOffice() {
  return (
    <section className="bg-white pb-20 pt-16">
      <div className="tpds-container">
        <TourCarousel />
      </div>
    </section>
  );
}

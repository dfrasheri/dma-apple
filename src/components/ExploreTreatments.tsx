"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useT, useLocale } from "@/lib/i18n";

const CARDS = [
  { key: "treat.implants", img: "/images/dma/before-after/full-mouth-rehabilitation.jpg", href: "/care/dental-implants" },
  { key: "treat.crowns", img: "/images/dma/before-after/crowns.jpg", href: "/care/dental-crowns" },
  { key: "treat.veneers", img: "/images/dma/before-after/veneers.jpg", href: "/care/dental-veneers" },
  { key: "treat.prostheses", img: "/images/dma/before-after/full-mouth-rehabilation-all-on-6.jpg", href: "/care/dental-prostheses" },
  { key: "treat.orthodontics", img: "/images/dma/before-after/bfa14.jpg", href: "/care/orthodontics" },
];

export function ExploreTreatments() {
  // Duplicate the set once so the CSS marquee's -50% translate loops seamlessly.
  const t = useT();
  const { locale } = useLocale();
  const loop = [...CARDS, ...CARDS];

  return (
    <section className="overflow-hidden bg-white pb-20 pt-6">
      <Reveal as="div" className="tpds-container" y={24}>
        <h2 className="serif-title mb-8" style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>
          {t("explore.title")}
        </h2>
      </Reveal>

      <div className="explore-marquee relative">
        <div className="explore-marquee-track flex w-max gap-6">
          {loop.map((c, i) => {
            const dup = i >= CARDS.length;
            return (
              <Link
                key={`${c.key}-${i}`}
                href={`/${locale}${c.href}`}
                aria-hidden={dup || undefined}
                tabIndex={dup ? -1 : undefined}
                className="group relative h-[380px] w-[360px] shrink-0 overflow-hidden"
              >
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${c.img})` }}
                />
                <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/25" />
                <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-serif text-[30px] font-normal text-white">
                  {t(c.key)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

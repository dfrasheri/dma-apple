/**
 * Infinite scrolling wall of technology/material partners, real brand marks
 * paired with their wordmark. Logos are desaturated to stay on the navy palette
 * and lift to full colour on hover. Pure CSS (no JS).
 */
type Brand = { name: string; logo: string | null };

const BRANDS: Brand[] = [
  { name: "Straumann", logo: "/images/brands/straumann.png" },
  { name: "Ivoclar", logo: "/images/brands/ivoclar.png" },
  { name: "ETK", logo: "/images/brands/etk-lyra.png" },
  { name: "AlphaBio", logo: null },
  { name: "Biodem", logo: "/images/brands/biodem.svg" },
];

export function BrandMarquee({
  eyebrow = "Our Trusted Partners",
  heading,
}: {
  eyebrow?: string;
  heading?: string;
}) {
  const row = [...BRANDS, ...BRANDS];

  return (
    <section className="overflow-hidden border-y border-[#ececec] bg-white py-12">
      {(eyebrow || heading) && (
        <div className="tpds-container mb-8 text-center">
          {eyebrow && <p className="eyebrow text-[#9a9a9a]">{eyebrow}</p>}
          {heading && (
            <h2 className="serif-title mt-3 text-[clamp(22px,2.6vw,32px)] leading-[1.15]">{heading}</h2>
          )}
        </div>
      )}

      <div className="tpds-marquee-mask relative">
        <div className="tpds-marquee-track flex w-max items-center">
          {row.map((b, i) => (
            <span
              key={`${b.name}-${i}`}
              className="brand-item flex shrink-0 items-center gap-3 px-9 opacity-70 transition-opacity duration-300 hover:opacity-100"
            >
              {b.logo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={b.logo}
                  alt={`${b.name} logo`}
                  className="h-7 w-7 shrink-0 object-contain grayscale transition-[filter] duration-300 hover:grayscale-0"
                  loading="lazy"
                />
              )}
              <span className="whitespace-nowrap font-serif text-[24px] font-normal tracking-[0.3px] text-[#071522]">
                {b.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

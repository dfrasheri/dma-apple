/**
 * Infinite scrolling wall of technology/material partners, real brand marks
 * paired with their wordmark. Logos rest in a warm sepia harmony on the ivory
 * ground and lift to full colour on hover. Pure CSS (no JS).
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
    <section className="section-y-sm overflow-hidden border-y border-[#e8ddc9] bg-[#fbf7f2]">
      {(eyebrow || heading) && (
        <div className="tpds-container mb-8 text-center">
          {eyebrow && <p className="eyebrow gold-foil tracking-[0.14em]">{eyebrow}</p>}
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
              className="brand-item group flex shrink-0 items-center gap-3 px-9 opacity-70 transition-opacity duration-300 hover:opacity-100"
            >
              {b.logo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={b.logo}
                  alt={`${b.name} logo`}
                  className="h-7 w-7 shrink-0 object-contain grayscale sepia-[0.35] transition-[filter] duration-300 group-hover:grayscale-0 group-hover:sepia-0"
                  loading="lazy"
                />
              )}
              <span className="whitespace-nowrap font-serif text-[24px] font-medium tracking-[0.3px] text-[#2a2018] transition-colors duration-300 group-hover:text-[#9a7638]">
                {b.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

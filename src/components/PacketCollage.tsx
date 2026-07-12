import { treatmentMeta } from "@/lib/packets";

/**
 * Composes 2-5 treatment photos into a single chic collage.
 * Layout adapts to the number of treatments; thin seams + a soft navy wash
 * keep it minimal and on-palette.
 */
export function PacketCollage({
  slugs,
  cover,
  className = "",
}: {
  slugs: string[];
  cover?: string;
  className?: string;
}) {
  // explicit cover overrides the composition
  if (cover) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="h-full w-full bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-[1.04]" style={{ backgroundImage: `url(${cover})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071522]/45 via-transparent to-transparent" />
      </div>
    );
  }

  const imgs = slugs.map((s) => treatmentMeta(s)?.image).filter(Boolean).slice(0, 5) as string[];
  const n = imgs.length;

  // per-count grid template + per-tile span classes
  const layout: { grid: string; spans: string[] } =
    n <= 1
      ? { grid: "grid-cols-1 grid-rows-1", spans: ["col-span-1 row-span-1"] }
      : n === 2
        ? { grid: "grid-cols-2 grid-rows-1", spans: ["", ""] }
        : n === 3
          ? { grid: "grid-cols-2 grid-rows-2", spans: ["col-span-1 row-span-2", "", ""] }
          : n === 4
            ? { grid: "grid-cols-2 grid-rows-2", spans: ["", "", "", ""] }
            : { grid: "grid-cols-3 grid-rows-2", spans: ["col-span-1 row-span-2", "", "", "", ""] };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`grid h-full w-full gap-[2px] bg-white ${layout.grid}`}>
        {imgs.map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden ${layout.spans[i] ?? ""}`}
          >
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-[1400ms] group-hover:scale-[1.06]"
              style={{ backgroundImage: `url(${src})` }}
            />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071522]/45 via-transparent to-transparent" />
    </div>
  );
}

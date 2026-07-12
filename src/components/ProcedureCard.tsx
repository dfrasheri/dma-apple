"use client";

import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { type CatalogueService } from "@/lib/catalogue";
import { useT, useLocale } from "@/lib/i18n";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6.1 21.3l1.2-6.6L2.5 9.5l6.6-.9L12 2.5z" />
    </svg>
  );
}

/**
 * Compact, image-less treatment card, mirrors the technology/equipment cards:
 * a bordered white tile with a serif title, short copy, brand chips and a
 * discover CTA. The whole card is one link; an accent bar wipes in and the tile
 * lifts on hover. (Previously a tall 3D flip card with procedure video/imagery.)
 */
export function ProcedureCard({
  service,
  accent,
  name,
  summary,
}: {
  service: CatalogueService;
  accent: string;
  /** kept for API compatibility with the grid; no longer used for animation. */
  index?: number;
  /** Locale-aware overrides; default to the service's English name/summary. */
  name?: string;
  summary?: string;
}) {
  const t = useT();
  const { locale } = useLocale();
  const displayName = name ?? service.name;
  const displaySummary = summary ?? service.summary;

  return (
    <Link
      href={`/${locale}/catalogue/${service.slug}`}
      aria-label={displayName}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-[#ececec] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#071522]/25 hover:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.4)]"
    >
      {/* accent bar wipes in on hover */}
      <span
        className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-[20px] font-normal leading-snug text-[#071522]">
          {displayName}
        </h3>
        {service.featured && (
          <span
            className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.8px] text-white"
            style={{ backgroundColor: accent }}
          >
            <StarIcon className="h-2.5 w-2.5" /> Popular
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-3 text-[14.5px] font-light leading-[1.55] text-[#555]">
        {displaySummary}
      </p>

      {service.brands.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {service.brands.map((b) => (
            <span
              key={b}
              className="rounded-full border px-2.5 py-[3px] text-[11px] font-medium"
              style={{ borderColor: `${accent}33`, color: accent, backgroundColor: `${accent}0d` }}
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[1.2px] transition-opacity group-hover:opacity-70" style={{ color: accent }}>
        {t("card.discover")} <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

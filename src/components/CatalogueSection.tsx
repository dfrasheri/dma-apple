import { Reveal } from "@/components/Reveal";
import { ProcedureCard } from "@/components/ProcedureCard";
import type { CatalogueCategory, CatalogueService } from "@/lib/catalogue";
import { getT, getLocale } from "@/lib/server-i18n";
import {
  locServiceName,
  locServiceSummary,
  locCategoryLabel,
  locCategoryBlurb,
} from "@/lib/catalogue-names-sq";

// Single brand accent - keeps the catalogue on the site's navy/neutral palette.
const ACCENT = "#071522";

export async function CatalogueSection({
  category,
  services,
}: {
  category: CatalogueCategory;
  services: CatalogueService[];
}) {
  const t = await getT();
  const locale = await getLocale();
  const label = locCategoryLabel(category.slug, category.label, locale);
  const blurb = locCategoryBlurb(category.slug, category.blurb, locale);
  return (
    <section id={category.slug} className="scroll-mt-[120px] py-14">
      <div className="tpds-container">
        {/* category header */}
        <Reveal className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.5fr_1fr]" y={26}>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10" style={{ backgroundColor: ACCENT }} />
              <span
                className="text-[12px] font-semibold uppercase tracking-[1.6px]"
                style={{ color: ACCENT }}
              >
                {String(services.length).padStart(2, "0")} {t("cat.section.treatments")}
              </span>
            </div>
            <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.08]">{label}</h2>
            <p className="mt-4 max-w-[560px] text-[17px] font-light leading-[1.5] text-[#555]">{blurb}</p>
          </div>
          <div className="relative h-[200px] overflow-hidden rounded-sm lg:h-[220px]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }} />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(120deg, ${ACCENT}55, transparent 60%)` }}
            />
          </div>
        </Reveal>

        {/* service cards, animated, flip-to-reveal procedure cards */}
        <Reveal
          className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
          y={24}
        >
          {services.map((s, i) => (
            <div key={s.slug} id={s.slug} className="scroll-mt-[120px]">
              <ProcedureCard
                service={s}
                accent={ACCENT}
                index={i}
                name={locServiceName(s.slug, s.name, locale)}
                summary={locServiceSummary(s.slug, s.summary, locale)}
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

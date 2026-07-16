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

// Single brand accent - burnished gold, keeps the catalogue on the Gilded palette.
const ACCENT = "#c6a15b";

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
    <section id={category.slug} className="section-y-sm scroll-mt-[120px]">
      <div className="tpds-container">
        {/* category header */}
        <Reveal className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.5fr_1fr]" y={26}>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10" style={{ backgroundColor: ACCENT }} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#9a7638]">
                {String(services.length).padStart(2, "0")} {t("cat.section.treatments")}
              </span>
            </div>
            <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.08] [text-wrap:balance]">{label}</h2>
            <p className="mt-4 max-w-[560px] text-[17px] font-light leading-[1.5] text-[#6e6152]">{blurb}</p>
          </div>
          <div className="relative h-[200px] overflow-hidden rounded-3xl shadow-[var(--shadow-brand-md)] lg:h-[220px]">
            <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }} />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(120deg, rgba(36,28,21,0.45), transparent 60%)" }}
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

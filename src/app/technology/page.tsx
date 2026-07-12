import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { BrandMarquee } from "@/components/BrandMarquee";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { EQUIPMENT_CATEGORIES, equipmentByCategory, EQUIPMENT } from "@/lib/equipment";
import { clinicJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getT, getLocale } from "@/lib/server-i18n";
import { locEquipmentSummary } from "@/lib/catalogue-names-sq";

export const metadata: Metadata = {
  title: "Technology & Equipment | Dental Med Austria - Tirana, Albania",
  description:
    "Inside the Dental Med Austria clinic and laboratory: Vatech 3D CBCT imaging, iMES iCORE 5-axis CAD/CAM milling, Dekema furnaces, and premium brands like Straumann and Ivoclar.",
  keywords: [
    "dental clinic technology Albania",
    "CBCT Tirana",
    "CAD/CAM dental lab Albania",
    "guided implant surgery",
    "Straumann Tirana",
    "Vatech CBCT",
    "Dental Med Austria equipment",
  ],
  alternates: { canonical: "/technology" },
  openGraph: {
    title: "Technology & Equipment | Dental Med Austria",
    description: "Hospital-grade imaging, in-house CAD/CAM milling, and premium European brands in Tirana, Albania.",
    type: "website",
    images: [{ url: "/images/dma/clinic-xray.jpg" }],
  },
};

const equipmentItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Dental Med Austria - Technology & Equipment",
  numberOfItems: EQUIPMENT.length,
  itemListElement: EQUIPMENT.map((e, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Product", name: `${e.brand} ${e.model}`, description: e.summary, brand: e.brand },
  })),
};

export default async function TechnologyPage() {
  const t = await getT();
  const locale = await getLocale();
  return (
    <PageShell>
      <JsonLd
        data={[
          clinicJsonLd,
          equipmentItemList,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Technology", path: "/technology" },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t("tech.hero.eyebrow")}
        title={t("tech.hero.title")}
        image="/images/dma/interiors/lab-detail-1.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.technology") }]}
      />

      <section className="bg-white pt-[70px]">
        <Reveal className="tpds-container max-w-[860px] text-center" stagger={0.1} y={26}>
          <p className="eyebrow mb-4 text-[#9a9a9a]">
            {EQUIPMENT.length}+ {t("tech.stats.devices")} · {EQUIPMENT_CATEGORIES.length} {t("tech.stats.categories")} · {t("tech.stats.oneRoof")}
          </p>
          <h2 className="serif-title text-[clamp(26px,3vw,38px)] leading-[1.15]">
            {t("tech.intro.heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-[17px] font-light leading-[1.5] text-[#555]">
            {t("tech.intro.text")}
          </p>
        </Reveal>
      </section>

      <div className="mt-12">
        <BrandMarquee heading={t("brand.heading")} />
      </div>

      {/* sticky category nav */}
      <nav className="sticky top-[94px] z-30 border-b border-[#ececec] bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="tpds-container">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto py-3">
            {EQUIPMENT_CATEGORIES.map((c) => (
              <li key={c.slug} className="shrink-0">
                <a
                  href={`#${c.slug}`}
                  className="block whitespace-nowrap rounded-full border border-[#e2e2e2] px-4 py-1.5 text-[13px] font-medium text-[#444] transition-colors hover:border-[#071522] hover:text-[#071522]"
                >
                  {t(`equipcat.${c.slug}.label`)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="divide-y divide-[#f0f0f0] bg-white">
        {EQUIPMENT_CATEGORIES.map((cat) => {
          const items = equipmentByCategory(cat.slug);
          return (
            <section key={cat.slug} id={cat.slug} className="scroll-mt-[120px] py-14">
              <div className="tpds-container">
                <Reveal y={24}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-10 bg-[#071522]" />
                    <span className="text-[12px] font-semibold uppercase tracking-[1.6px] text-[#071522]">
                      {String(items.length).padStart(2, "0")} {items.length === 1 ? t("tech.system") : t("tech.systems")}
                    </span>
                  </div>
                  <h2 className="serif-title text-[clamp(26px,3.2vw,40px)] leading-[1.08]">{t(`equipcat.${cat.slug}.label`)}</h2>
                  <p className="mt-3 max-w-[620px] text-[17px] font-light leading-[1.5] text-[#555]">{t(`equipcat.${cat.slug}.blurb`)}</p>
                </Reveal>

                <Reveal className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05} y={22}>
                  {items.map((e) => (
                    <article
                      key={`${e.brand}-${e.model}`}
                      className="group relative flex flex-col overflow-hidden rounded-sm border border-[#ececec] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#071522]/25 hover:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.4)]"
                    >
                      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[#071522] transition-transform duration-300 group-hover:scale-x-100" />
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-[#9a9a9a]">{e.brand}</p>
                        {e.flagship && (
                          <span className="shrink-0 rounded-full bg-[#071522] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.8px] text-white">
                            {t("tech.flagship")}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-serif text-[21px] font-normal leading-snug text-[#071522]">{e.model}</h3>
                      <p className="mt-3 text-[15px] font-light leading-[1.55] text-[#555]">{locEquipmentSummary(e.brand, e.model, e.summary, locale)}</p>
                    </article>
                  ))}
                </Reveal>
              </div>
            </section>
          );
        })}
      </div>

      <section className="bg-[#071522] py-[90px] text-center">
        <Reveal className="tpds-container max-w-[760px]" stagger={0.12} y={28}>
          <p className="eyebrow mb-4 text-white/70">{t("tech.cta.eyebrow")}</p>
          <h2 className="font-serif text-[clamp(28px,3.4vw,44px)] font-normal leading-[1.1] text-white">
            {t("tech.cta.heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-light text-white/80">
            {t("tech.cta.text")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-3 bg-white px-[34px] py-[15px] text-[14px] uppercase tracking-[1.5px] text-[#071522] transition-colors hover:bg-[#e6e6e6]"
            >
              {t("tech.cta.bookVisit")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/catalogue`}
              className="inline-flex items-center gap-3 border border-white/30 px-[34px] py-[15px] text-[14px] uppercase tracking-[1.5px] text-white transition-colors hover:bg-white/10"
            >
              {t("tech.cta.catalogue")}
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

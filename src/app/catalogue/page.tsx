import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { CatalogueSection } from "@/components/CatalogueSection";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { OFFICIAL_CATEGORIES, OFFICIAL_SERVICES, officialServicesByCategory } from "@/lib/catalogue";
import { clinicJsonLd, catalogueItemListJsonLd, catalogueFaqJsonLd, breadcrumbJsonLd, PAGE_META, buildAlternates } from "@/lib/seo";
import { getT, getLocale } from "@/lib/server-i18n";
import { locCategoryLabel } from "@/lib/catalogue-names-sq";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = PAGE_META[locale];
  return {
    title: m.catalogue.title,
    description: m.catalogue.description,
    keywords: [
      "dental implants Albania",
      "All-on-4 Tirana",
      "All-on-6 Albania",
      "porcelain veneers Tirana",
      "Hollywood smile Albania",
      "zirconia crowns Albania",
      "Invisalign Tirana",
      "dental tourism Albania",
      "teeth whitening Tirana",
      "Dental Med Austria",
    ],
    alternates: buildAlternates(locale, "/catalogue"),
    openGraph: {
      title: m.catalogue.title,
      description: m.catalogue.description,
      type: "website",
      images: [{ url: "/images/dma/interiors/reception-wide.jpg" }],
    },
  };
}

export default async function CataloguePage() {
  const featuredCount = OFFICIAL_SERVICES.filter((s) => s.featured).length;
  const t = await getT();
  const locale = await getLocale();

  return (
    <PageShell>
      <JsonLd
        data={[
          clinicJsonLd,
          catalogueItemListJsonLd,
          catalogueFaqJsonLd,
          breadcrumbJsonLd([
            { name: t("nav.home"), path: "/" },
            { name: t("cat.detail.catalogueCrumb"), path: "/catalogue" },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t("cat.hero.eyebrow")}
        title={t("cat.hero.title")}
        image="/images/dma/interiors/reception-wide.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.catalogue") }]}
      />

      {/* intro + stats */}
      <section className="bg-white pt-[70px]">
        <Reveal className="tpds-container max-w-[860px] text-center" stagger={0.1} y={26}>
          <p className="eyebrow mb-4 text-[#9a9a9a]">
            {OFFICIAL_SERVICES.length} {t("cat.stats.treatments")} · {OFFICIAL_CATEGORIES.length} {t("cat.stats.specialties")} · {featuredCount} {t("cat.stats.requested")}
          </p>
          <h2 className="serif-title text-[clamp(26px,3vw,38px)] leading-[1.15]">
            {t("cat.intro.heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-[17px] font-light leading-[1.5] text-[#555]">
            {t("cat.intro.text")}
          </p>
        </Reveal>
      </section>

      {/* sticky category nav */}
      <nav className="sticky top-[94px] z-30 mt-10 border-y border-[#ececec] bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="tpds-container">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto py-3">
            {OFFICIAL_CATEGORIES.map((c) => (
              <li key={c.slug} className="shrink-0">
                <a
                  href={`#${c.slug}`}
                  className="block whitespace-nowrap rounded-full border border-[#e2e2e2] px-4 py-1.5 text-[13px] font-medium text-[#444] transition-colors hover:border-[#071522] hover:text-[#071522]"
                >
                  {locCategoryLabel(c.slug, c.label, locale)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* category sections, strictly the official 2026 treatment list */}
      <div className="divide-y divide-[#f0f0f0] bg-white">
        {OFFICIAL_CATEGORIES.map((cat) => (
          <CatalogueSection key={cat.slug} category={cat} services={officialServicesByCategory(cat.slug)} />
        ))}
      </div>

      {/* closing CTA */}
      <section className="bg-[#071522] py-[90px] text-center">
        <Reveal className="tpds-container max-w-[760px]" stagger={0.12} y={28}>
          <p className="eyebrow mb-4 text-white/70">{t("cat.cta.eyebrow")}</p>
          <h2 className="font-serif text-[clamp(28px,3.4vw,44px)] font-normal leading-[1.1] text-white">
            {t("cat.cta.heading")}
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-light text-white/80">
            {t("cat.cta.text")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-3 bg-white px-[34px] py-[15px] text-[14px] uppercase tracking-[1.5px] text-[#071522] transition-colors hover:bg-[#e6e6e6]"
            >
              {t("cat.cta.requestPlan")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${locale}/care`}
              className="inline-flex items-center gap-3 border border-white/30 px-[34px] py-[15px] text-[14px] uppercase tracking-[1.5px] text-white transition-colors hover:bg-white/10"
            >
              {t("cat.cta.featured")}
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

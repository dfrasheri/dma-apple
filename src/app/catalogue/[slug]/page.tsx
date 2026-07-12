import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { CATALOGUE_SERVICES, CATALOGUE_CATEGORIES, servicesByCategory } from "@/lib/catalogue";
import { localizedTreatmentContent, localizedSections } from "@/lib/catalogue-i18n";
import { locServiceName, locServiceSummary, locCategoryLabel } from "@/lib/catalogue-names-sq";
import {
  StepByStep,
  CandidatesList,
  RecoveryTimeline,
  Comparisons,
  MaintenanceList,
  CostNote,
  WhyDMA,
} from "@/components/catalogue/ProcedureSections";
import { LeadRailForm } from "@/components/LeadRailForm";
import { SITE_URL, breadcrumbJsonLd, PAGE_META, buildAlternates } from "@/lib/seo";
import { getT, getLocale } from "@/lib/server-i18n";

const ACCENT = "#071522";

export function generateStaticParams() {
  return CATALOGUE_SERVICES.map((s) => ({ slug: s.slug }));
}

function lookup(slug: string) {
  const service = CATALOGUE_SERVICES.find((s) => s.slug === slug);
  if (!service) return null;
  const category = CATALOGUE_CATEGORIES.find((c) => c.slug === service.category);
  return { service, category };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = lookup(slug);
  if (!data) return { title: "Treatment | Dental Med Austria" };
  const { service, category } = data;
  const locale = await getLocale();
  const m = PAGE_META[locale];
  const name = locServiceName(service.slug, service.name, locale);
  const title = m.catTitleTpl(name);
  const description = m.catDescTpl(name);
  return {
    title,
    description,
    keywords: [name, `${name} Albania`, `${name} Tirana`, locCategoryLabel(category?.slug, category?.label ?? "", locale), "Dental Med Austria"],
    alternates: buildAlternates(locale, `/catalogue/${slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: category?.image ?? "/images/dma/interiors/reception-wide.jpg" }],
    },
  };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = lookup(slug);
  if (!data) notFound();
  const { service, category } = data;
  const locale = await getLocale();
  const t = await getT();
  const content = localizedTreatmentContent(slug, locale);
  const serviceName = locServiceName(service.slug, service.name, locale);
  const serviceSummary = locServiceSummary(service.slug, service.summary, locale);
  const categoryLabel = locCategoryLabel(
    category?.slug,
    category?.label ?? t("cat.detail.treatmentFallback"),
    locale,
  );


  const related = servicesByCategory(service.category)
    .filter((s) => s.slug !== slug)
    .slice(0, 3);

  // Resolve the full set of rich landing-page sections (per-service content wins,
  // category defaults fill the gaps) so every treatment page has the same depth.
  // For non-English locales the pre-translated section overlay is used when present.
  const sections = content
    ? localizedSections(service, category, content, locale)
    : null;

  const url = `${SITE_URL}/catalogue/${slug}`;
  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: serviceName,
    description: content?.description ?? serviceSummary,
    url,
    image: `${SITE_URL}${category?.image ?? "/images/dma/interiors/reception-wide.jpg"}`,
    category: categoryLabel, ...(sections?.steps.length
      ? { howPerformed: sections.steps.map((p) => `${p.title}: ${p.text}`).join(" ") }
      : {}),
    provider: { "@id": `${SITE_URL}/#clinic` },
  };
  const faqJsonLd = content?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <PageShell>
      <JsonLd
        data={[
          procedureJsonLd, ...(faqJsonLd ? [faqJsonLd] : []),
          breadcrumbJsonLd([
            { name: t("nav.home"), path: "/" },
            { name: t("cat.detail.catalogueCrumb"), path: "/catalogue" },
            { name: serviceName, path: `/catalogue/${slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={categoryLabel}
        title={serviceName}
        image={category?.image ?? "/images/dma/interiors/reception-wide.jpg"}
        crumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.catalogue"), href: "/catalogue" },
          { label: serviceName },
        ]}
      />

      {/* right-docked lead form: same funnel as chat/WhatsApp (CRM + notify) */}
      <LeadRailForm service={serviceName} />

      {/* intro */}
      <section className="bg-white py-[70px]">
        <div className="tpds-container">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_0.9fr]">
            <Reveal stagger={0.1} y={26}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10" style={{ backgroundColor: ACCENT }} />
                <span className="text-[12px] font-semibold uppercase tracking-[1.6px]" style={{ color: ACCENT }}>
                  {categoryLabel}
                </span>
              </div>
              <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] leading-[1.15]">{serviceName}</h2>
              <p className="mt-5 text-[18px] font-light leading-[1.6] text-[#444]">{content?.intro ?? serviceSummary}</p>
              {content?.details?.map((para, i) => (
                <p key={i} className="mt-4 text-[16px] font-light leading-[1.6] text-[#555]">{para}</p>
              ))}
              {content?.aftercare && (
                <p className="mt-4 text-[16px] font-light italic leading-[1.6] text-[#555]">{content.aftercare}</p>
              )}

              {content?.idealFor && (
                <p className="mt-6 border-l-2 pl-4 text-[16px] italic leading-[1.5] text-[#555]" style={{ borderColor: ACCENT }}>
                  <span className="font-medium not-italic text-[#071522]">{t("cat.detail.idealFor")} </span>
                  {content.idealFor}
                </p>
              )}

              {service.brands.length > 0 && (
                <div className="mt-7">
                  <p className="mb-2 text-[12px] uppercase tracking-[1.3px] text-[#9a9a9a]">{t("cat.detail.materials")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.brands.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border px-2.5 py-[3px] text-[12px] font-medium"
                        style={{ borderColor: `${ACCENT}33`, color: ACCENT, backgroundColor: `${ACCENT}0d` }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Reveal>

            {/* benefits card */}
            {content?.benefits?.length ? (
              <Reveal y={28}>
                <div className="rounded-sm border border-[#ececec] bg-[#fafafa] p-7">
                  <h3 className="font-serif text-[22px] font-normal text-[#071522]">{t("cat.detail.whyChoose")}</h3>
                  <ul className="mt-5 space-y-4">
                    {content.benefits.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-[1.5] text-[#444]">
                        <CheckIcon className="mt-[2px] h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {content.duration && (
                    <p className="mt-6 border-t border-[#ececec] pt-4 text-[13px] uppercase tracking-[1.2px] text-[#9a9a9a]">
                      {t("cat.detail.typicalSession")} · <span className="text-[#071522]">{content.duration}</span>
                    </p>
                  )}
                </div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>

      {/* rich landing-page sections, same structure on every treatment page */}
      {sections && (
        <>
          <StepByStep
            steps={sections.steps}
            eyebrow={t("cat.detail.procedureEyebrow")}
            heading={t("cat.detail.procedureHeading")}
          />
          <CandidatesList
            items={sections.candidates}
            eyebrow={t("cat.detail.whoEyebrow")}
            heading={t("cat.detail.whoHeading")}
          />
          <RecoveryTimeline
            items={sections.recovery}
            eyebrow={t("cat.detail.recoveryEyebrow")}
            heading={t("cat.detail.recoveryHeading")}
          />
          <Comparisons
            items={sections.comparisons}
            eyebrow={t("cat.detail.goodToKnowEyebrow")}
            heading={t("cat.detail.goodToKnowHeading")}
          />
          <MaintenanceList
            items={sections.maintenance}
            eyebrow={t("cat.detail.careEyebrow")}
            heading={t("cat.detail.careHeading")}
          />
          <CostNote
            text={sections.costNote}
            eyebrow={t("cat.detail.costEyebrow")}
            heading={t("cat.detail.costHeading")}
          />
          <WhyDMA
            eyebrow={t("cat.detail.whyEyebrow")}
            heading={t("cat.detail.whyHeading")}
            reasons={[0, 1, 2, 3, 4, 5].map((i) => ({
              title: t(`cat.why.r${i}.title`),
              text: t(`cat.why.r${i}.text`),
            }))}
          />
        </>
      )}

      {/* FAQs */}
      {content?.faqs?.length ? (
        <section className="bg-white py-[70px]">
          <div className="tpds-container max-w-[820px]">
            <Reveal y={24}>
              <p className="eyebrow mb-3 text-[#9a9a9a]">{t("cat.detail.frequentlyAsked")}</p>
              <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{t("cat.detail.questionsPrefix")} {serviceName.toLowerCase()}</h2>
            </Reveal>
            <Reveal className="mt-8 divide-y divide-[#ececec] border-y border-[#ececec]" stagger={0.08} y={18}>
              {content.faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-normal text-[#071522]">
                    {f.q}
                    <span className="shrink-0 text-[#9a9a9a] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-[16px] font-light leading-[1.6] text-[#555]">{f.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* related */}
      {related.length > 0 && (
        <section className="bg-[#f7f7f5] py-[70px]">
          <div className="tpds-container">
            <Reveal y={24}>
              <p className="eyebrow mb-3 text-[#9a9a9a]">{categoryLabel}</p>
              <h2 className="serif-title text-[clamp(22px,2.6vw,32px)]">{t("cat.detail.relatedTreatments")}</h2>
            </Reveal>
            <Reveal className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3" stagger={0.08} y={22}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/catalogue/${r.slug}`}
                  className="group block bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-24px_rgba(0,0,0,0.4)]"
                >
                  <h3 className="font-serif text-[20px] font-normal text-[#071522]">{locServiceName(r.slug, r.name, locale)}</h3>
                  <p className="mt-2 line-clamp-3 text-[14px] font-light leading-[1.5] text-[#666]">{locServiceSummary(r.slug, r.summary, locale)}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[1.2px]" style={{ color: ACCENT }}>
                    {t("cat.detail.learnMore")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#071522] py-[80px] text-center">
        <Reveal className="tpds-container max-w-[700px]" stagger={0.12} y={26}>
          <h2 className="font-serif text-[clamp(26px,3.2vw,40px)] font-normal leading-[1.1] text-white">
            {t("cat.detail.consideringPrefix")} {serviceName.toLowerCase()}{t("cat.detail.consideringSuffix")}
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] font-light text-white/80">
            {t("cat.detail.ctaText")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href={`/${locale}/contact`} className="inline-flex items-center gap-3 bg-white px-[32px] py-[14px] text-[13px] uppercase tracking-[1.5px] text-[#071522] transition-colors hover:bg-[#e6e6e6]">
              {t("cat.cta.requestPlan")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={`/${locale}/catalogue`} className="inline-flex items-center gap-3 border border-white/30 px-[32px] py-[14px] text-[13px] uppercase tracking-[1.5px] text-white transition-colors hover:bg-white/10">
              {t("cat.detail.allTreatments")}
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

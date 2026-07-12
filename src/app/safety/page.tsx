import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Intro, ProseSection, CtaBand } from "@/components/content";
import { JsonLd } from "@/components/JsonLd";
import { clinicJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getT, getLocale } from "@/lib/server-i18n";
import { KNOWLEDGE, type KnowledgeEntry } from "@/lib/clinic-knowledge";
import { locSafety, locSafetyBullets } from "@/lib/clinic-knowledge-sq";

export const metadata: Metadata = {
  title: "Safety & Hygiene | Sterilisation & Infection Control | Dental Med Austria",
  description:
    "How Dental Med Austria keeps every patient safe: every instrument sterilised after every patient, ISO 9001 quality management and European infection-control protocols, applied to every appointment in Tirana, Albania.",
  keywords: [
    "dental sterilisation Albania",
    "gold-standard sterilisation",
    "dental autoclave sterilisation Tirana",
    "dental hygiene infection control",
    "is dental treatment in Albania safe",
    "ISO 9001 dental clinic",
    "Dental Med Austria safety",
  ],
  alternates: { canonical: "/safety" },
  openGraph: {
    title: "Safety & Hygiene | Dental Med Austria",
    description:
      "Every instrument sterilised after every patient, ISO 9001 quality management and European infection-control protocols, applied to every appointment.",
    type: "website",
    images: [{ url: "/images/dma/interiors/clinic-room-03.jpg" }],
  },
};

/** Look an entry up by id from the shared knowledge index (single source of truth). */
function entry(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE.find((e) => e.id === id);
}

/** The safety:* sections, in the order they read best on the page. */
const SECTION_IDS = [
  "safety:overview",
  "safety:instrument-reprocessing",
  "safety:surface-unit-disinfection",
  "safety:single-use-disposables",
  "safety:water-line-hygiene",
  "safety:hand-hygiene-ppe",
  "safety:sterile-implant-surgery",
  "safety:materials-provenance",
  "safety:iso-9001",
];

const FAQ_IDS = [
  "faq:safety:albania-hygienic",
  "faq:safety:what-sterilisation",
  "faq:safety:materials-genuine",
];

export default async function SafetyPage() {
  const t = await getT();
  const locale = await getLocale();

  // Localize each knowledge entry (title + body + bullets) into the active locale.
  const loc = (e: KnowledgeEntry) => ({
    id: e.id,
    title: locSafety(e.id, "title", e.title, locale),
    body: locSafety(e.id, "body", e.body, locale),
    bullets: locSafetyBullets(e.id, e.bullets, locale),
    numbered: e.numbered ?? false,
  });
  const sections = (SECTION_IDS.map(entry).filter(Boolean) as KnowledgeEntry[]).map(loc);
  const [overview, ...rest] = sections;
  const faqs = (FAQ_IDS.map(entry).filter(Boolean) as KnowledgeEntry[]).map(loc);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.title,
      acceptedAnswer: { "@type": "Answer", text: f.body },
    })),
  };

  return (
    <PageShell>
      <JsonLd
        data={[
          clinicJsonLd,
          faqJsonLd,
          breadcrumbJsonLd([
            { name: t("nav.home"), path: "/" },
            { name: t("safety.breadcrumb"), path: "/safety" },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t("safety.hero.eyebrow")}
        title={t("safety.hero.title")}
        image="/images/dma/interiors/clinic-room-03.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("safety.breadcrumb") }]}
      />

      {overview && <Intro eyebrow={t("safety.intro.tagline")} text={overview.body} />}

      {rest.map((sec, i) => (
        <ProseSection
          key={sec.id}
          heading={sec.title}
          paragraphs={[sec.body]}
          bullets={sec.bullets}
          numbered={sec.numbered}
          flip={i % 2 === 1}
        />
      ))}

      {faqs.length > 0 && (
        <ProseSection
          heading={t("safety.faq.heading")}
          paragraphs={faqs.flatMap((f) => [f.title, f.body])}
        />
      )}

      <CtaBand
        heading={t("safety.cta.heading")}
        text={t("safety.cta.text")}
        chips={t("safety.cta.chips").split("·").map((s) => s.trim())}
      />
    </PageShell>
  );
}

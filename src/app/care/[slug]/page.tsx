import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { LeadRailForm } from "@/components/LeadRailForm";
import { Intro, ProseSection, TreatmentGrid, CtaBand } from "@/components/content";
import { PROCEDURES } from "@/lib/pages";
import { getT, getLocale } from "@/lib/server-i18n";
import { SITE_URL, PAGE_META, buildAlternates, breadcrumbJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proc = PROCEDURES.find((p) => p.slug === slug);
  if (!proc) return { title: "Care | Dental Med Austria" };
  const locale = await getLocale();
  const t = await getT();
  const m = PAGE_META[locale];
  const name = t(`proc.${proc.slug}.name`);
  const title = m.careTitleTpl(name);
  const description = m.careDescTpl(name);
  return {
    title,
    description,
    keywords: [name, `${name} Albania`, `${name} Tirana`, "Dental Med Austria"],
    alternates: buildAlternates(locale, `/care/${slug}`),
    openGraph: { title, description, type: "article", images: [{ url: proc.image }] },
  };
}

export default async function ProcedurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proc = PROCEDURES.find((p) => p.slug === slug);
  if (!proc) notFound();
  const t = await getT();

  const name = t(`proc.${proc.slug}.name`);
  const body = proc.body.map((_, i) => t(`proc.${proc.slug}.body.${i}`));
  const treatments = proc.treatments.map((_, i) => ({
    title: t(`proc.${proc.slug}.t${i}.title`),
    text: t(`proc.${proc.slug}.t${i}.text`),
  }));

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name,
    description: t(`proc.${proc.slug}.intro`),
    url: `${SITE_URL}/care/${slug}`,
    image: `${SITE_URL}${proc.image}`,
    ...(treatments.length
      ? { howPerformed: treatments.map((tr) => `${tr.title}: ${tr.text}`).join(" ") }
      : {}),
    provider: { "@id": `${SITE_URL}/#clinic` },
  };

  return (
    <PageShell>
      <JsonLd
        data={[
          procedureJsonLd,
          breadcrumbJsonLd([
            { name: t("nav.home"), path: "/" },
            { name: t("nav.care"), path: "/care" },
            { name, path: `/care/${slug}` },
          ]),
        ]}
      />
      <LeadRailForm service={name} />
      <PageHero
        eyebrow={t(`proc.${proc.slug}.eyebrow`)}
        title={name}
        image={proc.image}
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.care"), href: "/care" }, { label: name }]}
      />
      <Intro text={t(`proc.${proc.slug}.intro`)} />
      <ProseSection heading={`${t("care.detail.aboutPrefix")} ${name}`} paragraphs={body} image={proc.image} />
      <TreatmentGrid items={treatments} />
      <CtaBand
        heading={`${t("care.detail.ctaPrefix")} ${name.toLowerCase()}${t("care.detail.ctaSuffix")}`}
        text={t("care.detail.ctaText")}
      />
    </PageShell>
  );
}

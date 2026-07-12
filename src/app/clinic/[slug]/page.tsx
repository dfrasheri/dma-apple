import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Intro, ProseSection, CtaBand } from "@/components/content";
import { CLINIC_PAGES } from "@/lib/pages";
import { getT } from "@/lib/server-i18n";

export function generateStaticParams() {
  return CLINIC_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = CLINIC_PAGES.find((p) => p.slug === slug);
  return { title: page ? `${page.title} | Dental Med Austria` : "Clinic" };
}

export default async function ClinicSubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = CLINIC_PAGES.find((p) => p.slug === slug);
  if (!page) notFound();
  const t = await getT();

  const title = t(`clinic.${page.slug}.title`);

  return (
    <PageShell>
      <PageHero
        eyebrow={t(`clinic.${page.slug}.eyebrow`)}
        title={title}
        image={page.image}
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.clinic"), href: "/clinic/our-story" }, { label: title }]}
      />
      <Intro text={t(`clinic.${page.slug}.intro`)} />
      {page.sections.map((s, i) => (
        <ProseSection
          key={s.heading}
          heading={t(`clinic.${page.slug}.s${i}.heading`)}
          paragraphs={s.paragraphs.map((_, j) => t(`clinic.${page.slug}.s${i}.p${j}`))}
          image={i === 0 ? page.image : undefined}
          flip={i % 2 === 1}
        />
      ))}
      <CtaBand heading={t("clinic.detail.cta.heading")} />
    </PageShell>
  );
}

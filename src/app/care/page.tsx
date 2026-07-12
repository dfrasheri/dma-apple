import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Intro, CtaBand } from "@/components/content";
import { Reveal } from "@/components/Reveal";
import { PROCEDURES } from "@/lib/pages";
import { getT, getLocale } from "@/lib/server-i18n";
import { PAGE_META, buildAlternates } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();
  const m = PAGE_META[locale];
  return {
    title: m.care.title,
    description: m.care.description,
    alternates: buildAlternates(locale, "/care"),
    openGraph: {
      title: m.care.title,
      description: m.care.description,
      type: "website",
      images: [{ url: "/images/dma/clinic-xray.jpg" }],
    },
  };
}

export default async function CarePage() {
  const t = await getT();
  const locale = await getLocale();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("care.hero.eyebrow")}
        title={t("care.hero.title")}
        image="/images/dma/clinic-xray.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.care") }]}
      />
      <Intro
        eyebrow={t("care.intro.eyebrow")}
        text={t("care.intro.text")}
      />
      <section className="bg-white pb-[80px]">
        <div className="tpds-container">
          <Reveal className="grid grid-cols-1 gap-8 md:grid-cols-2" stagger={0.12} y={28}>
            {PROCEDURES.map((p) => (
              <Link key={p.slug} href={`/${locale}/care/${p.slug}`} className="group relative block h-[420px] overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-105"
                  style={{ backgroundImage: `url(${p.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                <div className="absolute bottom-9 left-9 right-9 text-white">
                  <p className="eyebrow mb-2 text-white/85">{t(`proc.${p.slug}.eyebrow`)}</p>
                  <h3 className="font-serif text-[34px] font-normal leading-none">{t(`proc.${p.slug}.name`)}</h3>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
      <CtaBand heading={t("care.cta.heading")} text={t("care.cta.text")} />
    </PageShell>
  );
}

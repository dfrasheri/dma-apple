import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { PacketsList } from "@/components/PacketsList";
import { CtaBand } from "@/components/content";
import { getT } from "@/lib/server-i18n";

export const metadata: Metadata = {
  title: "Treatment Packages | Dental Med Austria - Tirana, Albania",
  description:
    "Curated dental treatment packages at Dental Med Austria in Tirana - smile makeovers, full-arch implants, and complete restorations combined into one journey. Free remote plan in 24-48h.",
  alternates: { canonical: "/packets" },
};

export default async function PacketsPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("packets.hero.eyebrow")}
        title={t("packets.hero.title")}
        image="/images/dma/interiors/reception-wide.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.packets") }]}
      />
      <PacketsList />
      <CtaBand
        heading={t("packets.cta.heading")}
        text={t("packets.cta.text")}
      />
    </PageShell>
  );
}

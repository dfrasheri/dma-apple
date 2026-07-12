import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PageHero } from "@/components/PageHero";
import { Intro, CtaBand } from "@/components/content";
import { SmileMasonry, type SmilePhoto } from "@/components/SmileMasonry";
import { getT } from "@/lib/server-i18n";

export const metadata: Metadata = {
  title: "Smile Gallery | Dental Med Austria - Tirana, Albania",
  description:
    "Real smile transformations from Dental Med Austria patients in Tirana - veneers, crowns, implants, and complete smile makeovers. See the results for yourself.",
  alternates: { canonical: "/smiles" },
};

// Stacked composites split into halves by scripts/crop-before-after.mjs so the
// slider compares the real before (top photo) against the after (bottom photo).
const ba = (name: string): SmilePhoto => ({
  before: `/images/dma/before-after/${name}-before.jpg`,
  after: `/images/dma/before-after/${name}-after.jpg`,
});

// Real before/after transformations and happy-patient portraits.
const PHOTOS: SmilePhoto[] = [
  ba("crowns"),
  "/images/dma/patients/patient-smile-2.jpg",
  ba("veneers"),
  ba("full-mouth-rehabilation-all-on-6"),
  "/images/dma/patients/patient-smile-3.jpg",
  ba("crowns-1"),
  ba("veneers-1"),
  "/images/dma/patients/patient-portrait-1.jpg",
  ba("full-mouth-rehabilitation"),
  ba("bfa14"),
  "/images/dma/patients/patient-smile-1.jpg",
  ba("crowns-2"),
  ba("veneers-3"),
  "/images/dma/patients/patient-smile-4.jpg",
  ba("bfa20"),
  ba("crowns-5"),
  "/images/dma/patients/patient-smile-5.jpg",
  "/images/dma/patients/patient-happy-1.jpg",
  ba("veneers-4"),
  "/images/dma/before-after/bfa29.jpg",
  "/images/dma/patients/patient-smile-6.jpg",
  "/images/dma/patients/patient-happy-2.jpg",
  ba("full-mouth-rehabilitation-1"),
  "/images/dma/before-after/bfa35.jpg",
  "/images/dma/patients/patient-smile-8.jpg",
  "/images/dma/patients/patient-happy-3.jpg",
  ba("crowns-6"),
];

export default async function SmilesPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("smilespage.hero.eyebrow")}
        title={t("smilespage.hero.title")}
        image="/images/dma/patients/patient-smile-2.jpg"
        crumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.smiles") }]}
      />
      <Intro
        eyebrow={t("smilespage.intro.eyebrow")}
        text={t("smilespage.intro.text")}
        big
      />
      <section className="bg-white pb-[90px]">
        <SmileMasonry photos={PHOTOS} />
      </section>
      <CtaBand
        heading={t("smilespage.cta.heading")}
        text={t("smilespage.cta.text")}
      />
    </PageShell>
  );
}

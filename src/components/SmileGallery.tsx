"use client";

import Link from "next/link";
import { useT, useLocale } from "@/lib/i18n";

export function SmileGallery() {
  const t = useT();
  const { locale } = useLocale();
  return (
    <section className="relative mt-16 h-[620px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/dma/patients/patient-smile-2.jpg)" }}
      />
      {/* warm espresso wash for legibility, deepening toward the base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#171310]/30 via-[#171310]/35 to-[#171310]/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-[#fbf7f2]">
        <p className="eyebrow mb-4 tracking-[0.14em] text-[#e4cd9a]">{t("smiles.eyebrow")}</p>
        <h2 className="font-serif text-[clamp(34px,4.2vw,56px)] font-medium leading-[1.05]">
          {t("smiles.title")}
        </h2>
        <span aria-hidden className="gold-rule mt-6 block w-24" />
        <Link
          href={`/${locale}/smiles`}
          className="gold-shimmer-host mt-9 inline-flex items-center justify-center rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          {t("smiles.cta")}
        </Link>
      </div>
    </section>
  );
}

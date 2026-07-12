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
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        <p className="eyebrow mb-4 text-white/95">{t("smiles.eyebrow")}</p>
        <h2 className="font-serif font-normal leading-[1.05]" style={{ fontSize: "clamp(34px, 4.2vw, 56px)" }}>
          {t("smiles.title")}
        </h2>
        <Link
          href={`/${locale}/smiles`}
          className="mt-8 inline-flex items-center justify-center bg-white/90 px-[30px] py-[14px] text-[18px] uppercase tracking-[0.5px] text-[#343434] transition-colors duration-300 hover:bg-white"
        >
          {t("smiles.cta")}
        </Link>
      </div>
    </section>
  );
}

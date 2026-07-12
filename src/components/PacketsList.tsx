"use client";

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { PacketCollage } from "@/components/PacketCollage";
import { ArrowRight } from "@/components/icons";
import { usePackets, treatmentMeta } from "@/lib/packets";
import { useT, useLocale } from "@/lib/i18n";
import { PACKET_I18N_SQ } from "@/lib/catalogue-names-sq";

export function PacketsList() {
  const packets = usePackets();
  const t = useT();
  const { locale } = useLocale();
  const packetTitle = (id: string, fallback: string) =>
    locale === "sq" ? PACKET_I18N_SQ[id]?.title ?? fallback : fallback;
  const packetSubtitle = (id: string, fallback: string) =>
    locale === "sq" ? PACKET_I18N_SQ[id]?.subtitle ?? fallback : fallback;

  return (
    <section className="bg-white py-[80px]">
      <div className="tpds-container">
        <Reveal className="mx-auto mb-14 max-w-[760px] text-center" stagger={0.1} y={26}>
          <p className="eyebrow mb-4 text-[#9a9a9a]">{t("packets.list.eyebrow")}</p>
          <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.12]">{t("packets.list.heading")}</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-light leading-[1.5] text-[#555]">
            {t("packets.list.text")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {packets.map((p, i) => (
            <Reveal key={p.id} y={28} delay={i % 2 === 0 ? 0 : 0.08}>
              <article className="group">
                <div className="relative h-[360px] w-full overflow-hidden">
                  <PacketCollage slugs={p.treatmentSlugs} cover={p.cover} className="h-full w-full" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <p className="text-[11px] uppercase tracking-[1.6px] text-white/75">{p.treatmentSlugs.length} {t("packets.list.bundle")}</p>
                    <h3 className="mt-2 font-serif text-[30px] font-normal leading-tight">{packetTitle(p.id, p.title)}</h3>
                  </div>
                </div>

                <p className="mt-5 text-[16px] font-light leading-[1.5] text-[#555]">{packetSubtitle(p.id, p.subtitle)}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.treatmentSlugs.map((s) => {
                    const m = treatmentMeta(s, locale);
                    return (
                      <Link
                        key={s}
                        href={`/${locale}/catalogue/${s}`}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#071522]/15 bg-white py-1 pl-1 pr-3.5 text-[12px] font-medium text-[#343434] transition-colors hover:border-[#071522] hover:text-[#071522]"
                      >
                        <span
                          className="h-6 w-6 shrink-0 rounded-full bg-cover bg-center ring-1 ring-black/5"
                          style={{ backgroundImage: `url(${m?.image})` }}
                        />
                        {m?.name ?? s}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={`/${locale}/contact`}
                  className="mt-6 inline-flex items-center gap-3 text-[13px] uppercase tracking-[1.4px] text-[#071522] hover:opacity-60"
                >
                  {t("packets.list.enquire")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

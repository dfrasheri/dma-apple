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
    <section className="section-y bg-[#fbf7f2]">
      <div className="tpds-container">
        <Reveal className="mx-auto mb-14 max-w-[760px] text-center" stagger={0.1} y={26}>
          <p className="eyebrow gold-foil mb-4">{t("packets.list.eyebrow")}</p>
          <h2 className="serif-title text-[clamp(28px,3.4vw,42px)] leading-[1.12] [text-wrap:balance]">{t("packets.list.heading")}</h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] font-light leading-[1.5] text-[#6e6152]">
            {t("packets.list.text")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {packets.map((p, i) => (
            <Reveal key={p.id} y={28} delay={i % 2 === 0 ? 0 : 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#9a7638]/15 bg-[#fffefb] shadow-[var(--shadow-brand-sm)] transition-all duration-500 hover:-translate-y-1 hover:border-[#9a7638]/30 hover:shadow-[var(--shadow-brand-xl)]">
                <div className="relative h-[320px] w-full overflow-hidden sm:h-[360px]">
                  <PacketCollage slugs={p.treatmentSlugs} cover={p.cover} className="h-full w-full" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-[#fbf7f2]">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#e4cd9a]">{p.treatmentSlugs.length} {t("packets.list.bundle")}</p>
                    <h3 className="mt-2 font-serif text-[30px] font-normal leading-tight [text-wrap:balance]">{packetTitle(p.id, p.title)}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-7 pt-6">
                  <span aria-hidden="true" className="gold-rule mb-5 block w-full" />
                  <p className="text-[16px] font-light leading-[1.5] text-[#6e6152]">{packetSubtitle(p.id, p.subtitle)}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.treatmentSlugs.map((s) => {
                      const m = treatmentMeta(s, locale);
                      return (
                        <Link
                          key={s}
                          href={`/${locale}/catalogue/${s}`}
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#9a7638]/25 bg-[#f4ecdd] py-1 pl-1 pr-3.5 text-[12px] font-medium text-[#9a7638] transition-colors duration-300 hover:border-[#9a7638] hover:text-[#2a2018]"
                        >
                          <span
                            className="h-6 w-6 shrink-0 rounded-full bg-cover bg-center ring-1 ring-[#9a7638]/20"
                            style={{ backgroundImage: `url(${m?.image})` }}
                          />
                          {m?.name ?? s}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-auto pt-7">
                    <Link
                      href={`/${locale}/contact`}
                      className="gold-shimmer-host inline-flex items-center justify-center gap-3 rounded-full bg-[#c6a15b] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {t("packets.list.enquire")} <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/icons";
import { getT, getLocale } from "@/lib/server-i18n";

export function Intro({
  eyebrow,
  text,
  big = false,
}: {
  eyebrow?: string;
  text: string;
  /** Slogan-sized statement text (e.g. the Smiles page motto). */
  big?: boolean;
}) {
  return (
    <section className="section-y bg-[#fbf7f2]">
      <Reveal className="tpds-container max-w-[900px] text-center" stagger={0.12} y={28}>
        {eyebrow && <p className="eyebrow gold-foil mb-5">{eyebrow}</p>}
        <p
          className={
            big
              ? "font-serif text-[clamp(34px,4.5vw,56px)] font-medium leading-[1.18] tracking-[-0.6px] text-[#2a2018] [text-wrap:balance]"
              : "font-serif text-[clamp(22px,2.6vw,30px)] font-normal leading-[1.32] tracking-[-0.4px] text-[#2a2018] [text-wrap:balance]"
          }
        >
          {text}
        </p>
        <span className="mx-auto mt-8 block h-px w-20 bg-gradient-to-r from-transparent via-[#c6a15b] to-transparent" />
      </Reveal>
    </section>
  );
}

/**
 * A scannable list under a ProseSection. `numbered` renders ordered steps
 * (single column, so sequence reads top-to-bottom); otherwise it is a compact
 * two-column checklist of short items.
 */
function BulletList({ items, numbered }: { items: string[]; numbered?: boolean }) {
  if (numbered) {
    return (
      <ol className="mt-6 space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-4 text-[16px] leading-[1.55] text-[#2a2018]">
            <span className="mt-px flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#c6a15b] font-serif text-[13px] font-medium text-[#241c15]">
              {i + 1}
            </span>
            <span className="pt-[2px]">{it}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.5] text-[#2a2018]">
          <span className="mt-[9px] h-[6px] w-[6px] flex-none rounded-full bg-[#c6a15b]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProseSection({
  heading,
  paragraphs,
  bullets,
  numbered,
  flip,
  image,
}: {
  heading: string;
  paragraphs: string[];
  /** Optional scannable list rendered after the paragraphs. */
  bullets?: string[];
  /** Render `bullets` as a numbered sequence rather than a checklist. */
  numbered?: boolean;
  flip?: boolean;
  image?: string;
}) {
  if (image) {
    return (
      <section className="bg-[#fbf7f2] py-12">
        <div className="tpds-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal className={flip ? "lg:order-2" : ""} y={30}>
              <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-brand-lg)]">
                <div
                  className="h-[420px] w-full bg-cover bg-center transition-transform duration-[1400ms] ease-out hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${image})` }}
                />
              </div>
            </Reveal>
            <Reveal className={flip ? "lg:order-1" : ""} stagger={0.1} y={28}>
              <span className="gold-rule mb-6 block w-16" />
              <h2 className="serif-title mb-6 text-[clamp(26px,3vw,36px)] leading-[1.15]">{heading}</h2>
              <div className="space-y-5 text-[17px] leading-[1.65] text-[#6e6152]">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {bullets && bullets.length > 0 && <BulletList items={bullets} numbered={numbered} />}
            </Reveal>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-[#fbf7f2] py-12">
      <Reveal className="tpds-container max-w-[820px]" stagger={0.1} y={28}>
        <span className="gold-rule mb-6 block w-16" />
        <h2 className="serif-title mb-6 text-[clamp(26px,3vw,36px)] leading-[1.15]">{heading}</h2>
        <div className="space-y-5 text-[17px] leading-[1.65] text-[#6e6152]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {bullets && bullets.length > 0 && <BulletList items={bullets} numbered={numbered} />}
      </Reveal>
    </section>
  );
}

export function TreatmentGrid({
  items,
}: {
  items: { title: string; text: string }[];
}) {
  return (
    <section className="section-y-sm bg-[#f4ecdd]">
      <div className="tpds-container">
        <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.1} y={24}>
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border-t border-[#c6a15b]/40 bg-[#fffefb] p-10 shadow-[var(--shadow-brand-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-brand-md)]"
            >
              <h3 className="font-serif text-[24px] font-medium text-[#2a2018]">{it.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.6] text-[#6e6152]">{it.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function BioGrid({
  title,
  people,
}: {
  title?: string;
  people: { slug: string; name: string; role: string; image: string; href: string }[];
}) {
  // An empty roster renders nothing, no orphaned heading over a blank grid.
  if (people.length === 0) return null;
  return (
    <section className="bg-white py-[70px]">
      <div className="tpds-container">
        {title && (
          <Reveal y={24}>
            <h2 className="serif-title mb-10 text-center text-[clamp(28px,3.2vw,40px)]">{title}</h2>
          </Reveal>
        )}
        <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1} y={28}>
          {people.map((p) => (
            <Link key={p.slug} href={p.href} className="group block">
              <div className="relative h-[360px] overflow-hidden rounded-3xl shadow-[var(--shadow-brand-md)]">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-[1200ms] group-hover:scale-105"
                  style={{ backgroundImage: `url(${p.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/60 via-transparent to-transparent" />
                <span className="pointer-events-none absolute inset-3 rounded-2xl border border-[#e4cd9a]/0 transition-all duration-500 group-hover:border-[#e4cd9a]/50" />
              </div>
              <h3 className="mt-5 font-serif text-[22px] font-medium text-[#2a2018] transition-colors group-hover:text-[#9a7638]">{p.name}</h3>
              <p className="mt-1 text-[13px] font-semibold uppercase tracking-[1.6px] text-[#a99a8b]">{p.role}</p>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export async function CtaBand({
  heading,
  text,
  chips,
}: {
  heading: string;
  text?: string;
  /** Short trust phrases shown as a divided row above the heading. */
  chips?: string[];
}) {
  const t = await getT();
  const locale = await getLocale();
  return (
    <section className="marble-dark section-y relative overflow-hidden text-center">
      <Reveal className="tpds-container relative max-w-[760px]" stagger={0.12} y={28}>
        {chips && chips.length > 0 && (
          <ul className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[12px] font-semibold uppercase tracking-[1.8px] text-[#e4cd9a]/85">
            {chips.map((c, i) => (
              <li key={c} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden className="text-[#c6a15b]/50">·</span>}
                {c}
              </li>
            ))}
          </ul>
        )}
        <h2 className="font-serif text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.12] text-[#fbf7f2] [text-wrap:balance]">{heading}</h2>
        {text && <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-[#fbf7f2]/75">{text}</p>}
        <Link
          href={`/${locale}/contact`}
          className="gold-shimmer-host mt-9 inline-flex items-center gap-3 rounded-full bg-[#c6a15b] px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
        >
          {t("cta.requestAppointment")} <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </section>
  );
}

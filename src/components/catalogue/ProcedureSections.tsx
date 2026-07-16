// Presentational sections for the /catalogue/[slug] procedure landing pages -
// modelled on best-in-class treatment pages but rebuilt in the Gilded Dental
// Med Austria palette (ivory #fbf7f2, espresso ink #2a2018, burnished gold
// #c6a15b, serif display). All are server components; each renders nothing when
// handed an empty list, so the page can drop them in unconditionally. Headings
// arrive already-translated from the page (via getT), keeping these purely visual.
import { Reveal } from "@/components/Reveal";
import type { CompareItem, NamedPoint, SpecItem, StatItem } from "@/lib/catalogue-content";

function CheckIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** "At a glance" scannable spec strip. */
export function SpecStrip({ specs, eyebrow }: { specs: SpecItem[]; eyebrow?: string }) {
  if (!specs.length) return null;
  return (
    <section className="section-y-sm border-y border-[#e8ddc9] bg-[#fffefb]">
      <div className="tpds-container">
        {eyebrow && <p className="eyebrow gold-foil mb-6">{eyebrow}</p>}
        <Reveal
          className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4"
          stagger={0.05}
          y={16}
        >
          {specs.map((s) => (
            <div key={s.label} className="border-l-2 border-[#c6a15b]/40 pl-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#a99a8b]">{s.label}</p>
              <p className="mt-1.5 font-serif text-[19px] leading-[1.2] text-[#2a2018]">{s.value}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Numbered, detailed step-by-step (richer than the 3-card "what to expect"). */
export function StepByStep({
  steps,
  eyebrow,
  heading,
}: {
  steps: NamedPoint[];
  eyebrow: string;
  heading: string;
}) {
  if (!steps.length) return null;
  return (
    <section className="section-y bg-[#fbf7f2]">
      <div className="tpds-container">
        <Reveal y={24}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2" stagger={0.06} y={22}>
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#c6a15b]/35 bg-[#f4ecdd] font-serif text-[17px] text-[#9a7638]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-[19px] font-normal leading-[1.25] text-[#2a2018]">{s.title}</h3>
                <p className="mt-1.5 text-[15px] font-light leading-[1.55] text-[#6e6152]">{s.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** "Who is this treatment for", candidate checklist. */
export function CandidatesList({
  items,
  eyebrow,
  heading,
}: {
  items: NamedPoint[];
  eyebrow: string;
  heading: string;
}) {
  if (!items.length) return null;
  return (
    <section className="section-y bg-[#f4ecdd]">
      <div className="tpds-container">
        <Reveal y={24}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.07} y={22}>
          {items.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-[#9a7638]/15 bg-[#fffefb] p-7 shadow-[var(--shadow-brand-sm)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-brand-md)]"
            >
              <CheckIcon className="h-5 w-5 text-[#9a7638]" />
              <h3 className="mt-4 font-serif text-[19px] font-normal leading-[1.25] text-[#2a2018]">{c.title}</h3>
              <p className="mt-2 text-[15px] font-light leading-[1.55] text-[#6e6152]">{c.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Recovery / healing timeline. */
export function RecoveryTimeline({
  items,
  eyebrow,
  heading,
}: {
  items: NamedPoint[];
  eyebrow: string;
  heading: string;
}) {
  if (!items.length) return null;
  return (
    <section className="section-y bg-[#fbf7f2]">
      <div className="tpds-container max-w-[860px]">
        <Reveal y={24}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-9" stagger={0.06} y={18}>
          <ol className="relative border-l border-[#e8ddc9] pl-8">
            {items.map((r) => (
              <li key={r.title} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[37px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#c6a15b] ring-4 ring-[#fbf7f2]" />
                <h3 className="font-serif text-[18px] font-normal text-[#2a2018]">{r.title}</h3>
                <p className="mt-1.5 text-[15px] font-light leading-[1.55] text-[#6e6152]">{r.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

/** Cited success / longevity figures on a dark band. */
export function StatBand({
  stats,
  eyebrow,
  heading,
}: {
  stats: StatItem[];
  eyebrow: string;
  heading: string;
}) {
  if (!stats.length) return null;
  return (
    <section className="marble-dark section-y text-[#fbf7f2]">
      <div className="tpds-container relative">
        <Reveal className="text-center" y={22}>
          <p className="eyebrow mb-3 text-[#e4cd9a]">{eyebrow}</p>
          <h2 className="font-serif text-[clamp(24px,2.8vw,34px)] font-normal [text-wrap:balance]">{heading}</h2>
          <span aria-hidden="true" className="gold-rule mx-auto mt-6 block w-24" />
        </Reveal>
        <Reveal
          className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-8 lg:grid-cols-4"
          stagger={0.08}
          y={20}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-[clamp(34px,4vw,50px)] leading-none text-[#e4cd9a]">{s.value}</p>
              <p className="mx-auto mt-3 max-w-[220px] text-[13px] font-light leading-[1.45] text-[#fbf7f2]/70">{s.label}</p>
              {s.source && <p className="mt-1 text-[11px] italic text-[#fbf7f2]/45">{s.source}</p>}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** "Good to know" decision blocks (X vs Y, upper vs lower…). */
export function Comparisons({
  items,
  eyebrow,
  heading,
}: {
  items: CompareItem[];
  eyebrow: string;
  heading: string;
}) {
  if (!items.length) return null;
  return (
    <section className="section-y bg-[#f4ecdd]">
      <div className="tpds-container max-w-[900px]">
        <Reveal y={24}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-8 space-y-5" stagger={0.08} y={20}>
          {items.map((c) => (
            <div
              key={c.heading}
              className="rounded-2xl border-l-2 border-[#c6a15b] bg-[#fffefb] p-7 shadow-[var(--shadow-brand-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-brand-md)]"
            >
              <h3 className="font-serif text-[20px] font-normal text-[#2a2018]">{c.heading}</h3>
              <p className="mt-2.5 text-[15px] font-light leading-[1.6] text-[#6e6152]">{c.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** "Caring for your result" maintenance checklist. */
export function MaintenanceList({
  items,
  eyebrow,
  heading,
}: {
  items: NamedPoint[];
  eyebrow: string;
  heading: string;
}) {
  if (!items.length) return null;
  return (
    <section className="section-y bg-[#fbf7f2]">
      <div className="tpds-container">
        <Reveal y={24}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2" stagger={0.06} y={18}>
          {items.map((m) => (
            <div key={m.title} className="flex gap-4 border-b border-[#e8ddc9] pb-6">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#9a7638]" />
              <div>
                <h3 className="font-serif text-[18px] font-normal text-[#2a2018]">{m.title}</h3>
                <p className="mt-1 text-[15px] font-light leading-[1.55] text-[#6e6152]">{m.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** Cost & transparency note, never a fixed price, always the free-plan route. */
export function CostNote({
  text,
  eyebrow,
  heading,
}: {
  text: string;
  eyebrow: string;
  heading: string;
}) {
  if (!text) return null;
  return (
    <section className="section-y bg-[#f4ecdd]">
      <div className="tpds-container max-w-[820px] text-center">
        <Reveal stagger={0.1} y={22}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
          <p className="mx-auto mt-6 max-w-[680px] text-[17px] font-light leading-[1.6] text-[#6e6152]">{text}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Shared "Why Dental Med Austria" trust band, same on every procedure page. */
export function WhyDMA({
  eyebrow,
  heading,
  reasons,
}: {
  eyebrow: string;
  heading: string;
  reasons: NamedPoint[];
}) {
  if (!reasons.length) return null;
  return (
    <section className="section-y bg-[#fbf7f2]">
      <div className="tpds-container">
        <Reveal className="text-center" y={22}>
          <p className="eyebrow gold-foil mb-3">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)] [text-wrap:balance]">{heading}</h2>
        </Reveal>
        <Reveal
          className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
          y={22}
        >
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-3xl border border-[#e8ddc9] bg-[#fffefb] p-7 shadow-[var(--shadow-brand-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9a7638]/30 hover:shadow-[var(--shadow-brand-md)]"
            >
              <h3 className="font-serif text-[19px] font-normal text-[#2a2018]">{r.title}</h3>
              <p className="mt-2 text-[15px] font-light leading-[1.55] text-[#6e6152]">{r.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

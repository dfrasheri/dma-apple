// Presentational sections for the /catalogue/[slug] procedure landing pages -
// modelled on best-in-class treatment pages but rebuilt in the Dental Med
// Austria palette (navy #071522, warm off-white #f7f7f5, serif display). All are
// server components; each renders nothing when handed an empty list, so the page
// can drop them in unconditionally. Headings arrive already-translated from the
// page (via getT), keeping these purely visual.
import { Reveal } from "@/components/Reveal";
import type { CompareItem, NamedPoint, SpecItem, StatItem } from "@/lib/catalogue-content";

const ACCENT = "#071522";

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
    <section className="border-y border-[#ececec] bg-white py-9">
      <div className="tpds-container">
        {eyebrow && <p className="eyebrow mb-6 text-[#9a9a9a]">{eyebrow}</p>}
        <Reveal
          className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-4"
          stagger={0.05}
          y={16}
        >
          {specs.map((s) => (
            <div key={s.label} className="border-l-2 pl-4" style={{ borderColor: `${ACCENT}26` }}>
              <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#9a9a9a]">{s.label}</p>
              <p className="mt-1.5 font-serif text-[19px] leading-[1.2] text-[#071522]">{s.value}</p>
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
    <section className="bg-white py-[70px]">
      <div className="tpds-container">
        <Reveal y={24}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2" stagger={0.06} y={22}>
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-5">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-[17px]"
                style={{ backgroundColor: `${ACCENT}0d`, color: ACCENT }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-[19px] font-normal leading-[1.25] text-[#071522]">{s.title}</h3>
                <p className="mt-1.5 text-[15px] font-light leading-[1.55] text-[#555]">{s.text}</p>
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
    <section className="bg-[#f7f7f5] py-[70px]">
      <div className="tpds-container">
        <Reveal y={24}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.07} y={22}>
          {items.map((c) => (
            <div key={c.title} className="bg-white p-7">
              <CheckIcon className="h-5 w-5" style={{ color: ACCENT }} />
              <h3 className="mt-4 font-serif text-[19px] font-normal leading-[1.25] text-[#071522]">{c.title}</h3>
              <p className="mt-2 text-[15px] font-light leading-[1.55] text-[#555]">{c.text}</p>
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
    <section className="bg-white py-[70px]">
      <div className="tpds-container max-w-[860px]">
        <Reveal y={24}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-9" stagger={0.06} y={18}>
          <ol className="relative border-l border-[#e3e3e0] pl-8">
            {items.map((r) => (
              <li key={r.title} className="relative pb-8 last:pb-0">
                <span
                  className="absolute -left-[37px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white"
                  style={{ backgroundColor: ACCENT }}
                />
                <h3 className="font-serif text-[18px] font-normal text-[#071522]">{r.title}</h3>
                <p className="mt-1.5 text-[15px] font-light leading-[1.55] text-[#555]">{r.text}</p>
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
    <section className="bg-[#071522] py-[70px] text-white">
      <div className="tpds-container">
        <Reveal className="text-center" y={22}>
          <p className="eyebrow mb-3 text-white/50">{eyebrow}</p>
          <h2 className="font-serif text-[clamp(24px,2.8vw,34px)] font-normal">{heading}</h2>
        </Reveal>
        <Reveal
          className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-8 lg:grid-cols-4"
          stagger={0.08}
          y={20}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-[clamp(32px,4vw,46px)] leading-none text-white">{s.value}</p>
              <p className="mx-auto mt-3 max-w-[220px] text-[13px] font-light leading-[1.45] text-white/70">{s.label}</p>
              {s.source && <p className="mt-1 text-[11px] italic text-white/40">{s.source}</p>}
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
    <section className="bg-[#f7f7f5] py-[70px]">
      <div className="tpds-container max-w-[900px]">
        <Reveal y={24}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-8 space-y-5" stagger={0.08} y={20}>
          {items.map((c) => (
            <div key={c.heading} className="border-l-2 bg-white p-7" style={{ borderColor: ACCENT }}>
              <h3 className="font-serif text-[20px] font-normal text-[#071522]">{c.heading}</h3>
              <p className="mt-2.5 text-[15px] font-light leading-[1.6] text-[#555]">{c.body}</p>
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
    <section className="bg-white py-[70px]">
      <div className="tpds-container">
        <Reveal y={24}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
        </Reveal>
        <Reveal className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2" stagger={0.06} y={18}>
          {items.map((m) => (
            <div key={m.title} className="flex gap-4 border-b border-[#f0f0ee] pb-6">
              <CheckIcon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} />
              <div>
                <h3 className="font-serif text-[18px] font-normal text-[#071522]">{m.title}</h3>
                <p className="mt-1 text-[15px] font-light leading-[1.55] text-[#555]">{m.text}</p>
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
    <section className="bg-[#f7f7f5] py-[70px]">
      <div className="tpds-container max-w-[820px] text-center">
        <Reveal stagger={0.1} y={22}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
          <p className="mx-auto mt-6 max-w-[680px] text-[17px] font-light leading-[1.6] text-[#444]">{text}</p>
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
    <section className="bg-white py-[70px]">
      <div className="tpds-container">
        <Reveal className="text-center" y={22}>
          <p className="eyebrow mb-3 text-[#9a9a9a]">{eyebrow}</p>
          <h2 className="serif-title text-[clamp(24px,2.8vw,34px)]">{heading}</h2>
        </Reveal>
        <Reveal
          className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
          y={22}
        >
          {reasons.map((r) => (
            <div key={r.title} className="rounded-sm border border-[#ececec] bg-[#fafafa] p-7">
              <h3 className="font-serif text-[19px] font-normal text-[#071522]">{r.title}</h3>
              <p className="mt-2 text-[15px] font-light leading-[1.55] text-[#555]">{r.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

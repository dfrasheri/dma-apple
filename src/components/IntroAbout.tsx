"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/Reveal";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useT, useLocale } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Deeper tint of the brand champagne (#d3b57f) that stays legible on white. */
const GOLD = "#b0894e";
/** Brand champagne — used only for faint ambient light, never for text. */
const CHAMPAGNE = "#d3b57f";
const NAVY = "#071522";

function Arrow() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Button({
  children,
  href,
  variant = "secondary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
}) {
  const base =
    "group inline-flex items-center justify-center gap-2.5 px-8 py-[15px] text-[13.5px] uppercase tracking-[1.8px] transition-all duration-300 hover:-translate-y-0.5";
  const styles =
    variant === "primary"
      ? "bg-[#071522] text-white hover:bg-[#0d2439] hover:shadow-[0_14px_30px_rgba(7,21,34,0.25)]"
      : "border border-[#071522]/25 text-[#343434] hover:border-[#071522] hover:bg-[#071522] hover:text-white";
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
      {variant === "primary" && <Arrow />}
    </a>
  );
}

type Stat = {
  labelKey: string;
  /** Numeric target for the count-up (omit for a static display value). */
  to?: number;
  /** Group thousands with commas. */
  comma?: boolean;
  suffix?: string;
  /** Static, non-counting value (e.g. "Since 2009"). */
  display?: string;
};

const STATS: Stat[] = [
  { to: 24000, comma: true, suffix: "+", labelKey: "intro.stat.patients" },
  { to: 42000, comma: true, suffix: "+", labelKey: "intro.stat.implants" },
  { to: 98, suffix: "%", labelKey: "intro.stat.success" },
  { display: "Since 2009", labelKey: "intro.stat.trusted" },
];

/** Final printed value — also the SSR / reduced-motion / no-JS fallback. */
function statValue(s: Stat) {
  if (s.display) return s.display;
  const n = s.to ?? 0;
  return `${s.comma ? n.toLocaleString("en-US") : String(n)}${s.suffix ?? ""}`;
}

/** Count-up config carried on the DOM so the timeline can read it back. */
function countData(s: Stat) {
  if (s.to == null) return {};
  return {
    "data-count-to": String(s.to),
    "data-comma": s.comma ? "1" : "0",
    "data-suffix": s.suffix ?? "",
  };
}

/** Format an in-flight count value from the node's own data attributes. */
function formatCount(value: number, node: HTMLElement) {
  const rounded = Math.round(value);
  const num = node.dataset.comma === "1" ? rounded.toLocaleString("en-US") : String(rounded);
  return `${num}${node.dataset.suffix ?? ""}`;
}

/**
 * Stats band — a champagne "seal" ring sits behind four hairline-divided cells.
 * Serif numbers roll up from zero, a gold rule draws from the centre, then the
 * label fades in, staggered cell by cell.
 */
function StatsBand() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>(".stat-cell");

      // Zero the counters before they roll up.
      el.querySelectorAll<HTMLElement>("[data-count-to]").forEach((n) => {
        n.textContent = formatCount(0, n);
      });

      gsap.set(".stat-number", { opacity: 0, y: 18 });
      gsap.set(".stat-line", { scaleX: 0, transformOrigin: "center" });
      gsap.set(".stat-label", { opacity: 0, y: 8 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });

      cells.forEach((cell, i) => {
        const at = i * 0.12;
        const number = cell.querySelector<HTMLElement>(".stat-number");
        const line = cell.querySelector<HTMLElement>(".stat-line");
        const label = cell.querySelector<HTMLElement>(".stat-label");
        const counter = cell.querySelector<HTMLElement>("[data-count-to]");

        if (number) tl.to(number, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, at);
        if (counter) {
          const obj = { v: 0 };
          tl.to(
            obj,
            {
              v: Number(counter.dataset.countTo),
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = formatCount(obj.v, counter);
              },
            },
            at,
          );
        }
        if (line) tl.to(line, { scaleX: 1, duration: 0.5, ease: "power2.out" }, at + 0.45);
        if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, at + 0.5);
      });

      // A slow, living rotation on the seal ring.
      gsap.to(".about-ring", { rotation: 360, duration: 140, ease: "none", repeat: -1 });
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={ref} className="relative mx-auto mt-16 max-w-[900px]">
      {/* champagne "seal" medallion behind the numbers */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <svg
          className="about-ring h-[340px] w-[340px] opacity-[0.13] sm:h-[460px] sm:w-[460px]"
          viewBox="0 0 460 460"
          fill="none"
        >
          <circle cx="230" cy="230" r="229" stroke={CHAMPAGNE} strokeWidth="1" />
          <circle
            cx="230"
            cy="230"
            r="186"
            stroke={CHAMPAGNE}
            strokeWidth="1"
            strokeDasharray="1.5 10"
          />
        </svg>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:gap-y-0">
        {STATS.map((s) => (
          <div
            key={s.labelKey}
            className="stat-cell group px-4 text-center transition-transform duration-500 hover:-translate-y-1 sm:border-r sm:border-[#071522]/10 sm:last:border-r-0"
          >
            <p
              className="stat-number font-serif text-[clamp(30px,3.6vw,42px)] leading-none tracking-[-0.5px] text-[#071522] tabular-nums transition-colors duration-300 group-hover:text-[#b0894e]"
              {...countData(s)}
            >
              {statValue(s)}
            </p>
            <span
              className="stat-line mx-auto mt-3.5 block h-px w-9 transition-all duration-500 group-hover:w-14"
              style={{ backgroundColor: GOLD }}
            />
            <p className="stat-label mt-3.5 text-[12px] uppercase tracking-[1.7px] text-[#9a9a9a] transition-colors duration-300 group-hover:text-[#6b6b6b]">
              {t(s.labelKey)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IntroAbout() {
  const t = useT();
  const { locale } = useLocale();
  return (
    <section className="relative overflow-hidden border-t border-[#071522]/5 bg-gradient-to-b from-white via-[#fbf7f0] to-white py-20 md:py-[110px]">
      {/* soft champagne light from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{
          background: `radial-gradient(58% 100% at 50% 0%, rgba(211,181,127,0.16), transparent 72%)`,
        }}
      />

      <div className="tpds-container relative z-10 max-w-[1000px] text-center">
        <Reveal stagger={0.12} y={30} duration={0.9}>
          {/* letterhead kicker */}
          <div className="mb-7 flex items-center justify-center gap-4">
            <span
              className="h-px w-8 sm:w-11"
              style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }}
            />
            <span className="text-[12px] font-normal uppercase tracking-[3px] text-[#b0894e]">
              Dental Med Austria
            </span>
            <span
              className="h-px w-8 sm:w-11"
              style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }}
            />
          </div>

          <h2
            className="serif-title mx-auto max-w-[840px]"
            style={{ fontSize: "clamp(32px, 3.8vw, 46px)", lineHeight: 1.12, color: NAVY }}
          >
            {t("intro.h2")}
          </h2>

          <span className="mx-auto my-9 block h-px w-14" style={{ backgroundColor: GOLD }} />

          <div className="mx-auto max-w-[760px] space-y-5">
            <p className="text-[18.5px] font-light leading-[1.5] tracking-[-0.17px] text-[#2b2b2b]">
              {t("intro.p1")}
            </p>
            <p className="text-[16.5px] font-light leading-[1.62] tracking-[-0.1px] text-[#4c4c4c]">
              {t("intro.p2")}
            </p>
            <p className="text-[16.5px] font-light leading-[1.62] tracking-[-0.1px] text-[#4c4c4c]">
              {t("intro.p3")}
            </p>
          </div>
        </Reveal>

        <StatsBand />

        <Reveal
          as="div"
          className="mt-16 flex flex-wrap items-center justify-center gap-5"
          stagger={0.12}
          y={20}
        >
          <Button href={`/${locale}/care`} variant="primary">
            {t("btn.services")}
          </Button>
          <Button href={`/${locale}/contact`}>{t("nav.contact")}</Button>
        </Reveal>
      </div>
    </section>
  );
}

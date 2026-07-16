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

/** Antique gold — legible on ivory, used for rules and accents. */
const GOLD = "#9a7638";
/** Brand champagne — used only for faint ambient light, never for text. */
const CHAMPAGNE = "#e4cd9a";
const NAVY = "#2a2018";

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
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-9 py-4 text-[13px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0";
  const styles =
    variant === "primary"
      ? "gold-shimmer-host bg-[#c6a15b] text-[#241c15] shadow-[0_12px_34px_-8px_rgba(198,161,91,0.5)]"
      : "border border-[#9a7638]/35 text-[#2a2018] hover:border-[#9a7638] hover:bg-[#f4ecdd]";
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

      <div className="relative z-10 grid grid-cols-2 gap-y-14 gap-x-4 sm:gap-y-16">
        {STATS.map((s) => (
          <div
            key={s.labelKey}
            className="stat-cell group px-2 text-center transition-transform duration-500 hover:-translate-y-1 sm:px-4"
          >
            <p
              className={`stat-number stat-giant gold-foil ${s.display ? "stat-giant--text" : ""}`}
              {...countData(s)}
            >
              {statValue(s)}
            </p>
            <span
              className="stat-line mx-auto mt-4 block h-px w-9 transition-all duration-500 group-hover:w-16"
              style={{ backgroundColor: GOLD }}
            />
            <p className="stat-label mt-4 text-[12px] font-semibold uppercase tracking-[2.2px] text-[#a99a8b] transition-colors duration-300 group-hover:text-[#6e6152]">
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
    <section className="section-y relative overflow-hidden bg-gradient-to-b from-[#fbf7f2] via-[#f4ecdd] to-[#fbf7f2]">
      {/* soft champagne light from the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{
          background: `radial-gradient(58% 100% at 50% 0%, rgba(228,205,154,0.28), transparent 72%)`,
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
            <span className="gold-foil text-[12px] font-semibold uppercase tracking-[3px]">
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
            <p className="font-serif text-[clamp(19px,2vw,23px)] italic leading-[1.55] text-[#2a2018]">
              {t("intro.p1")}
            </p>
            <p className="text-[16.5px] leading-[1.7] text-[#6e6152]">
              {t("intro.p2")}
            </p>
            <p className="text-[16.5px] leading-[1.7] text-[#6e6152]">
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

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";

type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  image,
  imagePosition,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  image: string;
  /** CSS background-position for the hero image (e.g. "center 22%"). Defaults to centre. */
  imagePosition?: string;
  crumbs?: Crumb[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { locale } = useLocale();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.2,
      });
      gsap.fromTo(
        "[data-hero-bg]",
        { scale: 1.12 },
        { scale: 1, duration: 6, ease: "power1.out" },
      );
    }, el);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} className="relative flex h-[58vh] min-h-[440px] items-end overflow-hidden">
      <div
        data-hero-bg
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})`, backgroundPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#171310]/75 via-[#171310]/35 to-[#171310]/30" />
      {/* faint gold radial glow over the warm scrim */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(154,118,56,0.22))",
        }}
      />

      <div className="relative z-10 w-full pb-14">
        <div className="tpds-container">
          {eyebrow && (
            <p data-hero-line className="eyebrow mb-4 text-[#e4cd9a]">
              {eyebrow}
            </p>
          )}
          <h1
            data-hero-line
            className="font-serif font-normal text-[#fbf7f2] [text-wrap:balance]"
            style={{ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: 1.05 }}
          >
            {title}
          </h1>
          {crumbs && crumbs.length > 0 && (
            <nav data-hero-line className="mt-5 flex flex-wrap items-center gap-2 text-[13px] uppercase tracking-[1.2px] text-[#e4cd9a]/80">
              {crumbs.map((c, i) => (
                <span key={c.label} className="inline-flex items-center gap-2">
                  {c.href ? (
                    <a href={c.href === "/" ? `/${locale}` : `/${locale}${c.href}`} className="transition-colors duration-300 hover:text-[#fbf7f2]">
                      {c.label}
                    </a>
                  ) : (
                    <span className="text-[#fbf7f2]">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span className="opacity-50">/</span>}
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { StagePoster } from "./StagePoster";
import { useCapabilities } from "./useExplode";
import type { ObjectKind } from "./ObjectScene";
import type { CrownVariant } from "./crownVariants";

const ObjectScene = dynamic(() => import("./ObjectScene"), {
  ssr: false,
  loading: () => <StagePoster />,
});

const DEFAULT_DESC: Record<ObjectKind, string> = {
  crown: "Each crown is milled and hand-finished from premium zirconia and Ivoclar E-max ceramic for a natural, light-reflective result. Drag to explore it from every angle.",
  tooth: "We work to preserve and protect your natural tooth wherever possible, with gentle, precise, tooth-first care. Drag to explore.",
  aligner: "A series of clear, removable aligners gently guides your teeth into place, virtually invisible throughout. Drag to explore.",
};

export function ObjectStage({
  kind,
  eyebrow = "In Three Dimensions",
  heading = "Crafted for a natural result",
  description,
  caption = "Drag to rotate",
  a11yLabel,
  variant,
}: {
  kind: ObjectKind;
  eyebrow?: string;
  heading?: string;
  description?: string;
  caption?: string;
  a11yLabel?: string;
  variant?: CrownVariant;
}) {
  const { reducedMotion, tier } = useCapabilities();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries[0]?.isIntersecting ?? false;
        setInView(v);
        if (v) setMounted(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frameloop: "always" | "never" = inView ? "always" : "never";

  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="tpds-container">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-[#071522] ring-1 ring-black/5 lg:grid-cols-[0.82fr_1.18fr]">
          {/* text */}
          <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
            <p className="eyebrow text-white/55">{eyebrow}</p>
            <h2 className="serif-title text-[clamp(23px,2.4vw,32px)] leading-[1.12] text-white">{heading}</h2>
            <p className="max-w-[380px] text-[15px] font-light leading-[1.6] text-white/65">{description ?? DEFAULT_DESC[kind]}</p>
            <span className="mt-1 text-[11px] uppercase tracking-[1.6px] text-white/40">{caption}</span>
          </div>

          {/* canvas */}
          <div
            ref={containerRef}
            role="img"
            aria-label={a11yLabel ?? `Interactive 3D model of a ${kind === "crown" ? "ceramic dental crown" : kind === "aligner" ? "clear dental aligner" : "natural tooth"}.`}
            className="relative min-h-[360px] lg:min-h-[500px]"
            style={{ background: "radial-gradient(110% 90% at 60% 40%, #0e2236 0%, #071522 75%)" }}
          >
            {mounted ? (
              <ObjectScene kind={kind} lod={tier} reducedMotion={reducedMotion} frameloop={frameloop} variant={variant} />
            ) : (
              <StagePoster reducedMotion={reducedMotion} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

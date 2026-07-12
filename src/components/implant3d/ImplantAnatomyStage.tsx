"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { StagePoster } from "./StagePoster";
import { useCapabilities } from "./useExplode";

const ImplantScene = dynamic(() => import("./ImplantScene"), {
  ssr: false,
  loading: () => <StagePoster />,
});

type Props = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  explodeLabel?: string;
  assembleLabel?: string;
  caption?: string;
  a11yLabel?: string;
  labels?: { fixture?: string; abutment?: string; crown?: string };
};

export function ImplantAnatomyStage(props: Props = {}) {
  const { reducedMotion, tier } = useCapabilities();
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const [exploded, setExploded] = useState(false);
  const target = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Syncs to a client-only capability probe (see useCapabilities), not a
    // value known at initial render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reducedMotion) setExploded(true);
  }, [reducedMotion]);

  useEffect(() => {
    target.current = exploded ? 1 : 0;
  }, [exploded]);

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

  const labels = useMemo(
    () => ({
      fixture: props.labels?.fixture ?? "Fixture",
      fixtureSub: "Titanium root",
      abutment: props.labels?.abutment ?? "Abutment",
      abutmentSub: "Connector",
      crown: props.labels?.crown ?? "Crown",
      crownSub: "Ceramic tooth",
    }),
    [props.labels],
  );

  const frameloop: "always" | "never" = inView ? "always" : "never";

  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="tpds-container">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-[#071522] ring-1 ring-black/5 lg:grid-cols-[0.82fr_1.18fr]">
          {/* text + controls */}
          <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
            <p className="eyebrow text-white/55">{props.eyebrow ?? "The Anatomy of an Implant"}</p>
            <h2 className="serif-title text-[clamp(23px,2.4vw,32px)] leading-[1.12] text-white">
              {props.heading ?? "Precision-engineered, layer by layer"}
            </h2>
            <p className="max-w-[380px] text-[15px] font-light leading-[1.6] text-white/65">
              {props.description ??
                "An implant works in three parts: a titanium fixture rooted in the bone, an abutment connector, and a lifelike ceramic crown. Explode the model to see how they fit."}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setExploded((v) => !v)}
                aria-pressed={exploded}
                className="group inline-flex items-center gap-3 rounded-full bg-white/92 px-6 py-2.5 text-[12px] font-medium uppercase tracking-[1.5px] text-[#071522] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden>
                  <path d={exploded ? "M8 9l4-4 4 4M8 15l4 4 4-4" : "M8 5l4 4 4-4M8 19l4-4 4 4"} />
                </svg>
                {exploded ? props.assembleLabel ?? "Reassemble" : props.explodeLabel ?? "Explode view"}
              </button>
              <span className="text-[11px] uppercase tracking-[1.6px] text-white/40">{props.caption ?? "Drag to rotate"}</span>
            </div>
          </div>

          {/* canvas */}
          <div
            ref={containerRef}
            role="img"
            aria-label={
              props.a11yLabel ??
              "Interactive 3D diagram of a dental implant: a titanium fixture, an abutment, and a ceramic crown shown exploded."
            }
            className="relative min-h-[360px] lg:min-h-[520px]"
            style={{ background: "radial-gradient(110% 90% at 60% 40%, #0e2236 0%, #071522 75%)" }}
          >
            {mounted ? (
              <ImplantScene lod={tier} explodeTarget={target} reducedMotion={reducedMotion} labels={labels} frameloop={frameloop} />
            ) : (
              <StagePoster reducedMotion={reducedMotion} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Html } from "@react-three/drei";

/**
 * Annotation callout: anchored at the part's surface, with a leader line + arrow
 * pointing back to it and a compact card offset to the side (so it never covers
 * the model). The whole callout tracks the part as it rotates / explodes.
 */
export function PartLabel({
  position,
  index,
  name,
  sub,
}: {
  position: [number, number, number];
  index: number;
  name: string;
  sub: string;
}) {
  return (
    <Html position={position} center={false} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
      <div className="flex -translate-y-1/2 items-center whitespace-nowrap">
        {/* arrowhead pointing back at the part */}
        <svg width="9" height="10" viewBox="0 0 9 10" className="shrink-0 text-white/60" aria-hidden>
          <path d="M7.5 1 L2 5 L7.5 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* leader line */}
        <span className="h-px w-[54px] bg-gradient-to-r from-white/50 to-white/20" />
        {/* compact card */}
        <div className="ml-2 flex items-center gap-2 rounded-[5px] border border-white/12 bg-[#071522]/80 px-2.5 py-1.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.7)] backdrop-blur">
          <span className="font-serif text-[12px] leading-none text-white/45">{String(index).padStart(2, "0")}</span>
          <span className="h-5 w-px bg-white/15" />
          <span className="leading-tight">
            <span className="block font-serif text-[12.5px] text-white">{name}</span>
            <span className="block text-[8px] uppercase tracking-[1.3px] text-white/50">{sub}</span>
          </span>
        </div>
      </div>
    </Html>
  );
}

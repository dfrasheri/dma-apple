import { cn } from "@/lib/utils";
import { CADENCE_META, PROVENANCE_META } from "@/lib/crm/legend";
import type { Cadence, Provenance } from "@/lib/crm/types";

/**
 * Inline data-provenance chip: ◆ sourced / ✚ derived / ✎ transformed, an
 * optional cadence, an optional HIL-gate marker, and an optional "out of scope"
 * strike for deliberately-unbuilt branches. Backed by `legend.ts`.
 */
export function LegendChip({
  provenance,
  cadence,
  hil,
  crossed,
  className
}: {
  provenance?: Provenance;
  cadence?: Cadence;
  hil?: boolean;
  crossed?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      {provenance && (
        <span
          title={PROVENANCE_META[provenance].description}
          className={cn(
            "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
            PROVENANCE_META[provenance].className
          )}
        >
          {PROVENANCE_META[provenance].glyph} {PROVENANCE_META[provenance].label}
        </span>
      )}
      {cadence && (
        <span className={cn("text-[10px] font-medium", CADENCE_META[cadence].className)}>
          ⟳ {CADENCE_META[cadence].label}
        </span>
      )}
      {hil && (
        <span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-400/40">
          ⛒ HIL gate
        </span>
      )}
      {crossed && (
        <span className="text-[10px] font-medium text-rose-700 line-through decoration-rose-400/60">
          out of scope
        </span>
      )}
    </span>
  );
}

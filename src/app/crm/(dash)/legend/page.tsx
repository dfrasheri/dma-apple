import { ArrowDown } from "lucide-react";
import { LANES, PROVENANCE_META, CADENCE_META } from "@/lib/crm/legend";
import { PROVENANCE } from "@/lib/crm/types";
import { Card, CardHeader, SectionHeading } from "@/components/crm/ui";
import { LegendChip } from "@/components/crm/LegendChip";
import { cn } from "@/lib/utils";

export default async function Page() {
  return (
    <div>
      <SectionHeading
        title="Data legend"
        subtitle="The living architecture chart, every data object tagged by provenance, cadence and review gate. This is the working version of the draw.io reference."
      />

      {/* Key */}
      <Card className="mb-6">
        <CardHeader title="Key" subtitle="How to read the glyphs on every node and chip" />
        <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-3">
          {PROVENANCE.map((p) => {
            const meta = PROVENANCE_META[p];
            return (
              <div key={p} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset",
                    meta.className
                  )}
                >
                  {meta.glyph} {meta.label}
                </span>
                <p className="text-xs text-zinc-600">{meta.description}</p>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-200 px-5 py-4 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-zinc-700">⟳ cadence</span>
            <span>- how often the object refreshes ({CADENCE_META.realtime.label} → {CADENCE_META.annual.label}).</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-400/40">
              ⛒ HIL gate
            </span>
            <span>- a human must confirm before this data is trusted or served.</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-rose-700 line-through decoration-rose-400/60">out of scope</span>
            <span>- deliberately unbuilt (illegal / against platform ToS).</span>
          </span>
        </div>
      </Card>

      {/* Lanes top-to-bottom: Channels → Serving */}
      <div className="flex flex-col gap-4">
        {LANES.map((lane, i) => (
          <div key={lane.id} className="flex flex-col gap-4">
            <Card>
              <CardHeader title={lane.title} subtitle={lane.subtitle} />
              <ul className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-2 xl:grid-cols-3">
                {lane.nodes.map((node) => (
                  <li
                    key={node.label}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border border-zinc-200 bg-black/20 p-3",
                      node.crossed && "opacity-70"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium text-zinc-900",
                        node.crossed && "text-rose-700 line-through decoration-rose-400/50"
                      )}
                    >
                      {node.label}
                    </span>
                    <LegendChip
                      provenance={node.provenance}
                      cadence={node.cadence}
                      hil={node.hil}
                      crossed={node.crossed}
                    />
                    {node.note && <p className="text-xs leading-snug text-zinc-500">{node.note}</p>}
                  </li>
                ))}
              </ul>
            </Card>
            {i < LANES.length - 1 && (
              <div className="flex justify-center" aria-hidden>
                <ArrowDown className="h-5 w-5 text-zinc-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

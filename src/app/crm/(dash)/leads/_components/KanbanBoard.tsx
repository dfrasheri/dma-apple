"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge, eur } from "@/components/crm/ui";
import { STAGE_META, SOURCE_META } from "@/lib/crm/display";
import { LEAD_STAGES, type LeadStage } from "@/lib/crm/types";
import type { LeadWithContact } from "@/lib/crm/services/leads";
import { cn } from "@/lib/utils";

export function KanbanBoard({ leads }: { leads: LeadWithContact[] }) {
  const router = useRouter();
  const [items, setItems] = useState<LeadWithContact[]>(leads);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);
  const [busy, setBusy] = useState(false);

  async function moveTo(id: string, stage: LeadStage) {
    const lead = items.find((l) => l.id === id);
    if (!lead || lead.stage === stage) return;
    // Optimistic update.
    const prev = items;
    setItems((cur) => cur.map((l) => (l.id === id ? { ...l, stage } : l)));
    setBusy(true);
    try {
      const res = await fetch(`/api/crm/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage })
      });
      if (!res.ok) throw new Error("patch failed");
      router.refresh();
    } catch {
      setItems(prev); // rollback
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {LEAD_STAGES.map((stage) => {
        const meta = STAGE_META[stage];
        const colLeads = items.filter((l) => l.stage === stage);
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStage(stage);
            }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              setOverStage(null);
              if (dragId) void moveTo(dragId, stage);
              setDragId(null);
            }}
            className={cn(
              "flex w-64 shrink-0 flex-col rounded-xl border bg-zinc-50 transition-colors",
              overStage === stage
                ? "border-[var(--elx-gold)]/50 bg-white/[0.04]"
                : "border-zinc-200"
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3 py-2.5">
              <Badge className={meta.className}>{meta.label}</Badge>
              <span className="text-xs tabular-nums text-zinc-500">{colLeads.length}</span>
            </div>
            <div className="flex min-h-24 flex-col gap-2 p-2">
              {colLeads.length === 0 && (
                <p className="px-2 py-6 text-center text-xs text-zinc-500">No leads</p>
              )}
              {colLeads.map((lead) => (
                <article
                  key={lead.id}
                  draggable={!busy}
                  onDragStart={() => setDragId(lead.id)}
                  onDragEnd={() => {
                    setDragId(null);
                    setOverStage(null);
                  }}
                  className={cn(
                    "cursor-grab rounded-lg border border-zinc-200 bg-white p-3 active:cursor-grabbing",
                    dragId === lead.id && "opacity-50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/crm/leads/${lead.id}`}
                      className="text-sm font-medium text-zinc-900 hover:text-[var(--elx-gold)]"
                    >
                      {lead.contact?.name ?? "Unknown"}
                    </Link>
                    <span className="shrink-0 text-xs tabular-nums text-zinc-600">
                      {lead.score}
                    </span>
                  </div>
                  {lead.service && (
                    <p className="mt-1 truncate text-xs text-zinc-600">{lead.service}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <Badge className={SOURCE_META[lead.source].className}>
                      {SOURCE_META[lead.source].label}
                    </Badge>
                    <span className="text-xs tabular-nums text-zinc-700">
                      {eur(lead.valueEstimate)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LEAD_STAGES, type LeadStage } from "@/lib/crm/types";
import { STAGE_META } from "@/lib/crm/display";

export function LeadActions({
  leadId,
  currentStage
}: {
  leadId: string;
  currentStage: LeadStage;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<LeadStage>(currentStage);
  const [note, setNote] = useState("");
  const [savingStage, setSavingStage] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStage(next: LeadStage) {
    if (next === stage) return;
    const prev = stage;
    setStage(next);
    setSavingStage(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: next })
      });
      if (!res.ok) throw new Error("Failed to update stage");
      router.refresh();
    } catch (e) {
      setStage(prev);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSavingStage(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    const body = note.trim();
    if (!body) return;
    setSavingNote(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "note", body, author: "staff" })
      });
      if (!res.ok) throw new Error("Failed to add note");
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-zinc-500">
          Stage
        </label>
        <select
          value={stage}
          disabled={savingStage}
          onChange={(e) => void changeStage(e.target.value as LeadStage)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[var(--elx-gold)]/50 focus:outline-none disabled:opacity-50"
        >
          {LEAD_STAGES.map((s) => (
            <option key={s} value={s} className="bg-zinc-900">
              {STAGE_META[s].label}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={addNote}>
        <label className="mb-1.5 block text-xs uppercase tracking-wider text-zinc-500">
          Add note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Log a call, follow-up or context…"
          className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[var(--elx-gold)]/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={savingNote || !note.trim()}
          className="mt-2 w-full rounded-lg bg-[var(--elx-gold)] px-3 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
        >
          {savingNote ? "Saving…" : "Add note"}
        </button>
      </form>

      {error && <p className="text-xs text-rose-700">{error}</p>}
    </div>
  );
}

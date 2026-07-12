"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type ReconcileSummary = {
  inserted: number;
  updated: number;
  retired: number;
  unchanged: number;
};

export function ReconcileButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<ReconcileSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reconcile() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/facts/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; data?: ReconcileSummary; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Reconcile failed");
      }
      setSummary(data.data ?? null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reconcile failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={reconcile}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--elx-gold)] px-3 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
      >
        <RefreshCw className={cn("h-4 w-4", busy && "animate-spin")} />
        {busy ? "Syncing…" : "Sync & reconcile"}
      </button>
      {summary && (
        <span className="text-xs text-zinc-600">
          <span className="text-emerald-700 tabular-nums">{summary.inserted}</span> inserted ·{" "}
          <span className="text-sky-700 tabular-nums">{summary.updated}</span> updated ·{" "}
          <span className="text-rose-700 tabular-nums">{summary.retired}</span> retired ·{" "}
          <span className="text-zinc-700 tabular-nums">{summary.unchanged}</span> unchanged
        </span>
      )}
      {error && <span className="text-xs text-rose-700">{error}</span>}
    </div>
  );
}

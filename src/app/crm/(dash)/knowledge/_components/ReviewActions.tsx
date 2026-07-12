"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

type Decision = "approve" | "reject";

export function ReviewActions({ factId }: { factId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<Decision | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(decision: Decision) {
    setPending(decision);
    setError(null);
    try {
      const res = await fetch(`/api/crm/facts/${factId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Review failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Review failed");
      setPending(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => review("approve")}
          disabled={pending !== null}
          className="inline-flex items-center gap-1 rounded-lg bg-[var(--elx-gold)] px-3 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          {pending === "approve" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => review("reject")}
          disabled={pending !== null}
          className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          {pending === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
      {error && <p className="text-xs text-rose-700">{error}</p>}
    </div>
  );
}

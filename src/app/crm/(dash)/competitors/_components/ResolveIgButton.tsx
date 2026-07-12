"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

/**
 * "Ctrl+F for Instagram", POSTs to resolve-ig, which fetches the competitor's
 * website and parses out their public IG *profile* URL (no private data harvest).
 */
export function ResolveIgButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function resolve() {
    setBusy(true);
    try {
      const res = await fetch(`/api/crm/competitors/${id}/resolve-ig`, { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={resolve}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-xs text-zinc-800 hover:bg-zinc-100 disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
      Resolve IG
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function AddAffiliate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState("partner");
  const [commission, setCommission] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const field =
    "rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-[var(--elx-gold)]/40";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (name.trim().length < 2) {
      setError("Name is required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/crm/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          kind,
          commissionPct: commission ? Number(commission) : undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setName("");
      setEmail("");
      setCommission("");
      setOpen(false);
      router.refresh();
    } catch {
      setError("Could not create the affiliate.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--elx-gold)]/10 px-3 py-2 text-sm text-[var(--elx-gold-soft)] ring-1 ring-inset ring-[var(--elx-gold)]/30 hover:bg-[var(--elx-gold)]/20"
      >
        <Plus className="h-4 w-4" /> New affiliate
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={field} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className={field} />
      <select value={kind} onChange={(e) => setKind(e.target.value)} className={field}>
        <option value="partner">Partner</option>
        <option value="patient">Patient</option>
      </select>
      <input
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
        placeholder="Commission %"
        inputMode="numeric"
        className={`${field} w-32`}
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-[var(--elx-gold)]/10 px-3 py-2 text-sm text-[var(--elx-gold-soft)] ring-1 ring-inset ring-[var(--elx-gold)]/30 hover:bg-[var(--elx-gold)]/20 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Create"}
      </button>
      <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900">
        Cancel
      </button>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </form>
  );
}

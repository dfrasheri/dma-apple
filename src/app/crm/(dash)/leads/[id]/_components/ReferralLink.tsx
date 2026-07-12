"use client";

/**
 * Generates the patient's personal referral link to drop into their preventiv
 * (treatment-plan estimate). The patient becomes a `patient` affiliate, so any
 * friends they refer are tracked on the Affiliates page.
 */
import { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";

export function ReferralLink({ leadId }: { leadId: string }) {
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/crm/leads/${leadId}/referral`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json?.data) throw new Error("failed");
      setLink(json.data.link);
      setCode(json.data.code);
    } catch {
      setError("Could not generate the link.");
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <p className="mb-3 text-xs text-zinc-600">
        Add this to the patient&apos;s treatment plan so they can refer friends and family, every
        referral is tracked on the Affiliates page.
      </p>

      {!link ? (
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--elx-gold)]/10 px-3 py-2 text-sm text-[var(--elx-gold-soft)] ring-1 ring-inset ring-[var(--elx-gold)]/30 hover:bg-[var(--elx-gold)]/20 disabled:opacity-50"
        >
          <Gift className="h-4 w-4" /> {busy ? "Generating…" : "Generate referral link"}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-700">
              {code}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={link}
              className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2 text-xs text-zinc-800"
            />
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-100 px-2.5 py-2 text-xs text-zinc-700 hover:bg-zinc-200"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

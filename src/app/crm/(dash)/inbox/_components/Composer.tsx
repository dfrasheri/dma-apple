"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Send } from "lucide-react";
import { MESSAGING_WINDOW_MS } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

type DraftResponse = {
  ok: boolean;
  data: {
    text: string;
    handoff: boolean;
    confidence: number;
    citedFactIds: string[];
    intent: string;
    reason?: string;
  } | null;
};

export function Composer({
  conversationId,
  lastInboundMs
}: {
  conversationId: string;
  lastInboundMs: number | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftMeta, setDraftMeta] = useState<DraftResponse["data"] | null>(null);

  const withinWindow =
    lastInboundMs != null && Date.now() - lastInboundMs < MESSAGING_WINDOW_MS;

  async function suggestReply() {
    setDrafting(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm/conversations/${conversationId}/draft`);
      const json: DraftResponse = await res.json();
      if (!res.ok || !json.ok) {
        setError("Could not generate a draft.");
        return;
      }
      if (json.data) {
        setBody(json.data.text);
        setDraftMeta(json.data);
      } else {
        setError("No draft available for this conversation.");
      }
    } catch {
      setError("Could not generate a draft.");
    } finally {
      setDrafting(false);
    }
  }

  async function send() {
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/crm/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, author: "agent" })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError("Failed to send message.");
        return;
      }
      setBody("");
      setDraftMeta(null);
      router.refresh();
    } catch {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
            withinWindow
              ? "bg-emerald-400/10 text-emerald-700 ring-emerald-400/30"
              : "bg-amber-400/10 text-amber-700 ring-amber-400/30"
          )}
        >
          {withinWindow ? "within 24h window" : "outside 24h, template required"}
        </span>

        <button
          type="button"
          onClick={suggestReply}
          disabled={drafting}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-100 disabled:opacity-50"
        >
          <Bot className="h-4 w-4" />
          {drafting ? "Thinking…" : "Suggest reply (bot)"}
        </button>
      </div>

      {draftMeta && (
        <div className="mb-3 rounded-lg border border-zinc-200 bg-black/20 px-3 py-2 text-xs text-zinc-600">
          <span className="text-zinc-700">Intent:</span>{" "}
          <span className="text-[var(--elx-gold)]">{draftMeta.intent}</span>
          {" · "}
          <span className="text-zinc-700">Hand-off:</span>{" "}
          <span className={draftMeta.handoff ? "text-amber-700" : "text-emerald-700"}>
            {draftMeta.handoff ? "yes (route to human)" : "no"}
          </span>
          {" · "}
          <span className="text-zinc-700">Cited facts:</span>{" "}
          <span className="tabular-nums">{draftMeta.citedFactIds.length}</span>
        </div>
      )}

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Type a reply…"
        className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[var(--elx-gold)]/50 focus:outline-none"
      />

      {error && <p className="mt-2 text-xs text-rose-700">{error}</p>}

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={send}
          disabled={sending || !body.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--elx-gold)] px-3 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

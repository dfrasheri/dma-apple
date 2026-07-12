"use client";

import { useMemo, useState } from "react";
import { Loader2, RefreshCw, Sparkles, X } from "lucide-react";

import { Badge, Card, EmptyState } from "@/components/crm/ui";
import {
  CONTENT_CHANNEL_META,
  CONTENT_FORMAT_META,
  CONTENT_STATUS_META,
  LOCALE_LABELS,
  MARKET_LABELS
} from "@/lib/crm/display";
import { cn } from "@/lib/utils";
import { CONTENT_LOCALES, type ContentLocale, type ContentTopicStatus } from "@/lib/crm/types";
import type {
  CalendarSummary,
  CalendarWithTopics,
  TopicWithVariants
} from "@/lib/crm/services/content";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ApiEnvelope<T> = { ok: boolean; data?: T; error?: string };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" }, ...init
  });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !body.ok) throw new Error(body.error ?? "Request failed");
  return body.data as T;
}

export function ContentBoard({
  initial,
  calendars
}: {
  initial: CalendarWithTopics | null;
  calendars: CalendarSummary[];
}) {
  const nextSlot = defaultNextMonth(calendars);
  const [cal, setCal] = useState<CalendarWithTopics | null>(initial);
  const [locale, setLocale] = useState<ContentLocale>("en");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [genYear, setGenYear] = useState(nextSlot.year);
  const [genMonth, setGenMonth] = useState(nextSlot.month);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = cal?.topics.find((t) => t.id === selectedId) ?? null;

  const monthExists = useMemo(
    () => calendars.some((c) => c.year === genYear && c.month === genMonth),
    [calendars, genYear, genMonth]
  );

  async function generate(regenerate: boolean) {
    setBusy(true);
    setError(null);
    try {
      const data = await api<CalendarWithTopics>("/api/crm/content", {
        method: "POST",
        body: JSON.stringify({ year: genYear, month: genMonth, regenerate })
      });
      setCal(data);
      setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setBusy(false);
    }
  }

  async function loadCalendar(id: string) {
    setBusy(true);
    setError(null);
    try {
      const data = await api<CalendarWithTopics>(`/api/crm/content?id=${id}`);
      setCal(data);
      setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(topicId: string, status: ContentTopicStatus) {
    try {
      await api(`/api/crm/content/topics/${topicId}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setCal((prev) =>
        prev
          ? {
              ...prev,
              topics: prev.topics.map((t) => (t.id === topicId ? { ...t, status } : t))
            }
          : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    }
  }

  async function regenerateTopic(topicId: string) {
    try {
      const updated = await api<TopicWithVariants>(`/api/crm/content/topics/${topicId}`, {
        method: "POST"
      });
      setCal((prev) =>
        prev
          ? { ...prev, topics: prev.topics.map((t) => (t.id === topicId ? updated : t)) }
          : prev
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to regenerate");
    }
  }

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <Card className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex items-center gap-2">
          <select
            value={genMonth}
            onChange={(e) => setGenMonth(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-800"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2026, i, 1).toLocaleDateString("en-GB", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={genYear}
            onChange={(e) => setGenYear(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-800"
          >
            {[genYear - 1, genYear, genYear + 1, genYear + 2].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => generate(monthExists)}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--elx-gold)]/15 px-3 py-1.5 text-sm font-medium text-[var(--elx-gold-soft)] ring-1 ring-inset ring-[var(--elx-gold)]/30 transition-colors hover:bg-[var(--elx-gold)]/25 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {monthExists ? "Regenerate month" : "Generate month"}
          </button>
        </div>

        {calendars.length > 0 && (
          <select
            value={cal?.id ?? ""}
            onChange={(e) => e.target.value && loadCalendar(e.target.value)}
            className="ml-auto rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700"
          >
            <option value="">Jump to month…</option>
            {calendars.map((c) => (
              <option key={c.id} value={c.id}>
                {new Date(c.year, c.month - 1, 1).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric"
                })}{" "}
                · {c.topicCount} topics
              </option>
            ))}
          </select>
        )}
      </Card>

      {error && (
        <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* language tabs */}
      {cal && (
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-xs uppercase tracking-wider text-zinc-500">Language</span>
          {CONTENT_LOCALES.filter((l) => cal.locales.includes(l)).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                locale === l
                  ? "bg-[var(--elx-gold)]/15 text-[var(--elx-gold-soft)] ring-1 ring-inset ring-[var(--elx-gold)]/30"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              {LOCALE_LABELS[l] ?? l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* calendar grid */}
      {!cal || cal.topics.length === 0 ? (
        <Card>
          <EmptyState
            title="No calendar yet"
            hint="Pick a month and hit Generate, the engine fills it with multilingual SEO listicles and GEO Q&A topics, ready for your review."
            icon={<Sparkles className="h-8 w-8" />}
          />
        </Card>
      ) : (
        <CalendarGrid
          cal={cal}
          locale={locale}
          onSelect={(id) => setSelectedId(id)}
          selectedId={selectedId}
        />
      )}

      {/* detail drawer */}
      {selected && (
        <TopicDrawer
          topic={selected}
          locale={locale}
          onClose={() => setSelectedId(null)}
          onStatus={setStatus}
          onRegenerate={regenerateTopic}
        />
      )}
    </div>
  );
}

// ── calendar grid ─────────────────────────────────────────────────────────────
function CalendarGrid({
  cal,
  locale,
  onSelect,
  selectedId
}: {
  cal: CalendarWithTopics;
  locale: ContentLocale;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  const first = new Date(cal.year, cal.month - 1, 1);
  const daysInMonth = new Date(cal.year, cal.month, 0).getDate();
  const leading = (first.getDay() + 6) % 7; // Monday-first offset

  const byDay = useMemo(() => {
    const map = new Map<number, TopicWithVariants[]>();
    for (const t of cal.topics) {
      const day = new Date(t.slotDate).getDate();
      const arr = map.get(day) ?? [];
      arr.push(t);
      map.set(day, arr);
    }
    return map;
  }, [cal]);

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Card className="p-3">
      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-[10px] uppercase tracking-wider text-zinc-500">
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => (
          <div
            key={i}
            className={cn(
              "min-h-24 rounded-lg border border-zinc-200 p-1.5",
              day ? "bg-zinc-50" : "bg-transparent"
            )}
          >
            {day && (
              <>
                <div className="mb-1 px-0.5 text-[11px] tabular-nums text-zinc-500">{day}</div>
                <div className="space-y-1">
                  {(byDay.get(day) ?? []).map((t) => {
                    const title = variantTitle(t, locale);
                    const ch = CONTENT_CHANNEL_META[t.channel];
                    return (
                      <button
                        key={t.id}
                        onClick={() => onSelect(t.id)}
                        title={title}
                        className={cn(
                          "block w-full truncate rounded px-1.5 py-1 text-left text-[11px] leading-tight ring-1 ring-inset transition-colors",
                          ch.className,
                          selectedId === t.id && "outline outline-1 outline-zinc-400"
                        )}
                      >
                        {title}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── topic drawer ──────────────────────────────────────────────────────────────
function TopicDrawer({
  topic,
  locale,
  onClose,
  onStatus,
  onRegenerate
}: {
  topic: TopicWithVariants;
  locale: ContentLocale;
  onClose: () => void;
  onStatus: (id: string, s: ContentTopicStatus) => void;
  onRegenerate: (id: string) => void;
}) {
  const fmt = CONTENT_FORMAT_META[topic.format];
  const ch = CONTENT_CHANNEL_META[topic.channel];
  const st = CONTENT_STATUS_META[topic.status];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg overflow-y-auto border-l border-zinc-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-zinc-900">
            {variantTitle(topic, locale)}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <Badge className={ch.className}>{ch.label}</Badge>
          <Badge className={fmt.className}>{fmt.label}</Badge>
          <Badge className={st.className}>{st.label}</Badge>
          <Badge className="bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200">
            {MARKET_LABELS[topic.market] ?? topic.market}
          </Badge>
          <Badge className="bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200">
            schema: {topic.schemaType}
          </Badge>
        </div>

        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Target keyword</div>
          <div className="mt-0.5 text-sm text-zinc-800">{topic.keyword}</div>
          <div className="mt-1 text-[11px] text-zinc-500">
            {new Date(topic.slotDate).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long"
            })}
          </div>
        </div>

        {/* editorial brief */}
        <div className="mb-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Editorial brief
          </div>
          <ul className="space-y-1.5 text-sm text-zinc-700">
            {topic.brief.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[var(--elx-gold)]">›</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* language variants */}
        <div className="mb-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            All languages ({topic.variants.length})
          </div>
          <div className="space-y-2">
            {topic.variants.map((v) => (
              <div
                key={v.id}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700">
                    {LOCALE_LABELS[v.locale] ?? v.locale.toUpperCase()}
                  </span>
                  <span className="text-sm text-zinc-900">{v.title}</span>
                </div>
                <div className="mt-1 truncate text-[11px] text-zinc-500">/blog/{v.slug}</div>
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatus(topic.id, "approved")}
            className="rounded-lg bg-emerald-400/15 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-400/30 hover:bg-emerald-400/25"
          >
            Approve
          </button>
          <button
            onClick={() => onStatus(topic.id, "scheduled")}
            className="rounded-lg bg-violet-400/15 px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-inset ring-violet-400/30 hover:bg-violet-400/25"
          >
            Schedule
          </button>
          <button
            onClick={() => onStatus(topic.id, "rejected")}
            className="rounded-lg bg-rose-400/15 px-3 py-1.5 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-400/30 hover:bg-rose-400/25"
          >
            Reject
          </button>
          <button
            onClick={() => onRegenerate(topic.id)}
            className="ml-auto inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-200"
          >
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────
function variantTitle(topic: TopicWithVariants, locale: ContentLocale): string {
  return (
    topic.variants.find((v) => v.locale === locale)?.title ??
    topic.variants[0]?.title ??
    "Untitled"
  );
}

function defaultNextMonth(calendars: CalendarSummary[]): { year: number; month: number } {
  if (calendars.length > 0) {
    // calendars are sorted newest-first by the service
    const latest = calendars[0];
    const d = new Date(latest.year, latest.month, 1); // month is 1-based → next month
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

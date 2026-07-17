"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ExternalLink,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Trash2,
  X
} from "lucide-react";

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
  TopicVariantEditInput,
  TopicWithVariants
} from "@/lib/crm/services/content";
import type { ContentTopicVariant, PublishedPost } from "@/db/schema";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** A published article the board can link to: /{locale}/blog/{category}/{slug}. */
export type PublishedPostRef = {
  topicId: string;
  locale: string;
  category: string;
  slug: string;
};

type ApiEnvelope<T> = { ok: boolean; data?: T; error?: string };

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" }, ...init
  });
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !body.ok) throw new Error(body.error ?? "Request failed");
  return body.data as T;
}

// ── endpoint contract (single source of truth for this board) ─────────────────
// PATCH  topic(id)          { status }                                  → TopicWithVariants (HIL status)
// POST   topic(id)          (no body, regenerate topic in place)        → TopicWithVariants
// DELETE topic(id)          (delete topic + variants + published posts) → true
// PATCH  variantUrl(id)     { locale, title?, slug?, metaDescription?, body?, brief? } → TopicWithVariants
// POST   bodyUrl(id)        { locale } (draft the article body)         → ContentTopicVariant
// POST   publishUrl(id)     (publish every variant with a body)         → PublishedPost[]
// DELETE publishUrl(id)     (unpublish, topic back to "approved")       → ContentTopic
const topicUrl = (id: string) => `/api/crm/content/topics/${id}`;
const variantUrl = (id: string) => `/api/crm/content/topics/${id}/variant`;
const bodyUrl = (id: string) => `/api/crm/content/topics/${id}/body`;
const publishUrl = (id: string) => `/api/crm/content/topics/${id}/publish`;

const errMsg = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

export function ContentBoard({
  initial,
  calendars,
  published
}: {
  initial: CalendarWithTopics | null;
  calendars: CalendarSummary[];
  published: PublishedPostRef[];
}) {
  const nextSlot = defaultNextMonth(calendars);
  const [cal, setCal] = useState<CalendarWithTopics | null>(initial);
  const [locale, setLocale] = useState<ContentLocale>("en");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [genYear, setGenYear] = useState(nextSlot.year);
  const [genMonth, setGenMonth] = useState(nextSlot.month);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postsByTopic, setPostsByTopic] = useState<Record<string, PublishedPostRef[]>>(() => {
    const map: Record<string, PublishedPostRef[]> = {};
    for (const ref of published) (map[ref.topicId] ??= []).push(ref);
    return map;
  });

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
      setError(errMsg(e, "Failed to generate"));
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
      setError(errMsg(e, "Failed to load"));
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(topicId: string, status: ContentTopicStatus) {
    try {
      await api(topicUrl(topicId), {
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
      setError(errMsg(e, "Failed to update"));
    }
  }

  async function regenerateTopic(topicId: string) {
    try {
      const updated = await api<TopicWithVariants>(topicUrl(topicId), {
        method: "POST"
      });
      setCal((prev) =>
        prev
          ? { ...prev, topics: prev.topics.map((t) => (t.id === topicId ? updated : t)) }
          : prev
      );
    } catch (e) {
      setError(errMsg(e, "Failed to regenerate"));
    }
  }

  /** Optimistic per-locale edit; reverts the board on failure and rethrows for the drawer. */
  async function editVariant(
    topicId: string,
    editLocale: ContentLocale,
    fields: TopicVariantEditInput
  ): Promise<void> {
    const snapshot = cal;
    setCal((prev) =>
      prev
        ? {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id !== topicId
                ? t
                : {
                    ...t,
                    ...(fields.keyword !== undefined ? { keyword: fields.keyword } : {}),
                    ...(fields.brief !== undefined ? { brief: fields.brief } : {}),
                    variants: t.variants.map((v) =>
                      v.locale !== editLocale
                        ? v
                        : {
                            ...v,
                            ...(fields.title !== undefined ? { title: fields.title } : {}),
                            ...(fields.slug !== undefined ? { slug: fields.slug } : {}),
                            ...(fields.metaDescription !== undefined
                              ? { metaDescription: fields.metaDescription }
                              : {}),
                            ...(fields.body !== undefined ? { body: fields.body } : {})
                          }
                    )
                  }
            )
          }
        : prev
    );
    try {
      const updated = await api<TopicWithVariants>(variantUrl(topicId), {
        method: "PATCH",
        body: JSON.stringify({ locale: editLocale, ...fields })
      });
      setCal((prev) =>
        prev
          ? { ...prev, topics: prev.topics.map((t) => (t.id === topicId ? updated : t)) }
          : prev
      );
    } catch (e) {
      setCal(snapshot);
      throw e;
    }
  }

  /** Draft the article body for one locale; returns the markdown so the drawer can show it. */
  async function generateBody(topicId: string, bodyLocale: ContentLocale): Promise<string> {
    const variant = await api<ContentTopicVariant>(bodyUrl(topicId), {
      method: "POST",
      body: JSON.stringify({ locale: bodyLocale })
    });
    setCal((prev) =>
      prev
        ? {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId
                ? {
                    ...t,
                    variants: t.variants.map((v) =>
                      v.locale === bodyLocale ? { ...v, body: variant.body } : v
                    )
                  }
                : t
            )
          }
        : prev
    );
    return variant.body ?? "";
  }

  async function publishTopic(topicId: string): Promise<void> {
    const posts = await api<PublishedPost[]>(publishUrl(topicId), { method: "POST" });
    setPostsByTopic((prev) => ({
      ...prev,
      [topicId]: posts.map((p) => ({
        topicId,
        locale: p.locale,
        category: p.category,
        slug: p.slug
      }))
    }));
    setCal((prev) =>
      prev
        ? {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId ? { ...t, status: "published" as ContentTopicStatus } : t
            )
          }
        : prev
    );
  }

  async function unpublishTopic(topicId: string): Promise<void> {
    await api<unknown>(publishUrl(topicId), { method: "DELETE" });
    setPostsByTopic((prev) => {
      const next = { ...prev };
      delete next[topicId];
      return next;
    });
    setCal((prev) =>
      prev
        ? {
            ...prev,
            topics: prev.topics.map((t) =>
              t.id === topicId ? { ...t, status: "approved" as ContentTopicStatus } : t
            )
          }
        : prev
    );
  }

  async function deleteTopic(topicId: string): Promise<void> {
    await api<unknown>(topicUrl(topicId), { method: "DELETE" });
    setPostsByTopic((prev) => {
      const next = { ...prev };
      delete next[topicId];
      return next;
    });
    setCal((prev) =>
      prev ? { ...prev, topics: prev.topics.filter((t) => t.id !== topicId) } : prev
    );
    setSelectedId(null);
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

      {/* detail drawer (keyed so editor state resets per topic) */}
      {selected && (
        <TopicDrawer
          key={selected.id}
          topic={selected}
          initialLocale={locale}
          publishedRefs={postsByTopic[selected.id] ?? []}
          onClose={() => setSelectedId(null)}
          onStatus={setStatus}
          onRegenerate={regenerateTopic}
          onEdit={editVariant}
          onGenerateBody={generateBody}
          onPublish={publishTopic}
          onUnpublish={unpublishTopic}
          onDelete={deleteTopic}
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
const BTN =
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors disabled:cursor-not-allowed disabled:opacity-50";
const INPUT =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-[var(--elx-gold)]/60 focus:outline-none";

type VariantDraft = { title: string; slug: string; metaDescription: string; body: string };

function draftFrom(variant: ContentTopicVariant | null): VariantDraft {
  return {
    title: variant?.title ?? "",
    slug: variant?.slug ?? "",
    metaDescription: variant?.metaDescription ?? "",
    body: variant?.body ?? ""
  };
}

function TopicDrawer({
  topic,
  initialLocale,
  publishedRefs,
  onClose,
  onStatus,
  onRegenerate,
  onEdit,
  onGenerateBody,
  onPublish,
  onUnpublish,
  onDelete
}: {
  topic: TopicWithVariants;
  initialLocale: ContentLocale;
  publishedRefs: PublishedPostRef[];
  onClose: () => void;
  onStatus: (id: string, s: ContentTopicStatus) => void;
  onRegenerate: (id: string) => void;
  onEdit: (id: string, locale: ContentLocale, fields: TopicVariantEditInput) => Promise<void>;
  onGenerateBody: (id: string, locale: ContentLocale) => Promise<string>;
  onPublish: (id: string) => Promise<void>;
  onUnpublish: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const fmt = CONTENT_FORMAT_META[topic.format];
  const ch = CONTENT_CHANNEL_META[topic.channel];
  const st = CONTENT_STATUS_META[topic.status];

  const [editLocale, setEditLocale] = useState<ContentLocale>(() =>
    topic.variants.some((v) => v.locale === initialLocale)
      ? initialLocale
      : topic.variants[0]?.locale ?? "en"
  );
  const variant = topic.variants.find((v) => v.locale === editLocale) ?? null;

  const [draft, setDraft] = useState<VariantDraft>(() => draftFrom(variant));
  const [briefDraft, setBriefDraft] = useState(() => topic.brief.join("\n"));
  const [drawerError, setDrawerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [writing, setWriting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const briefLines = briefDraft
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const briefDirty = briefLines.join("\n") !== topic.brief.join("\n");
  const variantDirty = variant
    ? draft.title !== variant.title ||
      draft.slug !== variant.slug ||
      draft.metaDescription !== variant.metaDescription ||
      draft.body !== (variant.body ?? "")
    : false;
  const dirty = briefDirty || variantDirty;

  const isPublished = topic.status === "published";
  const hasAnyBody = topic.variants.some((v) => v.body && v.body.trim());
  const anyBusy = saving || writing || publishing || unpublishing || deleting;

  const wordCount = countWords(draft.body);
  const bodyRows = draft.body
    ? Math.min(28, Math.max(10, draft.body.split("\n").length + 2))
    : 6;

  function switchLocale(l: ContentLocale) {
    if (l === editLocale || writing || saving) return;
    setEditLocale(l);
    setDraft(draftFrom(topic.variants.find((v) => v.locale === l) ?? null));
    setDrawerError(null);
  }

  async function save() {
    if (!variant || !dirty || anyBusy) return;
    const title = draft.title.trim();
    const slug = draft.slug === variant.slug ? variant.slug : slugify(draft.slug);
    const metaDescription = draft.metaDescription.trim();
    if (!title || !slug) {
      setDrawerError("Title and slug cannot be empty.");
      return;
    }

    const fields: TopicVariantEditInput = {};
    if (title !== variant.title) fields.title = title;
    if (slug !== variant.slug) fields.slug = slug;
    if (metaDescription !== variant.metaDescription) fields.metaDescription = metaDescription;
    if (draft.body !== (variant.body ?? "")) fields.body = draft.body.trim() ? draft.body : null;
    if (briefDirty) fields.brief = briefLines;

    setSaving(true);
    setDrawerError(null);
    try {
      await onEdit(topic.id, editLocale, fields);
      setDraft({ title, slug, metaDescription, body: draft.body });
      setBriefDraft(briefLines.join("\n"));
    } catch (e) {
      setDrawerError(errMsg(e, "Failed to save changes"));
    } finally {
      setSaving(false);
    }
  }

  async function writeBody() {
    if (!variant || anyBusy) return;
    setWriting(true);
    setDrawerError(null);
    try {
      const body = await onGenerateBody(topic.id, editLocale);
      setDraft((prev) => ({ ...prev, body }));
    } catch (e) {
      setDrawerError(errMsg(e, "Failed to write the article"));
    } finally {
      setWriting(false);
    }
  }

  async function publish() {
    if (!hasAnyBody || anyBusy) return;
    setPublishing(true);
    setDrawerError(null);
    try {
      await onPublish(topic.id);
    } catch (e) {
      setDrawerError(errMsg(e, "Failed to publish"));
    } finally {
      setPublishing(false);
    }
  }

  async function unpublish() {
    if (anyBusy) return;
    setUnpublishing(true);
    setDrawerError(null);
    try {
      await onUnpublish(topic.id);
    } catch (e) {
      setDrawerError(errMsg(e, "Failed to unpublish"));
    } finally {
      setUnpublishing(false);
    }
  }

  async function confirmDelete() {
    if (deleting) return;
    setDeleting(true);
    setDrawerError(null);
    try {
      await onDelete(topic.id); // parent removes the topic + closes the drawer
    } catch (e) {
      setDrawerError(errMsg(e, "Failed to delete"));
      setDeleting(false);
      setDeleteArmed(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-900/30"
      onClick={() => {
        if (!dirty && !anyBusy) onClose();
      }}
    >
      <div
        className="h-full w-full max-w-lg overflow-y-auto border-l border-zinc-200 bg-white p-4 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-zinc-900">
            {variantTitle(topic, editLocale)}
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

        {/* live URLs */}
        {isPublished && publishedRefs.length > 0 && (
          <div className="mb-4 rounded-lg border border-teal-400/30 bg-teal-400/10 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-700">
              Live on the blog
            </div>
            <ul className="mt-1.5 space-y-1">
              {publishedRefs.map((ref) => {
                const href = `/${ref.locale}/blog/${ref.category}/${ref.slug}`;
                return (
                  <li key={`${ref.locale}-${ref.slug}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 break-all text-sm text-teal-700 underline decoration-teal-400/50 underline-offset-2 hover:text-teal-900"
                    >
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {href}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

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

        {/* editor */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Proofread &amp; edit ({topic.variants.length} languages)
            </div>
            {dirty && (
              <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 ring-1 ring-inset ring-amber-400/30">
                Unsaved changes
              </span>
            )}
          </div>

          {/* per-language tabs (teal dot = article body drafted) */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {topic.variants.map((v) => (
              <button
                key={v.locale}
                onClick={() => switchLocale(v.locale)}
                disabled={writing || saving}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
                  editLocale === v.locale
                    ? "bg-[var(--elx-gold)]/15 text-[var(--elx-gold-soft)] ring-1 ring-inset ring-[var(--elx-gold)]/30"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                {LOCALE_LABELS[v.locale] ?? v.locale.toUpperCase()}
                {v.body && v.body.trim() ? <span className="ml-1 text-teal-600">●</span> : null}
              </button>
            ))}
          </div>

          {variant && (
            <div className="space-y-3">
              <Field label="Title">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                  className={INPUT}
                />
              </Field>

              <Field label="Slug">
                <input
                  value={draft.slug}
                  onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))}
                  spellCheck={false}
                  className={cn(INPUT, "font-mono text-xs")}
                />
                <p className="mt-1 break-all text-[11px] text-zinc-500">
                  /{editLocale}/blog/…/{slugify(draft.slug) || "—"}
                </p>
              </Field>

              <Field label="Meta description">
                <textarea
                  value={draft.metaDescription}
                  onChange={(e) => setDraft((p) => ({ ...p, metaDescription: e.target.value }))}
                  rows={2}
                  className={cn(INPUT, "resize-y")}
                />
              </Field>

              <Field label="Editorial brief · one line per H2 section" shared>
                <textarea
                  value={briefDraft}
                  onChange={(e) => setBriefDraft(e.target.value)}
                  rows={Math.min(10, Math.max(4, briefDraft.split("\n").length + 1))}
                  className={cn(INPUT, "resize-y")}
                />
              </Field>

              <Field
                label="Article body · markdown"
                right={
                  <span className="text-[11px] tabular-nums text-zinc-500">
                    {wordCount.toLocaleString("en-GB")} words
                  </span>
                }
              >
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft((p) => ({ ...p, body: e.target.value }))}
                  rows={bodyRows}
                  spellCheck={false}
                  placeholder="No article yet — hit “Write article” below, or paste markdown here."
                  className={cn(
                    INPUT,
                    "resize-y bg-zinc-50 font-mono text-xs leading-relaxed"
                  )}
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Markdown: <code>## heading</code> · <code>**bold**</code> · <code>- list</code>
                </p>
              </Field>

              {drawerError && (
                <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-700">
                  {drawerError}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={writeBody}
                  disabled={anyBusy}
                  className={cn(
                    BTN,
                    "w-full bg-[var(--elx-gold)]/15 text-[var(--elx-gold-soft)] ring-[var(--elx-gold)]/30 hover:bg-[var(--elx-gold)]/25 sm:w-auto"
                  )}
                >
                  {writing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {writing
                    ? "Writing…"
                    : draft.body.trim()
                      ? `Rewrite article (${LOCALE_LABELS[editLocale] ?? editLocale})`
                      : `Write article (${LOCALE_LABELS[editLocale] ?? editLocale})`}
                </button>
                <button
                  onClick={save}
                  disabled={!dirty || anyBusy}
                  className={cn(
                    BTN,
                    "w-full bg-emerald-400/15 text-emerald-700 ring-emerald-400/30 hover:bg-emerald-400/25 sm:w-auto"
                  )}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* workflow */}
        <div className="mb-5 border-t border-zinc-200 pt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Workflow
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              onClick={() => onStatus(topic.id, "approved")}
              className={cn(BTN, "bg-emerald-400/15 text-emerald-700 ring-emerald-400/30 hover:bg-emerald-400/25")}
            >
              Approve
            </button>
            <button
              onClick={() => onStatus(topic.id, "scheduled")}
              className={cn(BTN, "bg-violet-400/15 text-violet-700 ring-violet-400/30 hover:bg-violet-400/25")}
            >
              Schedule
            </button>
            <button
              onClick={() => onStatus(topic.id, "rejected")}
              className={cn(BTN, "bg-rose-400/15 text-rose-700 ring-rose-400/30 hover:bg-rose-400/25")}
            >
              Reject
            </button>
            <button
              onClick={() => onRegenerate(topic.id)}
              className={cn(BTN, "bg-zinc-100 text-zinc-700 ring-zinc-200 hover:bg-zinc-200 sm:ml-auto")}
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        </div>

        {/* publishing */}
        <div className="mb-5 border-t border-zinc-200 pt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Publishing
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              onClick={publish}
              disabled={!hasAnyBody || anyBusy}
              title={
                !hasAnyBody
                  ? "Write (and save) an article body in at least one language first."
                  : undefined
              }
              className={cn(
                BTN,
                "w-full bg-teal-400/15 text-teal-700 ring-teal-400/30 hover:bg-teal-400/25 sm:w-auto"
              )}
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {publishing ? "Publishing…" : isPublished ? "Republish" : "Publish to blog"}
            </button>
            {isPublished && (
              <button
                onClick={unpublish}
                disabled={anyBusy}
                className={cn(
                  BTN,
                  "w-full bg-zinc-100 text-zinc-700 ring-zinc-200 hover:bg-zinc-200 sm:w-auto"
                )}
              >
                {unpublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {unpublishing ? "Unpublishing…" : "Unpublish"}
              </button>
            )}
          </div>
          {!hasAnyBody && (
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Publishing unlocks once at least one language has a saved article body — use
              “Write article” above.
            </p>
          )}
          {isPublished && (
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Edited something? Save your changes, then hit Republish to refresh the live article.
            </p>
          )}
        </div>

        {/* danger zone */}
        <div className="border-t border-zinc-200 pt-4">
          {!deleteArmed ? (
            <button
              onClick={() => setDeleteArmed(true)}
              disabled={anyBusy}
              className={cn(
                BTN,
                "w-full bg-rose-400/10 text-rose-700 ring-rose-400/30 hover:bg-rose-400/20 sm:w-auto"
              )}
            >
              <Trash2 className="h-4 w-4" />
              Delete topic
            </button>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={cn(
                  BTN,
                  "w-full bg-rose-500/90 text-white ring-rose-600/50 hover:bg-rose-600 sm:w-auto"
                )}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {deleting ? "Deleting…" : "Really delete?"}
              </button>
              <button
                onClick={() => setDeleteArmed(false)}
                disabled={deleting}
                className={cn(
                  BTN,
                  "w-full bg-zinc-100 text-zinc-700 ring-zinc-200 hover:bg-zinc-200 sm:w-auto"
                )}
              >
                Cancel
              </button>
            </div>
          )}
          {deleteArmed && isPublished && (
            <p className="mt-1.5 text-[11px] text-rose-600">
              This also takes the live article(s) off the blog.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── small form primitives ─────────────────────────────────────────────────────
function Field({
  label,
  right,
  shared,
  children
}: {
  label: string;
  right?: ReactNode;
  shared?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
          {shared && <span className="ml-1 normal-case text-zinc-400">(all languages)</span>}
        </span>
        {right}
      </div>
      {children}
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

function slugify(raw: string): string {
  return raw
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function countWords(s: string): number {
  const m = s.trim().match(/\S+/g);
  return m ? m.length : 0;
}

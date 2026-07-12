/**
 * Content-engine service, the SEO + GEO blog calendar. The ONLY writer for
 * `content_calendars`, `content_topics`, `content_topic_variants`.
 *
 * Generation is delegated to the pure `content/generator.ts`; this module just
 * persists, lists, and applies HIL status changes. A calendar is one month;
 * topics carry localized variants (one per content locale).
 */
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  contentCalendars,
  contentTopics,
  contentTopicVariants,
  type ContentCalendar,
  type ContentTopic,
  type ContentTopicVariant
} from "@/db/schema";
import type { ContentLocale, ContentTopicStatus } from "@/lib/crm/types";
import { generateCalendar } from "@/lib/crm/content/generator";

const now = () => new Date();

export type TopicWithVariants = ContentTopic & { variants: ContentTopicVariant[] };
export type CalendarWithTopics = ContentCalendar & { topics: TopicWithVariants[] };

export type CalendarSummary = ContentCalendar & {
  topicCount: number;
  approvedCount: number;
  seoCount: number;
  geoCount: number;
};

// ── reads ────────────────────────────────────────────────────────────────────
export async function listCalendars(): Promise<CalendarSummary[]> {
  const calendars = db
    .select()
    .from(contentCalendars)
    .orderBy(desc(contentCalendars.year), desc(contentCalendars.month))
    .all();

  return calendars.map((cal) => {
    const topics = db
      .select()
      .from(contentTopics)
      .where(eq(contentTopics.calendarId, cal.id))
      .all();
    return {
      ...cal,
      topicCount: topics.length,
      approvedCount: topics.filter((t) => t.status === "approved" || t.status === "scheduled" || t.status === "published").length,
      seoCount: topics.filter((t) => t.channel === "seo").length,
      geoCount: topics.filter((t) => t.channel === "geo").length
    };
  });
}

export async function getCalendar(id: string): Promise<CalendarWithTopics | null> {
  const cal = db.select().from(contentCalendars).where(eq(contentCalendars.id, id)).get();
  if (!cal) return null;
  return hydrate(cal);
}

export async function getLatestCalendar(): Promise<CalendarWithTopics | null> {
  const cal = db
    .select()
    .from(contentCalendars)
    .orderBy(desc(contentCalendars.year), desc(contentCalendars.month))
    .get();
  if (!cal) return null;
  return hydrate(cal);
}

function hydrate(cal: ContentCalendar): CalendarWithTopics {
  const topics = db
    .select()
    .from(contentTopics)
    .where(eq(contentTopics.calendarId, cal.id))
    .orderBy(asc(contentTopics.slotDate))
    .all();
  const withVariants: TopicWithVariants[] = topics.map((t) => ({
    ...t,
    variants: db
      .select()
      .from(contentTopicVariants)
      .where(eq(contentTopicVariants.topicId, t.id))
      .all()
  }));
  return { ...cal, topics: withVariants };
}

// ── generation ───────────────────────────────────────────────────────────────
export type GenerateMonthInput = {
  year: number;
  month: number;
  locales?: ContentLocale[];
  count?: number;
  /** When true, replace an existing calendar for the month. */
  regenerate?: boolean;
};

export async function generateMonth(input: GenerateMonthInput): Promise<CalendarWithTopics> {
  const { year, month } = input;
  const existing = db
    .select()
    .from(contentCalendars)
    .where(and(eq(contentCalendars.year, year), eq(contentCalendars.month, month)))
    .get();

  if (existing && !input.regenerate) {
    return hydrate(existing);
  }

  const result = generateCalendar({
    year,
    month,
    locales: input.locales,
    count: input.count
  });

  return db.transaction((tx) => {
    if (existing) {
      // cascade deletes topics + variants
      tx.delete(contentCalendars).where(eq(contentCalendars.id, existing.id)).run();
    }

    const cal = tx
      .insert(contentCalendars)
      .values({
        year,
        month,
        locales: result.locales,
        seed: result.seed,
        status: "draft",
        generatedAt: now()
      })
      .returning()
      .get();

    for (const t of result.topics) {
      const slotDate = new Date(year, month - 1, t.slotDay, 9, 0, 0);
      const topic = tx
        .insert(contentTopics)
        .values({
          calendarId: cal.id,
          slotDate,
          format: t.format,
          channel: t.channel,
          market: t.market,
          subject: t.subject,
          keyword: t.keyword,
          schemaType: t.schemaType,
          brief: t.brief,
          status: "suggested"
        })
        .returning()
        .get();

      for (const v of t.variants) {
        tx.insert(contentTopicVariants)
          .values({
            topicId: topic.id,
            locale: v.locale,
            title: v.title,
            slug: v.slug,
            metaDescription: v.metaDescription
          })
          .run();
      }
    }

    return hydrate(cal);
  });
}

// ── HIL status changes ───────────────────────────────────────────────────────
export async function setTopicStatus(
  topicId: string,
  status: ContentTopicStatus
): Promise<ContentTopic | null> {
  const updated = db
    .update(contentTopics)
    .set({ status, updatedAt: now() })
    .where(eq(contentTopics.id, topicId))
    .returning()
    .get();
  return updated ?? null;
}

export async function setCalendarStatus(
  id: string,
  status: ContentCalendar["status"]
): Promise<ContentCalendar | null> {
  const updated = db
    .update(contentCalendars)
    .set({ status, updatedAt: now() })
    .where(eq(contentCalendars.id, id))
    .returning()
    .get();
  return updated ?? null;
}

/**
 * Re-roll a single topic in place (keeps its slot date). Uses a fresh seed
 * derived from the topic id so the new suggestion differs from the old one.
 */
export async function regenerateTopic(topicId: string): Promise<TopicWithVariants | null> {
  const topic = db.select().from(contentTopics).where(eq(contentTopics.id, topicId)).get();
  if (!topic) return null;
  const cal = db
    .select()
    .from(contentCalendars)
    .where(eq(contentCalendars.id, topic.calendarId))
    .get();
  if (!cal) return null;

  // derive a per-topic seed so the single re-roll is varied but reproducible
  const seedBump = Array.from(topicId).reduce((n, c) => (n + c.charCodeAt(0)) | 0, 0);
  const fresh = generateCalendar({
    year: cal.year,
    month: cal.month,
    locales: cal.locales,
    count: 1,
    seed: cal.seed + seedBump + 7
  });
  const gen = fresh.topics[0];

  return db.transaction((tx) => {
    const updated = tx
      .update(contentTopics)
      .set({
        format: gen.format,
        channel: gen.channel,
        market: gen.market,
        subject: gen.subject,
        keyword: gen.keyword,
        schemaType: gen.schemaType,
        brief: gen.brief,
        status: "suggested",
        updatedAt: now()
      })
      .where(eq(contentTopics.id, topicId))
      .returning()
      .get();

    tx.delete(contentTopicVariants).where(eq(contentTopicVariants.topicId, topicId)).run();
    for (const v of gen.variants) {
      tx.insert(contentTopicVariants)
        .values({
          topicId,
          locale: v.locale,
          title: v.title,
          slug: v.slug,
          metaDescription: v.metaDescription
        })
        .run();
    }

    return {
      ...updated,
      variants: tx
        .select()
        .from(contentTopicVariants)
        .where(eq(contentTopicVariants.topicId, topicId))
        .all()
    };
  });
}

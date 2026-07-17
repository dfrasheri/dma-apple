/**
 * Content-engine service, the SEO + GEO blog calendar. The ONLY writer for
 * `content_calendars`, `content_topics`, `content_topic_variants` and
 * `published_posts`.
 *
 * Generation is delegated to the pure `content/generator.ts` (fed with the
 * competitor map for competitive angles); this module persists, lists, applies
 * HIL status changes, drafts article bodies (AI with deterministic fallback)
 * and publishes finished variants to `published_posts` for the public blog.
 */
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  contentCalendars,
  contentTopics,
  contentTopicVariants,
  publishedPosts,
  type ContentCalendar,
  type ContentTopic,
  type ContentTopicVariant,
  type PublishedPost
} from "@/db/schema";
import type { ContentLocale, ContentTopicStatus } from "@/lib/crm/types";
import { generateCalendar } from "@/lib/crm/content/generator";
import { listCompetitors } from "./competitors";
import { aiComplete, hasAnthropicKey } from "@/lib/ai";
import { GUARDRAILS } from "@/lib/chat-i18n";
import { knowledgeText, searchKnowledge } from "@/lib/clinic-knowledge";

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
    count: input.count,
    competitors: await listCompetitors()
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

// ── article body generation ──────────────────────────────────────────────────
const LOCALE_NAMES: Record<ContentLocale, string> = {
  en: "English",
  sq: "Albanian",
  it: "Italian",
  de: "German",
  fr: "French"
};

/** Localized deterministic-fallback strings (CTA + 3 canned FAQ Q&As). */
const FALLBACK_CTA: Record<ContentLocale, string> = {
  en: "Every case is different, which is why Dental Med Austria prepares a free, written, personalised treatment plan from your X-ray or photos, with no obligation. It is the only honest way to know your exact treatment and timeline before you travel.",
  sq: "Çdo rast është i ndryshëm, prandaj Dental Med Austria përgatit falas një plan trajtimi të personalizuar me shkrim nga radiografia ose fotot tuaja, pa asnjë detyrim. Është mënyra e vetme e ndershme për të ditur saktësisht trajtimin dhe afatet tuaja.",
  it: "Ogni caso è diverso: per questo Dental Med Austria prepara gratuitamente un piano di cura scritto e personalizzato dalla tua radiografia o dalle tue foto, senza impegno. È l'unico modo onesto per conoscere il tuo trattamento esatto prima di partire.",
  de: "Jeder Fall ist anders. Deshalb erstellt Dental Med Austria kostenlos einen schriftlichen, persönlichen Behandlungsplan anhand Ihres Röntgenbildes oder Ihrer Fotos, völlig unverbindlich. Nur so kennen Sie Ihre genaue Behandlung, bevor Sie reisen.",
  fr: "Chaque cas est différent : c'est pourquoi Dental Med Austria prépare gratuitement un plan de traitement écrit et personnalisé à partir de votre radiographie ou de vos photos, sans engagement. C'est la seule façon honnête de connaître votre traitement exact avant de voyager."
};

const FALLBACK_FAQ: Record<ContentLocale, { q: string; a: string }[]> = {
  en: [
    { q: "Is treatment at Dental Med Austria safe?", a: "Yes. The clinic works to ISO 9001 quality management with rigorous sterilisation protocols and strict European hygiene standards, using internationally recognised systems and materials such as Straumann and Ivoclar." },
    { q: "How much will my treatment cost?", a: "There is no honest one-size-fits-all figure. Send an X-ray or photos and the clinical team prepares a free, written, personalised treatment plan with your exact recommendation, so you know everything before you book." },
    { q: "How does treatment work if I travel from abroad?", a: "The clinic supports patients end to end: airport pickup in Tirana, partner hotels, multilingual care in English, Italian, German and French, and aftercare follow-up once you are home." }
  ],
  sq: [
    { q: "A është i sigurt trajtimi në Dental Med Austria?", a: "Po. Klinika punon sipas menaxhimit të cilësisë ISO 9001, me protokolle rigoroze sterilizimi dhe standarde strikte evropiane higjiene, duke përdorur sisteme dhe materiale ndërkombëtare si Straumann dhe Ivoclar." },
    { q: "Sa do të kushtojë trajtimi im?", a: "Nuk ka një shifër të vetme të ndershme për të gjithë. Dërgoni një radiografi ose foto dhe ekipi klinik përgatit falas një plan trajtimi të personalizuar me shkrim, që të dini gjithçka para se të rezervoni." },
    { q: "Si funksionon trajtimi nëse udhëtoj nga jashtë?", a: "Klinika i mbështet pacientët nga fillimi në fund: pritje në aeroportin e Tiranës, hotele partnere, kujdes në shqip, anglisht, italisht dhe gjermanisht, dhe ndjekje pas kthimit në shtëpi." }
  ],
  it: [
    { q: "Le cure alla Dental Med Austria sono sicure?", a: "Sì. La clinica opera secondo la gestione qualità ISO 9001, con protocolli di sterilizzazione rigorosi e severi standard igienici europei, utilizzando sistemi e materiali riconosciuti a livello internazionale come Straumann e Ivoclar." },
    { q: "Quanto costerà il mio trattamento?", a: "Non esiste una cifra unica e onesta valida per tutti. Invia una radiografia o delle foto e il team clinico prepara gratuitamente un piano di cura scritto e personalizzato, così sai tutto prima di prenotare." },
    { q: "Come funziona il trattamento se arrivo dall'estero?", a: "La clinica segue i pazienti dall'inizio alla fine: transfer dall'aeroporto di Tirana, hotel partner, assistenza multilingue in italiano, inglese, tedesco e francese, e follow-up dopo il rientro a casa." }
  ],
  de: [
    { q: "Ist die Behandlung bei Dental Med Austria sicher?", a: "Ja. Die Klinik arbeitet nach ISO-9001-Qualitätsmanagement mit rigorosen Sterilisationsprotokollen und strengen europäischen Hygienestandards und verwendet international anerkannte Systeme und Materialien wie Straumann und Ivoclar." },
    { q: "Wie viel wird meine Behandlung kosten?", a: "Eine ehrliche Pauschalzahl gibt es nicht. Senden Sie ein Röntgenbild oder Fotos, und das klinische Team erstellt kostenlos einen schriftlichen, persönlichen Behandlungsplan, damit Sie vor der Buchung alles wissen." },
    { q: "Wie läuft die Behandlung ab, wenn ich aus dem Ausland anreise?", a: "Die Klinik begleitet Patienten von Anfang bis Ende: Abholung am Flughafen Tirana, Partnerhotels, mehrsprachige Betreuung auf Deutsch, Englisch und Italienisch sowie Nachsorge nach der Rückkehr." }
  ],
  fr: [
    { q: "Les soins chez Dental Med Austria sont-ils sûrs ?", a: "Oui. La clinique applique un management de la qualité ISO 9001, des protocoles de stérilisation rigoureux et de stricts standards d'hygiène européens, avec des systèmes et matériaux reconnus comme Straumann et Ivoclar." },
    { q: "Combien coûtera mon traitement ?", a: "Il n'existe pas de chiffre unique honnête. Envoyez une radiographie ou des photos et l'équipe clinique prépare gratuitement un plan de traitement écrit et personnalisé, pour tout savoir avant de réserver." },
    { q: "Comment se déroule le traitement si je viens de l'étranger ?", a: "La clinique accompagne les patients de bout en bout : accueil à l'aéroport de Tirana, hôtels partenaires, assistance multilingue en français, anglais, italien et allemand, et suivi après votre retour." }
  ]
};

/** "## FAQ" heading per locale for the fallback body. */
const FALLBACK_FAQ_HEADING: Record<ContentLocale, string> = {
  en: "FAQ",
  sq: "Pyetje të Shpeshta (FAQ)",
  it: "Domande Frequenti (FAQ)",
  de: "Häufige Fragen (FAQ)",
  fr: "Questions Fréquentes (FAQ)"
};

function getVariant(
  topicId: string,
  locale: ContentLocale
): ContentTopicVariant | null {
  return (
    db
      .select()
      .from(contentTopicVariants)
      .where(
        and(
          eq(contentTopicVariants.topicId, topicId),
          eq(contentTopicVariants.locale, locale)
        )
      )
      .get() ?? null
  );
}

/** H2 outline lines from a topic brief (drops H1/FAQ/guidance lines). */
function briefH2s(brief: string[]): string[] {
  return brief
    .filter((l) => /^H2:\s*/i.test(l))
    .map((l) =>
      l
        .replace(/^H2:\s*/i, "")
        .replace(/\.\s*$/, "")
        .trim()
    )
    .filter(Boolean);
}

/**
 * Deterministic no-AI article body (~700 words): intro from the variant's own
 * localized meta description, one section per brief H2 grounded in matching
 * clinic-knowledge passages, a localized FAQ block and the treatment-plan CTA.
 */
function fallbackBody(topic: ContentTopic, variant: ContentTopicVariant): string {
  const usedEntryIds = new Set<string>();
  const passagesFor = (query: string, limit: number): string[] => {
    const out: string[] = [];
    for (const s of searchKnowledge(query, limit + usedEntryIds.size)) {
      if (usedEntryIds.has(s.entry.id)) continue;
      usedEntryIds.add(s.entry.id);
      out.push(knowledgeText(s.entry));
      if (out.length >= limit) break;
    }
    return out;
  };

  const parts: string[] = [];
  parts.push(variant.metaDescription);
  const intro = passagesFor(topic.keyword, 1);
  if (intro.length) parts.push(intro[0]);

  const headings = briefH2s(topic.brief);
  const sections = headings.length
    ? headings
    : ["Overview", "What to expect", "Quality and safety"];
  for (const heading of sections) {
    parts.push(`## ${heading}`);
    const passages = passagesFor(`${topic.keyword} ${heading}`, 2);
    if (passages.length) {
      parts.push(passages.join("\n\n"));
    } else {
      parts.push(FALLBACK_CTA[variant.locale]);
    }
  }

  parts.push(`## ${FALLBACK_FAQ_HEADING[variant.locale]}`);
  for (const { q, a } of FALLBACK_FAQ[variant.locale]) {
    parts.push(`**${q}**\n\n${a}`);
  }

  parts.push(FALLBACK_CTA[variant.locale]);
  return parts.join("\n\n");
}

/**
 * Draft the article body for one (topic, locale) variant and persist it to the
 * variant's `body` column. Uses Claude when a key is configured; otherwise (or
 * on any AI failure) falls back to the deterministic knowledge-grounded body.
 * Returns the updated variant, or null when the topic/variant doesn't exist.
 */
export async function generateArticleBody(
  topicId: string,
  locale: ContentLocale
): Promise<ContentTopicVariant | null> {
  const topic = db
    .select()
    .from(contentTopics)
    .where(eq(contentTopics.id, topicId))
    .get();
  if (!topic) return null;
  const variant = getVariant(topicId, locale);
  if (!variant) return null;

  const grounding = searchKnowledge(topic.keyword, 4)
    .map((s) => `- ${s.entry.title}: ${knowledgeText(s.entry)}`)
    .join("\n");

  let body: string | null = null;
  if (hasAnthropicKey()) {
    const system = [
      "You are a professional multilingual dental-clinic content writer for Dental Med Austria, a premium dental clinic in Tirana, Albania, serving local and international (dental-tourism) patients.",
      "",
      `Clinic communication guardrails: ${GUARDRAILS}`,
      "",
      "IMPORTANT: the conversational-length and no-markdown guardrails above apply to chat replies, NOT to this task; here you write a full blog article in markdown. Every safety rule still applies in full: no prices, no named individual clinicians, no promised guarantees or bookings, no diagnosis.",
      "",
      "Article instructions:",
      `- Write ENTIRELY in ${LOCALE_NAMES[locale]}.`,
      "- Length: about 1100-1400 words of markdown.",
      '- Structure: a short intro (no H1, the title is rendered separately), then "## " H2 sections following the editorial brief outline.',
      '- Include a "## FAQ" section (heading localized) with exactly 3 question/answer pairs, each question in bold.',
      "- Practical, warm, patient-focused tone; honest and specific, no hype.",
      "- Mention that the clinic prepares a free, written, personalised treatment plan from the patient's X-ray or photos, and route ALL cost questions to it.",
      "- NEVER name, quote or allude to any competitor clinic.",
      "- NEVER state, imply or compare any specific price, price range or savings figure, in any currency.",
      "- Ground factual claims about the clinic ONLY in the provided facts; do not invent statistics, equipment or credentials.",
      "- Output ONLY the markdown article body, nothing else."
    ].join("\n");

    const user = [
      `Primary keyword: ${topic.keyword}`,
      `Article title: ${variant.title}`,
      "",
      "Editorial brief (outline + guidance):",
      ...topic.brief.map((l) => `- ${l}`),
      "",
      "Verified facts about the clinic (grounding):",
      grounding || "- (no matching knowledge passages)"
    ].join("\n");

    body = await aiComplete({ system, user, maxTokens: 4000 });
  }

  if (!body || !body.trim()) body = fallbackBody(topic, variant);

  const updated = db
    .update(contentTopicVariants)
    .set({ body })
    .where(eq(contentTopicVariants.id, variant.id))
    .returning()
    .get();
  return updated ?? null;
}

// ── editing / deletion ───────────────────────────────────────────────────────
export type TopicVariantEditInput = {
  /** Variant-level fields. */
  title?: string;
  slug?: string;
  metaDescription?: string;
  body?: string | null;
  /** Topic-level fields (apply to every locale). */
  keyword?: string;
  brief?: string[];
};

/**
 * Edit one localized variant (title/slug/metaDescription/body) and/or the
 * topic-level keyword/brief. Returns the topic with all variants, or null
 * when the topic or the (topic, locale) variant doesn't exist.
 */
export async function editTopicVariant(
  topicId: string,
  locale: ContentLocale,
  fields: TopicVariantEditInput
): Promise<TopicWithVariants | null> {
  const topic = db
    .select()
    .from(contentTopics)
    .where(eq(contentTopics.id, topicId))
    .get();
  if (!topic) return null;
  const variant = getVariant(topicId, locale);
  if (!variant) return null;

  return db.transaction((tx) => {
    const variantSet: Partial<ContentTopicVariant> = {};
    if (fields.title !== undefined) variantSet.title = fields.title;
    if (fields.slug !== undefined) variantSet.slug = fields.slug;
    if (fields.metaDescription !== undefined) variantSet.metaDescription = fields.metaDescription;
    if (fields.body !== undefined) variantSet.body = fields.body;
    if (Object.keys(variantSet).length) {
      tx.update(contentTopicVariants)
        .set(variantSet)
        .where(eq(contentTopicVariants.id, variant.id))
        .run();
    }

    const topicSet: Partial<ContentTopic> = {};
    if (fields.keyword !== undefined) topicSet.keyword = fields.keyword;
    if (fields.brief !== undefined) topicSet.brief = fields.brief;
    if (Object.keys(topicSet).length) {
      topicSet.updatedAt = now();
      tx.update(contentTopics)
        .set(topicSet)
        .where(eq(contentTopics.id, topicId))
        .run();
    }

    const fresh = tx
      .select()
      .from(contentTopics)
      .where(eq(contentTopics.id, topicId))
      .get();
    if (!fresh) return null;
    return {
      ...fresh,
      variants: tx
        .select()
        .from(contentTopicVariants)
        .where(eq(contentTopicVariants.topicId, topicId))
        .all()
    };
  });
}

/**
 * Delete a topic, its variants (FK cascade) and any published_posts rows that
 * came from it. Returns true when a topic row was actually removed.
 */
export async function deleteTopic(topicId: string): Promise<boolean> {
  return db.transaction((tx) => {
    tx.delete(publishedPosts).where(eq(publishedPosts.topicId, topicId)).run();
    const deleted = tx
      .delete(contentTopics)
      .where(eq(contentTopics.id, topicId))
      .returning()
      .get();
    return Boolean(deleted);
  });
}

// ── publishing ───────────────────────────────────────────────────────────────
/** subject id → public blog category slug (see BLOG_CATEGORIES in blog-data.ts). */
const SUBJECT_CATEGORY: Record<string, string> = {
  "dental-implants": "dental-tourism",
  "all-on-4": "dental-tourism",
  "dental-tourism": "dental-tourism",
  "cost-savings": "dental-tourism",
  "quality-safety": "dental-tourism",
  "best-clinic": "dental-tourism",
  "dental-crowns": "dental-tips",
  "veneers": "dental-tips",
  "dental-prostheses": "dental-tips",
  "orthodontics": "dental-tips",
  "teeth-whitening": "dental-tips",
  "root-canal": "dental-tips"
};

/** subject id → an existing blog hero image (paths already used by blog-data). */
const SUBJECT_IMAGE: Record<string, string> = {
  "dental-implants": "/images/dma/blog/implants-cost.jpg",
  "all-on-4": "/images/dma/blog/all-on-4.jpg",
  "dental-crowns": "/images/dma/blog/crowns.jpg",
  "veneers": "/images/dma/blog/veneers.jpg",
  "dental-prostheses": "/images/dma/blog/dentures.jpg",
  "orthodontics": "/images/dma/blog-orthodontics.webp",
  "teeth-whitening": "/images/dma/blog/teeth-whitening.jpg",
  "root-canal": "/images/dma/blog/root-canal.jpg",
  "dental-tourism": "/images/dma/blog/why-albania.jpg",
  "cost-savings": "/images/dma/blog/financing-savings.jpg",
  "quality-safety": "/images/dma/blog/is-it-safe.jpg",
  "best-clinic": "/images/dma/blog/best-clinic.jpg"
};

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Publish every variant of a topic that has a generated body to
 * `published_posts` (upsert keyed on the originating topic + locale; slugs are
 * unique per locale). First publish sets `date`/`publishedAt`; a re-publish
 * refreshes content + `updatedAt` and keeps the original dates. Sets the topic
 * status to "published". Throws when no variant has a body yet.
 */
export async function publishTopic(topicId: string): Promise<PublishedPost[]> {
  const topic = db
    .select()
    .from(contentTopics)
    .where(eq(contentTopics.id, topicId))
    .get();
  if (!topic) throw new Error(`Topic ${topicId} not found.`);

  const variants = db
    .select()
    .from(contentTopicVariants)
    .where(eq(contentTopicVariants.topicId, topicId))
    .all();
  const ready = variants.filter((v) => v.body && v.body.trim());
  if (!ready.length) {
    throw new Error(
      "No article body has been generated for this topic yet. Generate at least one language's article before publishing."
    );
  }

  const category = SUBJECT_CATEGORY[topic.subject] ?? "dental-tips";
  const image = SUBJECT_IMAGE[topic.subject] ?? null;
  const publishedNow = now();

  return db.transaction((tx) => {
    const posts: PublishedPost[] = [];
    for (const v of ready) {
      const existing =
        tx
          .select()
          .from(publishedPosts)
          .where(
            and(
              eq(publishedPosts.topicId, topicId),
              eq(publishedPosts.locale, v.locale)
            )
          )
          .get() ?? null;

      // A different topic already owns this (slug, locale) → fail clearly
      // instead of tripping the raw UNIQUE constraint.
      const slugClash = tx
        .select()
        .from(publishedPosts)
        .where(
          and(eq(publishedPosts.slug, v.slug), eq(publishedPosts.locale, v.locale))
        )
        .get();
      if (slugClash && slugClash.id !== existing?.id) {
        throw new Error(
          `A published post already uses slug "${v.slug}" for locale "${v.locale}". Edit this variant's slug first.`
        );
      }

      if (existing) {
        const updated = tx
          .update(publishedPosts)
          .set({
            grp: topic.id,
            title: v.title,
            slug: v.slug,
            category,
            excerpt: v.metaDescription,
            body: v.body as string,
            metaDescription: v.metaDescription,
            keywords: [topic.keyword],
            image,
            targetKeyword: topic.keyword,
            updatedAt: publishedNow
          })
          .where(eq(publishedPosts.id, existing.id))
          .returning()
          .get();
        posts.push(updated);
      } else {
        const inserted = tx
          .insert(publishedPosts)
          .values({
            topicId: topic.id,
            grp: topic.id,
            locale: v.locale,
            title: v.title,
            slug: v.slug,
            category,
            excerpt: v.metaDescription,
            body: v.body as string,
            metaDescription: v.metaDescription,
            keywords: [topic.keyword],
            image,
            faq: null,
            targetKeyword: topic.keyword,
            date: isoDate(publishedNow),
            publishedAt: publishedNow,
            updatedAt: publishedNow
          })
          .returning()
          .get();
        posts.push(inserted);
      }
    }

    tx.update(contentTopics)
      .set({ status: "published", updatedAt: publishedNow })
      .where(eq(contentTopics.id, topicId))
      .run();

    return posts;
  });
}

/**
 * Take a topic's articles off the public blog: delete its published_posts rows
 * and move the topic back to "approved". Returns the updated topic, or null.
 */
export async function unpublishTopic(topicId: string): Promise<ContentTopic | null> {
  return db.transaction((tx) => {
    tx.delete(publishedPosts).where(eq(publishedPosts.topicId, topicId)).run();
    const updated = tx
      .update(contentTopics)
      .set({ status: "approved", updatedAt: now() })
      .where(eq(contentTopics.id, topicId))
      .returning()
      .get();
    return updated ?? null;
  });
}

/** Published posts for the public API, newest publish date first. */
export async function listPublishedPosts(
  locale?: ContentLocale
): Promise<PublishedPost[]> {
  const base = db.select().from(publishedPosts);
  const rows = locale
    ? base.where(eq(publishedPosts.locale, locale)).all()
    : base.all();
  return rows.sort(
    (a, b) => b.date.localeCompare(a.date) || b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

/**
 * Dental Med Austria CRM, shared enums / unions.
 *
 * This file is the single source of truth for every string-literal union used
 * across the schema, the API validators, the libs and the UI. It imports
 * nothing else in the CRM so it can never create a cycle. Drizzle row types are
 * inferred in `src/db/schema.ts`; the value-arrays here back both the zod
 * validators (`schemas.ts`) and the UI option lists.
 */

// ── Leads ──────────────────────────────────────────────────────────────────
export const LEAD_STAGES = [
  "new",
  "qualified",
  "consult",
  "proposal",
  "won",
  "lost"
] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

/** Stages that count as an open pipeline (not won/lost). */
export const OPEN_LEAD_STAGES: readonly LeadStage[] = [
  "new",
  "qualified",
  "consult",
  "proposal"
];

export const LEAD_SOURCES = [
  "web_form",
  "instagram",
  "whatsapp",
  "messenger",
  "webchat",
  "email",
  "referral",
  "walk_in",
  "other"
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const ACTIVITY_TYPES = [
  "note",
  "stage_change",
  "message",
  "appointment",
  "score",
  "system"
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

// ── Team (assignment roster) ─────────────────────────────────────────────────
/** Staff roles the CRM can route work to. Coordinators chase leads. */
export const TEAM_ROLES = [
  "coordinator",
  "dentist",
  "reception",
  "marketing",
  "admin"
] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

/** Role whose active members receive new leads round-robin at intake. */
export const INTAKE_ROLE: TeamRole = "coordinator";

// ── Omnichannel inbox ────────────────────────────────────────────────────────
/** Channels the unified inbox speaks. `webchat` is the on-site widget. */
export const CHANNELS = [
  "instagram",
  "whatsapp",
  "messenger",
  "webchat",
  "email"
] as const;
export type Channel = (typeof CHANNELS)[number];

export const CONVERSATION_STATUSES = [
  "open",
  "pending",
  "snoozed",
  "closed"
] as const;
export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];

export const MESSAGE_DIRECTIONS = ["in", "out"] as const;
export type MessageDirection = (typeof MESSAGE_DIRECTIONS)[number];

export const MESSAGE_AUTHORS = ["contact", "agent", "bot", "system"] as const;
export type MessageAuthor = (typeof MESSAGE_AUTHORS)[number];

/**
 * Meta's messaging policy: outside a 24h window since the user's last inbound
 * message you may only send approved templates, not free-form replies.
 */
export const MESSAGING_WINDOW_MS = 24 * 60 * 60 * 1000;

// ── Social-fed knowledge base ────────────────────────────────────────────────
export const POST_STATUSES = ["live", "edited", "deleted"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const FACT_TYPES = [
  "open_day",
  "price",
  "promo",
  "location",
  "service",
  "general"
] as const;
export type FactType = (typeof FACT_TYPES)[number];

/**
 * Fact lifecycle. A fact is only ever served to the bot when it is `approved`
 * AND not retired AND not superseded. `pending_review` and `rejected` are HIL
 * states; `retired` means the source post was deleted or the fact replaced.
 */
export const FACT_STATUSES = [
  "pending_review",
  "approved",
  "rejected",
  "retired"
] as const;
export type FactStatus = (typeof FACT_STATUSES)[number];

/** High-stakes fact types must clear the HIL review queue before the bot states them. */
export const HIGH_STAKES_FACT_TYPES: readonly FactType[] = [
  "open_day",
  "price",
  "promo",
  "location"
];

/** Below this, a high-stakes fact is auto-routed to the review queue. */
export const AUTO_APPROVE_CONFIDENCE = 0.85;

// ── Appointments ─────────────────────────────────────────────────────────────
export const APPOINTMENT_STATUSES = [
  "requested",
  "confirmed",
  "completed",
  "no_show",
  "cancelled"
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

// ── Competitors ──────────────────────────────────────────────────────────────
/** How a competitor's price band was established. Never "scraped". */
export const PRICE_SOURCES = [
  "website",
  "market_sampling",
  "client_report",
  "estimate"
] as const;
export type PriceSource = (typeof PRICE_SOURCES)[number];

// ── Affiliates / referrals ───────────────────────────────────────────────────
/** partner = influencer/clinic/agency · patient = a treated patient referring others. */
export const AFFILIATE_KINDS = ["partner", "patient"] as const;
export type AffiliateKind = (typeof AFFILIATE_KINDS)[number];

/** pending = registered via the help desk, awaiting approval · active · paused. */
export const AFFILIATE_STATUSES = ["pending", "active", "paused"] as const;
export type AffiliateStatus = (typeof AFFILIATE_STATUSES)[number];

// ── Data-provenance legend (◆ ✚ ✎) ───────────────────────────────────────────
/** sourced ◆ (used as-is) · derived ✚ (created by us) · transformed ✎ (algorithmic). */
export const PROVENANCE = ["sourced", "derived", "transformed"] as const;
export type Provenance = (typeof PROVENANCE)[number];

export const CADENCES = [
  "realtime",
  "webhook",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "annual",
  "manual",
  "once"
] as const;
export type Cadence = (typeof CADENCES)[number];

export const PROVENANCE_GLYPH: Record<Provenance, string> = {
  sourced: "◆",
  derived: "✚",
  transformed: "✎"
};

// ── Content engine (SEO + GEO blog calendar) ─────────────────────────────────
/**
 * Languages the content engine writes topics in, the set the chatbot speaks.
 * Superset of the site UI locales (en/sq/it/de) plus `fr` for the Swiss/French
 * outreach push (the site can still render only its supported locales).
 */
export const CONTENT_LOCALES = ["en", "sq", "it", "de", "fr"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];

/** SEO = classic search ranking · GEO = cited by AI answer engines. */
export const CONTENT_CHANNELS = ["seo", "geo"] as const;
export type ContentChannel = (typeof CONTENT_CHANNELS)[number];

/** Editorial format. Each maps to a primary channel + schema type (generator.ts). */
export const CONTENT_FORMATS = [
  "listicle",
  "best_clinics",
  "cost_guide",
  "how_to",
  "comparison",
  "qa",
  "definitive_guide"
] as const;
export type ContentFormat = (typeof CONTENT_FORMATS)[number];

/** schema.org type emitted with the post, drives the GEO structured data. */
export const CONTENT_SCHEMA_TYPES = [
  "Article",
  "FAQPage",
  "MedicalWebPage",
  "ItemList"
] as const;
export type ContentSchemaType = (typeof CONTENT_SCHEMA_TYPES)[number];

/** Topic lifecycle. `suggested` is auto-generated; the rest are HIL decisions. */
export const CONTENT_TOPIC_STATUSES = [
  "suggested",
  "approved",
  "scheduled",
  "published",
  "rejected"
] as const;
export type ContentTopicStatus = (typeof CONTENT_TOPIC_STATUSES)[number];

export const CONTENT_CALENDAR_STATUSES = ["draft", "active", "archived"] as const;
export type ContentCalendarStatus = (typeof CONTENT_CALENDAR_STATUSES)[number];

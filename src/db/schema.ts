/**
 * Dental Med Austria CRM, database schema (Drizzle, SQLite dialect).
 *
 * Conventions:
 *  - Text primary keys (UUID) generated app-side via `$defaultFn` so rows can be
 *    created without a round-trip and ids are stable across a Postgres migration.
 *  - Timestamps are `timestamp_ms` → JS `Date` in app code.
 *  - String-literal columns are typed with `$type<…>()` against `src/lib/crm/types`.
 *  - Booleans are `integer({ mode: "boolean" })`.
 *
 * The reconcile key for the knowledge base is `socialPosts.postId` (the platform
 * post id), NOT the surrogate `id`, facts reference it so an edited/deleted post
 * updates its facts in place.
 */
import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex
} from "drizzle-orm/sqlite-core";
import type {
  ActivityType,
  AppointmentStatus,
  Channel,
  ContentCalendarStatus,
  ContentChannel,
  ContentFormat,
  ContentLocale,
  ContentSchemaType,
  ContentTopicStatus,
  ConversationStatus,
  FactStatus,
  FactType,
  LeadSource,
  LeadStage,
  MessageAuthor,
  MessageDirection,
  PostStatus,
  PriceSource,
  TeamRole
} from "@/lib/crm/types";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date());

// ── contacts ─────────────────────────────────────────────────────────────────
export const contacts = sqliteTable(
  "contacts",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    city: text("city"),
    country: text("country"),
    locale: text("locale"),
    igHandle: text("ig_handle"),
    avatarUrl: text("avatar_url"),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    emailIdx: index("contacts_email_idx").on(t.email)
  })
);

// ── leads ────────────────────────────────────────────────────────────────────
export const leads = sqliteTable(
  "leads",
  {
    id: id(),
    contactId: text("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    /**
     * Human-readable lead reference encoding origin + channel + date, e.g.
     * `CH-WC-260628-A3F2` (country-channel-YYMMDD-rand). Generated at intake.
     */
    refCode: text("ref_code"),
    /** Service slug or name (see src/lib/services.ts / content.ts). */
    service: text("service"),
    stage: text("stage").$type<LeadStage>().notNull().default("new"),
    /** ✚ derived, see scoring.ts. 0–100. */
    score: integer("score").notNull().default(0),
    source: text("source").$type<LeadSource>().notNull().default("other"),
    /** Estimated deal value in EUR. */
    valueEstimate: real("value_estimate"),
    owner: text("owner"),
    notes: text("notes"),
    /** Where the lead came in from (e.g. a campaign / referrer URL). */
    sourceDetail: text("source_detail"),
    /** ✚ attributed, the affiliate whose ?ref code brought this lead, if any. */
    affiliateId: text("affiliate_id"),
    lostReason: text("lost_reason"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    stageIdx: index("leads_stage_idx").on(t.stage),
    contactIdx: index("leads_contact_idx").on(t.contactId),
    affiliateIdx: index("leads_affiliate_idx").on(t.affiliateId)
  })
);

// ── affiliates (referral partners + patient referrers) ───────────────────────
export const affiliates = sqliteTable(
  "affiliates",
  {
    id: id(),
    /** Short code used in the link: dentalmedaustria.com/?ref=CODE. Unique. */
    code: text("code").notNull(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    /** partner = influencer/clinic/agency · patient = a treated patient referring others. */
    kind: text("kind").notNull().default("partner"),
    /** pending (registered, not yet approved) · active · paused. */
    status: text("status").notNull().default("pending"),
    /** Optional commission percentage (human-maintained). */
    commissionPct: real("commission_pct"),
    company: text("company"),
    website: text("website"),
    /** How they intend to promote (from the registration form). */
    audience: text("audience"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    codeUnique: uniqueIndex("affiliates_code_unique").on(t.code),
    statusIdx: index("affiliates_status_idx").on(t.status)
  })
);

// ── team_members (assignment roster) ─────────────────────────────────────────
export const teamMembers = sqliteTable(
  "team_members",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email"),
    role: text("role").$type<TeamRole>().notNull().default("coordinator"),
    /** Inactive members keep their history but drop out of the rotation. */
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    /** Round-robin cursor: the active member with the oldest value is next. */
    lastAssignedAt: integer("last_assigned_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    roleActiveIdx: index("team_members_role_active_idx").on(t.role, t.active)
  })
);

// ── lead_activities (timeline) ───────────────────────────────────────────────
export const leadActivities = sqliteTable(
  "lead_activities",
  {
    id: id(),
    leadId: text("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: text("type").$type<ActivityType>().notNull(),
    body: text("body"),
    meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
    author: text("author"),
    createdAt: createdAt()
  },
  (t) => ({
    leadIdx: index("lead_activities_lead_idx").on(t.leadId)
  })
);

// ── conversations (omnichannel) ──────────────────────────────────────────────
export const conversations = sqliteTable(
  "conversations",
  {
    id: id(),
    contactId: text("contact_id").references(() => contacts.id, {
      onDelete: "set null"
    }),
    channel: text("channel").$type<Channel>().notNull(),
    /** Platform thread id (IG thread, WA wa_id, etc.). */
    externalId: text("external_id"),
    subject: text("subject"),
    status: text("status").$type<ConversationStatus>().notNull().default("open"),
    assignee: text("assignee"),
    /** When false, the bot will not draft replies for this thread. */
    botEnabled: integer("bot_enabled", { mode: "boolean" })
      .notNull()
      .default(true),
    /** Drives the Meta 24h messaging-window calculation. */
    lastInboundAt: integer("last_inbound_at", { mode: "timestamp_ms" }),
    lastMessageAt: integer("last_message_at", { mode: "timestamp_ms" }),
    unread: integer("unread", { mode: "boolean" }).notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    statusIdx: index("conversations_status_idx").on(t.status),
    channelIdx: index("conversations_channel_idx").on(t.channel)
  })
);

// ── messages ─────────────────────────────────────────────────────────────────
export const messages = sqliteTable(
  "messages",
  {
    id: id(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    direction: text("direction").$type<MessageDirection>().notNull(),
    author: text("author").$type<MessageAuthor>().notNull(),
    body: text("body").notNull(),
    /** Snapshot of the channel at send time (matches the parent conversation). */
    channel: text("channel").$type<Channel>().notNull(),
    /** Optional structured payload: cited fact ids, template name, attachments. */
    meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: createdAt()
  },
  (t) => ({
    convIdx: index("messages_conversation_idx").on(t.conversationId)
  })
);

// ── competitors (the map) ────────────────────────────────────────────────────
export const competitors = sqliteTable(
  "competitors",
  {
    id: id(),
    name: text("name").notNull(),
    city: text("city"),
    country: text("country"),
    lat: real("lat"),
    lng: real("lng"),
    /** ◆ sourced from OSM. */
    website: text("website"),
    osmId: text("osm_id"),
    /** ✚ derived, parsed from the website (see ig-parse.ts). Recheck monthly. */
    instagramUrl: text("instagram_url"),
    igCheckedAt: integer("ig_checked_at", { mode: "timestamp_ms" }),
    /** ✎ ESTIMATED, human-maintained, never presented as scraped/live. */
    priceBand: text("price_band"),
    priceSource: text("price_source").$type<PriceSource>(),
    priceUpdatedAt: integer("price_updated_at", { mode: "timestamp_ms" }),
    /** Services this competitor is known to offer (free text tags). */
    services: text("services", { mode: "json" }).$type<string[]>(),
    rating: real("rating"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    cityIdx: index("competitors_city_idx").on(t.city)
  })
);

// ── social_posts (ingested, the reconcile spine) ─────────────────────────────
export const socialPosts = sqliteTable(
  "social_posts",
  {
    id: id(),
    /** Platform post id, the reconcile key. Unique. */
    postId: text("post_id").notNull(),
    account: text("account").notNull(),
    channel: text("channel").$type<Channel>().notNull().default("instagram"),
    caption: text("caption"),
    mediaUrl: text("media_url"),
    permalink: text("permalink"),
    postTimestamp: integer("post_timestamp", { mode: "timestamp_ms" }),
    /** Hash of caption+media, lets reconcile detect an edit cheaply. */
    contentHash: text("content_hash"),
    status: text("status").$type<PostStatus>().notNull().default("live"),
    fetchedAt: integer("fetched_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (t) => ({
    postIdUnique: uniqueIndex("social_posts_post_id_unique").on(t.postId)
  })
);

// ── social_facts (the heart) ─────────────────────────────────────────────────
export const socialFacts = sqliteTable(
  "social_facts",
  {
    id: id(),
    type: text("type").$type<FactType>().notNull(),
    /** Structured, filterable fields, this is what keeps Venice ≠ Venice Beach. */
    city: text("city"),
    venue: text("venue"),
    /** Event date as ISO `YYYY-MM-DD` for clean filtering. */
    date: text("date"),
    procedure: text("procedure"),
    doctor: text("doctor"),
    /** Type-specific extras (price value, promo code, etc.). */
    payload: text("payload", { mode: "json" }).$type<Record<string, unknown>>(),
    /** FK → socialPosts.postId (the reconcile key, not the surrogate id). */
    sourcePostId: text("source_post_id")
      .notNull()
      .references(() => socialPosts.postId, { onDelete: "cascade" }),
    /** 0–1 extraction confidence. */
    confidence: real("confidence").notNull().default(0),
    status: text("status").$type<FactStatus>().notNull().default("pending_review"),
    /** Self-reference: this fact's id was replaced by a newer fact. */
    supersededBy: text("superseded_by"),
    conflictFlag: integer("conflict_flag", { mode: "boolean" })
      .notNull()
      .default(false),
    conflictReason: text("conflict_reason"),
    extractedAt: integer("extracted_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    reviewedBy: text("reviewed_by"),
    reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    typeIdx: index("social_facts_type_idx").on(t.type),
    cityIdx: index("social_facts_city_idx").on(t.city),
    statusIdx: index("social_facts_status_idx").on(t.status),
    postIdx: index("social_facts_post_idx").on(t.sourcePostId)
  })
);

// ── appointments ─────────────────────────────────────────────────────────────
export const appointments = sqliteTable(
  "appointments",
  {
    id: id(),
    contactId: text("contact_id").references(() => contacts.id, {
      onDelete: "set null"
    }),
    leadId: text("lead_id").references(() => leads.id, { onDelete: "set null" }),
    service: text("service"),
    scheduledFor: integer("scheduled_for", { mode: "timestamp_ms" }).notNull(),
    durationMin: integer("duration_min").notNull().default(60),
    status: text("status")
      .$type<AppointmentStatus>()
      .notNull()
      .default("requested"),
    channel: text("channel").$type<Channel>(),
    location: text("location"),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    schedIdx: index("appointments_scheduled_idx").on(t.scheduledFor),
    statusIdx: index("appointments_status_idx").on(t.status)
  })
);

// ── market_stats (annual market intelligence) ────────────────────────────────
export const marketStats = sqliteTable(
  "market_stats",
  {
    id: id(),
    city: text("city").notNull(),
    country: text("country"),
    /** 0–100 composite affluence index (◆ sourced, annual). */
    affluenceIndex: real("affluence_index"),
    medianIncome: integer("median_income"),
    population: integer("population"),
    /** low | medium | high, demand for medical tourism from this market. */
    medicalTourismDemand: text("medical_tourism_demand"),
    /** Procedures over-indexed in this market (free text). */
    topProcedures: text("top_procedures", { mode: "json" }).$type<string[]>(),
    source: text("source"),
    year: integer("year").notNull(),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    cityYearIdx: uniqueIndex("market_stats_city_year_idx").on(t.city, t.year)
  })
);

// ── content_calendars (SEO + GEO blog plan, one per month) ───────────────────
export const contentCalendars = sqliteTable(
  "content_calendars",
  {
    id: id(),
    /** Calendar year, e.g. 2026. */
    year: integer("year").notNull(),
    /** 1–12. */
    month: integer("month").notNull(),
    /** Locales this month was generated for (subset of CONTENT_LOCALES). */
    locales: text("locales", { mode: "json" }).$type<ContentLocale[]>().notNull(),
    status: text("status")
      .$type<ContentCalendarStatus>()
      .notNull()
      .default("draft"),
    /** Deterministic seed used by the generator, lets a regenerate reproduce. */
    seed: integer("seed").notNull().default(0),
    generatedAt: integer("generated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    notes: text("notes"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    yearMonthUnique: uniqueIndex("content_calendars_year_month_unique").on(
      t.year,
      t.month
    )
  })
);

// ── content_topics (one planned post slot) ───────────────────────────────────
export const contentTopics = sqliteTable(
  "content_topics",
  {
    id: id(),
    calendarId: text("calendar_id")
      .notNull()
      .references(() => contentCalendars.id, { onDelete: "cascade" }),
    /** The day this post is scheduled to be published. */
    slotDate: integer("slot_date", { mode: "timestamp_ms" }).notNull(),
    format: text("format").$type<ContentFormat>().notNull(),
    /** seo (rank) vs geo (get cited by AI engines). */
    channel: text("channel").$type<ContentChannel>().notNull(),
    /** Geographic outreach target, e.g. "switzerland", "italy", "diaspora". */
    market: text("market").notNull(),
    /** What the post is about, a catalogue category/service slug or a theme id. */
    subject: text("subject").notNull(),
    /** The primary search keyword (English base) this topic targets. */
    keyword: text("keyword").notNull(),
    /** schema.org type to emit for GEO structured data. */
    schemaType: text("schema_type").$type<ContentSchemaType>().notNull(),
    /** Editorial brief: ordered H2 outline + SEO/GEO guidance lines. */
    brief: text("brief", { mode: "json" }).$type<string[]>().notNull(),
    status: text("status")
      .$type<ContentTopicStatus>()
      .notNull()
      .default("suggested"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => ({
    calendarIdx: index("content_topics_calendar_idx").on(t.calendarId),
    statusIdx: index("content_topics_status_idx").on(t.status),
    slotIdx: index("content_topics_slot_idx").on(t.slotDate)
  })
);

// ── content_topic_variants (one localized title/slug per topic per locale) ───
export const contentTopicVariants = sqliteTable(
  "content_topic_variants",
  {
    id: id(),
    topicId: text("topic_id")
      .notNull()
      .references(() => contentTopics.id, { onDelete: "cascade" }),
    locale: text("locale").$type<ContentLocale>().notNull(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    metaDescription: text("meta_description").notNull(),
    createdAt: createdAt()
  },
  (t) => ({
    topicLocaleUnique: uniqueIndex("content_variants_topic_locale_unique").on(
      t.topicId,
      t.locale
    )
  })
);

// ── relations (enable db.query …with) ────────────────────────────────────────
export const contactsRelations = relations(contacts, ({ many }) => ({
  leads: many(leads),
  conversations: many(conversations),
  appointments: many(appointments)
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [leads.contactId],
    references: [contacts.id]
  }),
  affiliate: one(affiliates, {
    fields: [leads.affiliateId],
    references: [affiliates.id]
  }),
  activities: many(leadActivities),
  appointments: many(appointments)
}));

export const affiliatesRelations = relations(affiliates, ({ many }) => ({
  leads: many(leads)
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, {
    fields: [leadActivities.leadId],
    references: [leads.id]
  })
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    contact: one(contacts, {
      fields: [conversations.contactId],
      references: [contacts.id]
    }),
    messages: many(messages)
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id]
  })
}));

export const socialPostsRelations = relations(socialPosts, ({ many }) => ({
  facts: many(socialFacts)
}));

export const socialFactsRelations = relations(socialFacts, ({ one }) => ({
  post: one(socialPosts, {
    fields: [socialFacts.sourcePostId],
    references: [socialPosts.postId]
  })
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  contact: one(contacts, {
    fields: [appointments.contactId],
    references: [contacts.id]
  }),
  lead: one(leads, {
    fields: [appointments.leadId],
    references: [leads.id]
  })
}));

export const contentCalendarsRelations = relations(
  contentCalendars,
  ({ many }) => ({
    topics: many(contentTopics)
  })
);

export const contentTopicsRelations = relations(
  contentTopics,
  ({ one, many }) => ({
    calendar: one(contentCalendars, {
      fields: [contentTopics.calendarId],
      references: [contentCalendars.id]
    }),
    variants: many(contentTopicVariants)
  })
);

export const contentTopicVariantsRelations = relations(
  contentTopicVariants,
  ({ one }) => ({
    topic: one(contentTopics, {
      fields: [contentTopicVariants.topicId],
      references: [contentTopics.id]
    })
  })
);

// ── inferred row types (import these in libs / UI) ───────────────────────────
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type NewLeadActivity = typeof leadActivities.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type Competitor = typeof competitors.$inferSelect;
export type NewCompetitor = typeof competitors.$inferInsert;
export type SocialPost = typeof socialPosts.$inferSelect;
export type NewSocialPost = typeof socialPosts.$inferInsert;
export type SocialFact = typeof socialFacts.$inferSelect;
export type NewSocialFact = typeof socialFacts.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type MarketStat = typeof marketStats.$inferSelect;
export type NewMarketStat = typeof marketStats.$inferInsert;
export type Affiliate = typeof affiliates.$inferSelect;
export type NewAffiliate = typeof affiliates.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ContentCalendar = typeof contentCalendars.$inferSelect;
export type NewContentCalendar = typeof contentCalendars.$inferInsert;
export type ContentTopic = typeof contentTopics.$inferSelect;
export type NewContentTopic = typeof contentTopics.$inferInsert;
export type ContentTopicVariant = typeof contentTopicVariants.$inferSelect;
export type NewContentTopicVariant = typeof contentTopicVariants.$inferInsert;

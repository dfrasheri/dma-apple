/**
 * Zod validators for every CRM API body. Route handlers parse with these via
 * `parseBody(req, schema)` (see http.ts). Enums reuse the value-arrays in
 * `types.ts` so the API and the DB can never drift.
 */
import { z } from "zod";
import {
  ACTIVITY_TYPES,
  AFFILIATE_KINDS,
  AFFILIATE_STATUSES,
  APPOINTMENT_STATUSES,
  CHANNELS,
  CONTENT_LOCALES,
  CONTENT_TOPIC_STATUSES,
  CONVERSATION_STATUSES,
  FACT_TYPES,
  LEAD_SOURCES,
  LEAD_STAGES,
  PRICE_SOURCES,
  TEAM_ROLES
} from "./types";

/** Build a zod enum from a readonly const tuple while preserving the literal union. */
const enumOf = <T extends string>(vals: readonly T[]) =>
  z.enum([...vals] as [T, ...T[]]);

const optionalEmail = z.string().email().optional().or(z.literal(""));
const optionalUrl = z.string().url().optional().or(z.literal(""));

// ── auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({ password: z.string().min(1) });

// ── leads ────────────────────────────────────────────────────────────────────
export const leadCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: optionalEmail,
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  locale: z.string().optional(),
  service: z.string().optional(),
  source: enumOf(LEAD_SOURCES).default("other"),
  sourceDetail: z.string().optional(),
  /** Human-readable origin+channel+date reference, e.g. CH-WC-260628-A3F2. */
  refCode: z.string().optional(),
  /** Affiliate this lead is attributed to (resolved from a ?ref code). */
  affiliateId: z.string().optional(),
  valueEstimate: z.number().nonnegative().optional(),
  owner: z.string().optional(),
  /** Free-text intake message, stored as the first `note` activity. */
  message: z.string().optional()
});

export const leadUpdateSchema = z
  .object({
    stage: enumOf(LEAD_STAGES).optional(),
    score: z.number().int().min(0).max(100).optional(),
    service: z.string().optional(),
    valueEstimate: z.number().optional(),
    owner: z.string().nullable().optional(),
    notes: z.string().optional(),
    lostReason: z.string().optional()
  })
  .refine((o) => Object.keys(o).length > 0, "No fields to update");

export const activityCreateSchema = z.object({
  type: enumOf(ACTIVITY_TYPES).default("note"),
  body: z.string().min(1),
  author: z.string().optional()
});

// ── inbox ────────────────────────────────────────────────────────────────────
export const conversationUpdateSchema = z
  .object({
    status: enumOf(CONVERSATION_STATUSES).optional(),
    assignee: z.string().nullable().optional(),
    botEnabled: z.boolean().optional()
  })
  .refine((o) => Object.keys(o).length > 0, "No fields to update");

/** Staff or bot sending an outbound reply. */
export const messageSendSchema = z.object({
  body: z.string().min(1),
  author: z.enum(["agent", "bot"]).default("agent"),
  meta: z.record(z.unknown()).optional()
});

/** Inbound message via a (simulated) channel webhook. */
export const inboundMessageSchema = z.object({
  channel: enumOf(CHANNELS),
  externalId: z.string().optional(),
  body: z.string().min(1),
  contact: z
    .object({
      name: z.string().optional(),
      handle: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional()
    })
    .optional()
});

// ── team (assignment roster) ─────────────────────────────────────────────────
export const teamMemberCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: optionalEmail,
  role: enumOf(TEAM_ROLES).default("coordinator"),
  active: z.boolean().default(true)
});

export const teamMemberUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: optionalEmail,
    role: enumOf(TEAM_ROLES).optional(),
    active: z.boolean().optional()
  })
  .refine((o) => Object.keys(o).length > 0, "No fields to update");

// ── competitors ──────────────────────────────────────────────────────────────
export const competitorCreateSchema = z.object({
  name: z.string().min(1),
  city: z.string().optional(),
  country: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  website: optionalUrl,
  instagramUrl: optionalUrl,
  priceBand: z.string().optional(),
  priceSource: enumOf(PRICE_SOURCES).optional(),
  services: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  notes: z.string().optional()
});
export const competitorUpdateSchema = competitorCreateSchema.partial();

// ── knowledge base ───────────────────────────────────────────────────────────
export const factReviewSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  reviewer: z.string().optional(),
  note: z.string().optional()
});

/** Human edits to a fact's structured fields (then re-review). */
export const factUpdateSchema = z
  .object({
    type: enumOf(FACT_TYPES).optional(),
    city: z.string().nullable().optional(),
    venue: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
    procedure: z.string().nullable().optional(),
    doctor: z.string().nullable().optional()
  })
  .refine((o) => Object.keys(o).length > 0, "No fields to update");

/** Trigger a post-sync + reconcile. `posts` optional; omit to use the mock feed. */
export const reconcileSchema = z
  .object({
    account: z.string().optional(),
    posts: z
      .array(
        z.object({
          postId: z.string(),
          account: z.string(),
          caption: z.string().optional(),
          mediaUrl: z.string().optional(),
          permalink: z.string().optional(),
          postTimestamp: z.string().optional(),
          deleted: z.boolean().optional()
        })
      )
      .optional()
  })
  .optional();

// ── appointments ─────────────────────────────────────────────────────────────
export const appointmentCreateSchema = z.object({
  contactId: z.string().optional(),
  leadId: z.string().optional(),
  service: z.string().optional(),
  scheduledFor: z.string(), // ISO datetime
  durationMin: z.number().int().positive().default(60),
  channel: enumOf(CHANNELS).optional(),
  location: z.string().optional(),
  notes: z.string().optional()
});

export const appointmentUpdateSchema = z
  .object({
    status: enumOf(APPOINTMENT_STATUSES).optional(),
    scheduledFor: z.string().optional(),
    service: z.string().optional(),
    notes: z.string().optional()
  })
  .refine((o) => Object.keys(o).length > 0, "No fields to update");

// ── affiliates ───────────────────────────────────────────────────────────────
/** Staff-created affiliate (active by default). */
export const affiliateCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: optionalEmail,
  phone: z.string().optional(),
  kind: enumOf(AFFILIATE_KINDS).default("partner"),
  status: enumOf(AFFILIATE_STATUSES).default("active"),
  commissionPct: z.number().min(0).max(100).optional(),
  company: z.string().optional(),
  website: optionalUrl,
  audience: z.string().optional(),
  notes: z.string().optional(),
  code: z.string().min(3).max(24).optional()
});

/** Public help-desk registration → a pending application. */
export const affiliateRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: optionalUrl,
  audience: z.string().optional()
});

// ── market intelligence ──────────────────────────────────────────────────────
export const marketUpsertSchema = z.object({
  city: z.string().min(1),
  country: z.string().optional(),
  affluenceIndex: z.number().min(0).max(100).optional(),
  medianIncome: z.number().int().optional(),
  population: z.number().int().optional(),
  medicalTourismDemand: z.enum(["low", "medium", "high"]).optional(),
  topProcedures: z.array(z.string()).optional(),
  source: z.string().optional(),
  year: z.number().int(),
  notes: z.string().optional()
});

// ── content engine (SEO + GEO calendar) ──────────────────────────────────────
export const contentGenerateSchema = z.object({
  year: z.number().int().min(2024).max(2100),
  month: z.number().int().min(1).max(12),
  locales: z.array(enumOf(CONTENT_LOCALES)).min(1).optional(),
  count: z.number().int().min(1).max(24).optional(),
  regenerate: z.boolean().optional()
});

export const contentTopicStatusSchema = z.object({
  status: enumOf(CONTENT_TOPIC_STATUSES)
});

// ── inferred input types ─────────────────────────────────────────────────────
export type LeadCreateInput = z.infer<typeof leadCreateSchema>;
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;
export type ActivityCreateInput = z.infer<typeof activityCreateSchema>;
export type ConversationUpdateInput = z.infer<typeof conversationUpdateSchema>;
export type MessageSendInput = z.infer<typeof messageSendSchema>;
export type InboundMessageInput = z.infer<typeof inboundMessageSchema>;
export type CompetitorCreateInput = z.infer<typeof competitorCreateSchema>;
export type CompetitorUpdateInput = z.infer<typeof competitorUpdateSchema>;
export type FactReviewInput = z.infer<typeof factReviewSchema>;
export type FactUpdateInput = z.infer<typeof factUpdateSchema>;
export type ReconcileInput = z.infer<typeof reconcileSchema>;
export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;
export type MarketUpsertInput = z.infer<typeof marketUpsertSchema>;
export type AffiliateCreateInput = z.infer<typeof affiliateCreateSchema>;
export type AffiliateRegisterInput = z.infer<typeof affiliateRegisterSchema>;
export type ContentGenerateInput = z.infer<typeof contentGenerateSchema>;
export type ContentTopicStatusInput = z.infer<typeof contentTopicStatusSchema>;
export type TeamMemberCreateInput = z.infer<typeof teamMemberCreateSchema>;
export type TeamMemberUpdateInput = z.infer<typeof teamMemberUpdateSchema>;

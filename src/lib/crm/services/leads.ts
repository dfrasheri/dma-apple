/**
 * Leads service, create/score/advance leads and keep the activity timeline.
 * The single entry point for every lead source (web form, webhook, manual) so
 * scoring + activity logging happen identically everywhere.
 */
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  contacts,
  conversations,
  leadActivities,
  leads,
  marketStats,
  type Contact,
  type Conversation,
  type Lead,
  type LeadActivity,
  type TeamMember
} from "@/db/schema";
import { scoreLead } from "../scoring";
import { phonesMatch } from "../phone";
import { nextAssignee } from "./team";
import type { LeadCreateInput, LeadUpdateInput } from "../schemas";
import { INTAKE_ROLE, OPEN_LEAD_STAGES, type ActivityType, type LeadStage } from "../types";

const now = () => new Date();

export type LeadWithContact = Lead & { contact: Contact | null };
export type LeadDetail = LeadWithContact & { activities: LeadActivity[] };

const normEmail = (e?: string | null) =>
  e && e.trim() ? e.trim().toLowerCase() : null;

function marketSignal(city?: string | null) {
  if (!city) return null;
  const m = db.select().from(marketStats).where(eq(marketStats.city, city)).get();
  return m
    ? { affluenceIndex: m.affluenceIndex, medicalTourismDemand: m.medicalTourismDemand }
    : null;
}

export function findOrCreateContact(input: {
  name: string;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  locale?: string | null;
  igHandle?: string | null;
}): Contact {
  const email = normEmail(input.email);
  let existing: Contact | undefined;
  if (email) existing = db.select().from(contacts).where(eq(contacts.email, email)).get();
  if (!existing && input.phone) {
    // Exact fast path, then fuzzy: "+355 67 703 3332", "0677033332" and the
    // WhatsApp wa_id "355677033332" must all resolve to the same person.
    existing = db.select().from(contacts).where(eq(contacts.phone, input.phone)).get();
    if (!existing) {
      existing = db
        .select()
        .from(contacts)
        .where(isNotNull(contacts.phone))
        .all()
        .find((c) => phonesMatch(c.phone, input.phone));
    }
  }

  if (existing) {
    // Backfill only MISSING fields so a later lead enriches the contact instead
    // of leaving an identifier (email, phone, city…) unset, mirrors the inbox's
    // ensureContact. Without this, matching on phone here would silently drop a
    // newly supplied email, and the next email-keyed lookup would fork a duplicate.
    const patch: Partial<Contact> = {};
    if (email && !existing.email) patch.email = email;
    if (input.phone && !existing.phone) patch.phone = input.phone;
    if (input.city && !existing.city) patch.city = input.city;
    if (input.country && !existing.country) patch.country = input.country;
    if (input.locale && !existing.locale) patch.locale = input.locale;
    if (input.igHandle && !existing.igHandle) patch.igHandle = input.igHandle;
    if ((!existing.name || existing.name === "Guest") && input.name) patch.name = input.name;
    if (Object.keys(patch).length) {
      patch.updatedAt = now();
      return db.update(contacts).set(patch).where(eq(contacts.id, existing.id)).returning().get();
    }
    return existing;
  }

  return db
    .insert(contacts)
    .values({
      name: input.name,
      email,
      phone: input.phone ?? null,
      city: input.city ?? null,
      country: input.country ?? null,
      locale: input.locale ?? null,
      igHandle: input.igHandle ?? null
    })
    .returning()
    .get();
}

/** The contact's most recent still-open lead, if any (dedup + stitch target). */
function openLeadForContact(contactId: string): Lead | undefined {
  return db
    .select()
    .from(leads)
    .where(and(eq(leads.contactId, contactId), inArray(leads.stage, [...OPEN_LEAD_STAGES])))
    .orderBy(desc(leads.createdAt))
    .get();
}

export function logActivity(
  leadId: string,
  type: ActivityType,
  body?: string | null,
  author?: string | null,
  meta?: Record<string, unknown> | null
): LeadActivity {
  return db
    .insert(leadActivities)
    .values({ leadId, type, body: body ?? null, author: author ?? null, meta: meta ?? null })
    .returning()
    .get();
}

export function getActivities(leadId: string): LeadActivity[] {
  return db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, leadId))
    .orderBy(desc(leadActivities.createdAt))
    .all();
}

export async function createLead(input: LeadCreateInput): Promise<LeadDetail> {
  const contact = findOrCreateContact(input);

  // Dedup: if this contact already has an OPEN lead, fold the new inquiry into
  // it instead of minting a second lead that a *different* coordinator would
  // chase (double form-submit, or web-form after webchat). Keeps one patient →
  // one owner, and does NOT consume a round-robin slot.
  const existingOpen = openLeadForContact(contact.id);
  if (existingOpen) {
    const set: Partial<Lead> = { updatedAt: now() };
    if (input.service && !existingOpen.service) set.service = input.service;
    if (input.owner && input.owner !== existingOpen.owner) set.owner = input.owner; // explicit reassign wins
    db.update(leads).set(set).where(eq(leads.id, existingOpen.id)).run();

    const via = input.refCode ? `${input.source} · ${input.refCode}` : input.source;
    logActivity(existingOpen.id, "system", `Repeat inquiry via ${via}, merged into this open lead`, "system");
    if (input.message) logActivity(existingOpen.id, "note", input.message, contact.name);

    // Also link any conversation that already exists for this contact.
    const conv = newestConversationForContact(contact.id);
    if (conv) stitchConversationToLead(contact, conv);

    return (await getLead(existingOpen.id))!;
  }

  const market = marketSignal(contact.city);
  const { score, factors } = scoreLead({
    source: input.source,
    service: input.service,
    valueEstimate: input.valueEstimate ?? null,
    contact,
    market
  });

  // Round-robin routing: unowned intake rotates across the active members who
  // hold the intake role. An explicitly passed owner always wins. Rotation is
  // an enhancement, it must NEVER block lead creation (e.g. a database that
  // hasn't run the team_members migration yet), so failures degrade to
  // "unassigned" with a logged error.
  let owner = input.owner ?? null;
  let assigned: TeamMember | null = null;
  if (!owner) {
    try {
      assigned = nextAssignee(INTAKE_ROLE);
      owner = assigned?.name ?? null;
    } catch (err) {
      console.error("[leads] round-robin assignment failed:", err);
    }
  }

  const lead = db
    .insert(leads)
    .values({
      contactId: contact.id,
      refCode: input.refCode ?? null,
      affiliateId: input.affiliateId ?? null,
      service: input.service ?? null,
      source: input.source,
      stage: "new",
      score,
      valueEstimate: input.valueEstimate ?? null,
      owner,
      sourceDetail: input.sourceDetail ?? null
    })
    .returning()
    .get();

  const via = input.refCode ? `${input.source} · ${input.refCode}` : input.source;
  logActivity(lead.id, "system", `Lead created via ${via}`, input.owner ?? "system");
  if (assigned) {
    logActivity(
      lead.id,
      "system",
      `Assigned to ${assigned.name} (round-robin · ${assigned.role})`,
      "system",
      { teamMemberId: assigned.id }
    );
  }
  if (input.message) logActivity(lead.id, "note", input.message, contact.name);
  logActivity(lead.id, "score", `Scored ${score}/100`, "system", { factors });

  // Conversation-first ordering: if the contact already has a thread (they
  // messaged before this lead existed), link it now rather than waiting for
  // their next message. stitch targets the newest open lead, the one above.
  const conv = newestConversationForContact(contact.id);
  if (conv) stitchConversationToLead(contact, conv);

  return { ...lead, contact, activities: getActivities(lead.id) };
}

/** Newest conversation for a contact across all channels (stitch target). */
function newestConversationForContact(contactId: string): Conversation | undefined {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.contactId, contactId))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.createdAt))
    .get();
}

export async function listLeads(opts: { stage?: LeadStage } = {}): Promise<LeadWithContact[]> {
  const base = db
    .select()
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id));
  const filtered = opts.stage ? base.where(eq(leads.stage, opts.stage)) : base;
  const rows = filtered.orderBy(desc(leads.updatedAt)).all();
  return rows.map((r) => ({ ...r.leads, contact: r.contacts }));
}

export async function getLead(id: string): Promise<LeadDetail | null> {
  const row = db
    .select()
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(eq(leads.id, id))
    .get();
  if (!row) return null;
  return { ...row.leads, contact: row.contacts, activities: getActivities(id) };
}

export async function updateLead(
  id: string,
  patch: LeadUpdateInput,
  author = "staff"
): Promise<LeadDetail | null> {
  const before = db.select().from(leads).where(eq(leads.id, id)).get();
  if (!before) return null;

  const set: Partial<Lead> = { updatedAt: now() };
  if (patch.stage !== undefined) set.stage = patch.stage;
  if (patch.score !== undefined) set.score = patch.score;
  if (patch.service !== undefined) set.service = patch.service;
  if (patch.valueEstimate !== undefined) set.valueEstimate = patch.valueEstimate;
  if (patch.owner !== undefined) set.owner = patch.owner;
  if (patch.notes !== undefined) set.notes = patch.notes;
  if (patch.lostReason !== undefined) set.lostReason = patch.lostReason;

  db.update(leads).set(set).where(eq(leads.id, id)).run();

  if (patch.stage && patch.stage !== before.stage) {
    logActivity(id, "stage_change", `${before.stage} → ${patch.stage}`, author);
  }
  return getLead(id);
}

/** Convenience used by the kanban drag-drop. */
export async function changeStage(id: string, stage: LeadStage, author = "staff") {
  return updateLead(id, { stage }, author);
}

/**
 * Phone-stitching: attach an inbound conversation to the contact's most recent
 * OPEN lead. This is what closes the loop for the WhatsApp form, the visitor
 * leaves their number on the site (lead created, source "whatsapp"), and when
 * they actually message on WhatsApp later, the webhook resolves them to the
 * same contact (fuzzy phone match in the inbox) and this links the thread to
 * the waiting lead instead of spawning a parallel one.
 *
 * Idempotent: the link activity is written once per lead+conversation pair.
 * Also hands the thread to the lead's owner so the inbox and funnel agree.
 */
export function stitchConversationToLead(
  contact: Contact,
  conversation: Conversation
): Lead | null {
  const open = db
    .select()
    .from(leads)
    .where(
      and(
        eq(leads.contactId, contact.id),
        inArray(leads.stage, [...OPEN_LEAD_STAGES])
      )
    )
    .orderBy(desc(leads.createdAt))
    .get();
  if (!open) return null;

  const already = db
    .select()
    .from(leadActivities)
    .where(
      and(
        eq(leadActivities.leadId, open.id),
        sql`json_extract(${leadActivities.meta}, '$.conversationId') = ${conversation.id}`
      )
    )
    .get();
  if (already) return open;

  logActivity(
    open.id,
    "message",
    `Contact replied on ${conversation.channel}, conversation linked`,
    "system",
    { conversationId: conversation.id, channel: conversation.channel }
  );
  if (open.owner && !conversation.assignee) {
    db.update(conversations)
      .set({ assignee: open.owner, updatedAt: now() })
      .where(eq(conversations.id, conversation.id))
      .run();
  }
  return open;
}

export async function recomputeScore(id: string): Promise<LeadDetail | null> {
  const lead = await getLead(id);
  if (!lead) return null;
  const market = marketSignal(lead.contact?.city);
  const { score, factors } = scoreLead({
    source: lead.source,
    service: lead.service,
    valueEstimate: lead.valueEstimate,
    contact: lead.contact,
    market
  });
  db.update(leads).set({ score, updatedAt: now() }).where(eq(leads.id, id)).run();
  logActivity(id, "score", `Rescored ${score}/100`, "system", { factors });
  return getLead(id);
}

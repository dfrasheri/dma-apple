/**
 * Unified inbox service, the Chatwoot-style hub. Inbound messages from any
 * channel land here via `recordInbound`; staff/bot replies go out via
 * `sendMessage` (which enforces the 24h window through the messaging connector);
 * `draftForConversation` asks the bot for a suggested reply without sending.
 */
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  contacts,
  conversations,
  messages,
  type Contact,
  type Conversation,
  type Message
} from "@/db/schema";
import { draftReply, type BotDraft } from "../bot";
import {
  sendOutbound as channelSend,
  sendPrivateReply,
  type SendResult
} from "../connectors/messaging";
import { phonesMatch } from "../phone";
import type { ConversationUpdateInput, InboundMessageInput } from "../schemas";
import type { Channel } from "../types";

const now = () => new Date();
const normEmail = (e?: string | null) => (e && e.trim() ? e.trim().toLowerCase() : null);

export type ConversationWithContact = Conversation & {
  contact: Contact | null;
  lastMessage?: Message | null;
};
export type ConversationDetail = Conversation & {
  contact: Contact | null;
  messages: Message[];
};

/**
 * Find-or-create the contact behind an inbound event, then BACKFILL any
 * identifier this event newly carries (a WhatsApp thread later gives an email,
 * an IG handle later gives a phone…). Backfilling is what actually unifies a
 * person across channels over time, without it, a contact created from one
 * channel never becomes matchable by an identifier seen only on another.
 */
function ensureContact(input: {
  channel: Channel;
  handle?: string;
  name?: string;
  email?: string;
  phone?: string;
}): Contact {
  const email = normEmail(input.email);
  const handle = input.handle?.trim() || null;
  const phone = input.phone?.trim() || null;

  // Look across ALL provided identifiers, not just the first that's set.
  let c: Contact | undefined;
  if (email) c = db.select().from(contacts).where(eq(contacts.email, email)).get();
  if (!c && handle)
    c = db.select().from(contacts).where(eq(contacts.igHandle, handle)).get();
  if (!c && phone) {
    // Exact fast path, then fuzzy: the WhatsApp webhook's "+355677033332" must
    // resolve to the contact who typed "067 703 3332" into the site form.
    c = db.select().from(contacts).where(eq(contacts.phone, phone)).get();
    if (!c) {
      c = db
        .select()
        .from(contacts)
        .where(isNotNull(contacts.phone))
        .all()
        .find((row) => phonesMatch(row.phone, phone));
    }
  }

  if (c) {
    // Backfill only missing fields, never overwrite an existing identifier.
    const patch: Partial<Contact> = {};
    if (email && !c.email) patch.email = email;
    if (handle && !c.igHandle) patch.igHandle = handle;
    if (phone && !c.phone) patch.phone = phone;
    if ((!c.name || c.name === "Guest") && (input.name || handle))
      patch.name = input.name || handle!;
    if (Object.keys(patch).length) {
      patch.updatedAt = now();
      return db.update(contacts).set(patch).where(eq(contacts.id, c.id)).returning().get();
    }
    return c;
  }

  return db
    .insert(contacts)
    .values({
      name: input.name || handle || "Guest",
      email,
      phone,
      igHandle: handle
    })
    .returning()
    .get();
}

function ensureConversation(input: {
  channel: Channel;
  externalId?: string | null;
  contactId: string;
}): Conversation {
  let conv: Conversation | undefined;
  if (input.externalId) {
    conv = db
      .select()
      .from(conversations)
      .where(and(eq(conversations.channel, input.channel), eq(conversations.externalId, input.externalId)))
      .get();
  }
  if (!conv) {
    conv = db
      .select()
      .from(conversations)
      .where(and(eq(conversations.channel, input.channel), eq(conversations.contactId, input.contactId)))
      .get();
  }
  if (conv) return conv;

  return db
    .insert(conversations)
    .values({
      channel: input.channel,
      externalId: input.externalId ?? null,
      contactId: input.contactId,
      status: "open",
      botEnabled: true
    })
    .returning()
    .get();
}

export async function recordInbound(
  input: InboundMessageInput & { providerMessageId?: string; meta?: Record<string, unknown> }
): Promise<{ conversation: Conversation; message: Message; contact: Contact; duplicate?: boolean }> {
  const contact = ensureContact({
    channel: input.channel,
    handle: input.contact?.handle,
    name: input.contact?.name,
    email: input.contact?.email,
    phone: input.contact?.phone
  });
  const conv = ensureConversation({
    channel: input.channel,
    externalId: input.externalId,
    contactId: contact.id
  });

  // Meta retries webhooks on timeout, the same message id arrives twice.
  // If we've already stored this provider message id, don't double-insert.
  // (Real Meta traffic always carries `mid`/`id`, so this is the live path.)
  if (input.providerMessageId) {
    const existing = db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conv.id),
          sql`json_extract(${messages.meta}, '$.providerMessageId') = ${input.providerMessageId}`
        )
      )
      .get();
    if (existing) return { conversation: conv, message: existing, contact, duplicate: true };
  } else {
    // No provider id (dev simulator, or a channel that omits one): guard against
    // a rapid identical resend (double-tap / retry). Compared in JS so we don't
    // depend on the timestamp column's storage type. Only an identical body
    // within a few seconds counts, distinct messages are never dropped.
    const last = db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.conversationId, conv.id),
          eq(messages.direction, "in"),
          eq(messages.author, "contact")
        )
      )
      .orderBy(desc(messages.createdAt))
      .limit(1)
      .get();
    if (last && last.body === input.body && Date.now() - new Date(last.createdAt).getTime() < 5000) {
      return { conversation: conv, message: last, contact, duplicate: true };
    }
  }

  const inMeta = {
    ...(input.meta ?? {}),
    ...(input.providerMessageId ? { providerMessageId: input.providerMessageId } : {})
  };
  const message = db
    .insert(messages)
    .values({
      conversationId: conv.id,
      direction: "in",
      author: "contact",
      body: input.body,
      channel: input.channel,
      meta: Object.keys(inMeta).length ? inMeta : null
    })
    .returning()
    .get();

  db.update(conversations)
    .set({
      lastInboundAt: now(),
      lastMessageAt: now(),
      unread: true,
      status: conv.status === "closed" ? "open" : conv.status,
      updatedAt: now()
    })
    .where(eq(conversations.id, conv.id))
    .run();

  return { conversation: conv, message, contact };
}

/**
 * Ensure the contact + conversation for an event WITHOUT recording a message.
 * Used by the trigger engine to dedup against the conversation that a signal
 * would actually land in, which may have been resolved by the contactId
 * fallback, not just by externalId.
 */
export async function resolveConversation(input: {
  channel: Channel;
  externalId?: string | null;
  contact?: { name?: string; handle?: string; email?: string; phone?: string };
}): Promise<{ conversation: Conversation; contact: Contact }> {
  const contact = ensureContact({
    channel: input.channel,
    handle: input.contact?.handle,
    name: input.contact?.name,
    email: input.contact?.email,
    phone: input.contact?.phone
  });
  const conversation = ensureConversation({
    channel: input.channel,
    externalId: input.externalId,
    contactId: contact.id
  });
  return { conversation, contact };
}

export async function sendMessage(input: {
  conversationId: string;
  body: string;
  author: "agent" | "bot";
  meta?: Record<string, unknown>;
  /** Set to a comment id to deliver as a Meta private reply instead of a DM. */
  privateReplyTo?: string;
}): Promise<{ message: Message; sendResult: SendResult } | null> {
  const conv = db.select().from(conversations).where(eq(conversations.id, input.conversationId)).get();
  if (!conv) return null;

  const sendResult = input.privateReplyTo
    ? await sendPrivateReply(conv.channel, input.privateReplyTo, input.body)
    : await channelSend(conv.channel, conv.externalId, input.body, {
        lastInboundAt: conv.lastInboundAt
      });

  const message = db
    .insert(messages)
    .values({
      conversationId: conv.id,
      direction: "out",
      author: input.author,
      body: input.body,
      channel: conv.channel,
      meta: { ...input.meta, requiresTemplate: sendResult.requiresTemplate }
    })
    .returning()
    .get();

  db.update(conversations)
    .set({ lastMessageAt: now(), unread: false, updatedAt: now() })
    .where(eq(conversations.id, conv.id))
    .run();

  return { message, sendResult };
}

/**
 * Record a bot reply that was ALREADY delivered by the caller's own transport
 * (the website chat returns the reply in the HTTP response), so no channel
 * send happens here — this only persists the outbound turn for the inbox and
 * analytics. `markRead: false` keeps the staff unread flag (handoffs).
 */
export async function recordBotReplyLocal(input: {
  conversationId: string;
  body: string;
  meta?: Record<string, unknown>;
  markRead?: boolean;
}): Promise<Message | null> {
  const conv = db.select().from(conversations).where(eq(conversations.id, input.conversationId)).get();
  if (!conv) return null;
  const message = db
    .insert(messages)
    .values({
      conversationId: conv.id,
      direction: "out",
      author: "bot",
      body: input.body,
      channel: conv.channel,
      meta: input.meta ?? null
    })
    .returning()
    .get();
  db.update(conversations)
    .set({
      lastMessageAt: now(),
      updatedAt: now(),
      ...(input.markRead === false ? {} : { unread: false })
    })
    .where(eq(conversations.id, conv.id))
    .run();
  return message;
}

export async function draftForConversation(conversationId: string): Promise<BotDraft | null> {
  const detail = await getConversation(conversationId);
  if (!detail) return null;
  const lastInbound = [...detail.messages].reverse().find((m) => m.direction === "in");
  return draftReply(lastInbound?.body ?? "", { contactName: detail.contact?.name });
}

export async function listConversations(
  opts: { status?: Conversation["status"]; channel?: Channel } = {}
): Promise<ConversationWithContact[]> {
  const conds = [];
  if (opts.status) conds.push(eq(conversations.status, opts.status));
  if (opts.channel) conds.push(eq(conversations.channel, opts.channel));
  const base = db
    .select()
    .from(conversations)
    .leftJoin(contacts, eq(conversations.contactId, contacts.id));
  const filtered = conds.length ? base.where(and(...conds)) : base;
  const rows = filtered
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.createdAt))
    .all();
  const convs = rows.map((r) => ({ ...r.conversations, contact: r.contacts }));

  const ids = convs.map((c) => c.id);
  const msgs = ids.length
    ? db.select().from(messages).where(inArray(messages.conversationId, ids)).orderBy(desc(messages.createdAt)).all()
    : [];
  const lastByConv = new Map<string, Message>();
  for (const m of msgs) if (!lastByConv.has(m.conversationId)) lastByConv.set(m.conversationId, m);

  return convs.map((c) => ({ ...c, lastMessage: lastByConv.get(c.id) ?? null }));
}

export async function getConversation(id: string): Promise<ConversationDetail | null> {
  const row = db
    .select()
    .from(conversations)
    .leftJoin(contacts, eq(conversations.contactId, contacts.id))
    .where(eq(conversations.id, id))
    .get();
  if (!row) return null;
  const msgs = db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt)
    .all();
  return { ...row.conversations, contact: row.contacts, messages: msgs };
}

export async function updateConversation(
  id: string,
  patch: ConversationUpdateInput
): Promise<ConversationDetail | null> {
  const set: Partial<Conversation> = { updatedAt: now() };
  if (patch.status !== undefined) set.status = patch.status;
  if (patch.assignee !== undefined) set.assignee = patch.assignee;
  if (patch.botEnabled !== undefined) set.botEnabled = patch.botEnabled;
  db.update(conversations).set(set).where(eq(conversations.id, id)).run();
  return getConversation(id);
}

export async function markRead(id: string) {
  db.update(conversations).set({ unread: false, updatedAt: now() }).where(eq(conversations.id, id)).run();
}

/**
 * Record a non-message engagement signal (follow, like, ad click, comment…)
 * as a `system` line in the conversation, the same grey "messaged you
 * because you followed" line Instagram itself shows. Ensures contact and
 * conversation exist WITHOUT inserting an inbound message, so it never
 * opens Meta's 24h reply window by itself (unless `opensWindow` is set, ad
 * clicks / Get Started / opt-ins DO open the window per Meta policy).
 */
export async function recordSignal(input: {
  channel: Channel;
  externalId?: string | null;
  reason: string;
  contact?: { name?: string; handle?: string; email?: string; phone?: string };
  meta?: Record<string, unknown>;
  opensWindow?: boolean;
}): Promise<{ conversation: Conversation; contact: Contact; message: Message }> {
  const contact = ensureContact({
    channel: input.channel,
    handle: input.contact?.handle,
    name: input.contact?.name,
    email: input.contact?.email,
    phone: input.contact?.phone
  });
  const conv = ensureConversation({
    channel: input.channel,
    externalId: input.externalId,
    contactId: contact.id
  });
  const message = db
    .insert(messages)
    .values({
      conversationId: conv.id,
      direction: "in",
      author: "system",
      body: input.reason,
      channel: input.channel,
      meta: input.meta ?? null
    })
    .returning()
    .get();
  db.update(conversations)
    .set({
      lastMessageAt: now(),
      updatedAt: now(), ...(input.opensWindow ? { lastInboundAt: now() } : {})
    })
    .where(eq(conversations.id, conv.id))
    .run();
  return { conversation: conv, contact, message };
}

/**
 * Bot handoff: keep the conversation visibly waiting for a human, `pending`
 * and unread, even though the bot already sent a holding reply.
 */
export async function flagForHuman(id: string) {
  db.update(conversations)
    .set({ status: "pending", unread: true, updatedAt: now() })
    .where(eq(conversations.id, id))
    .run();
}

/**
 * Recent dialogue turns for the bot's multi-turn context, chronological,
 * excluding the just-recorded inbound message and the grey `system` signal
 * lines (follows/likes/ad markers are not conversation). Each body is capped so
 * a long paste can't blow the prompt budget.
 */
export function recentTurns(
  conversationId: string,
  opts: { excludeId?: string; limit?: number } = {}
): { role: "user" | "assistant"; content: string }[] {
  const limit = opts.limit ?? 8;
  const rows = db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt)
    .all();
  const turns = rows
    .filter((m) => m.id !== opts.excludeId && m.author !== "system" && (m.body ?? "").trim())
    .map((m) => ({
      role: (m.author === "contact" ? "user" : "assistant") as "user" | "assistant",
      content: (m.body ?? "").slice(0, 600)
    }));
  return turns.slice(-limit);
}

/** Look a conversation up by its channel-native id (PSID / IGSID / wa_id). */
export async function getConversationByExternalId(
  channel: Channel,
  externalId: string
): Promise<ConversationDetail | null> {
  const conv = db
    .select()
    .from(conversations)
    .where(and(eq(conversations.channel, channel), eq(conversations.externalId, externalId)))
    .get();
  return conv ? getConversation(conv.id) : null;
}

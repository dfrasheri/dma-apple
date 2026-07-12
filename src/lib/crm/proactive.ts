/**
 * Proactive trigger engine, the "reactivity" layer: someone clicks a
 * click-to-Messenger/Instagram ad, comments on a post, taps Get Started or
 * opts in, and the bot reaches out FIRST, with the reason recorded in the
 * thread the way Instagram shows "messaged you because you followed their
 * account".
 *
 * Every trigger records a `system` reason line in the conversation, then sends
 * an opener ONLY through a Meta-permitted path:
 *
 *   kind          entry point                        delivery
 *   ───────────── ────────────────────────────────── ─────────────────────────
 *   ad_referral   messaging_referrals webhook        direct DM (thread is open)
 *   postback      Get Started button                 direct DM
 *   optin         checkbox / notification opt-in     direct DM
 *   comment       feed/comments webhook              PRIVATE REPLY (1 per comment)
 *   follow        (no public API webhook yet*)       DM only if a conversation
 *   page_like     Page feed webhook                  window is already open -
 *   post_like     feed "reaction" webhook            otherwise recorded as a
 *                                                    signal + flagged for staff
 *
 * *Follow-triggered DMs are not in Meta's public API (limited beta only, and
 *  no third-party tool has it either), enable Instagram's native "welcome
 *  message" in the app for that. The trigger kind is wired here so the day
 *  Meta ships the webhook, only the parser needs a line.
 *
 * Signals that can't legally be messaged are NEVER silently dropped: they land
 * in the inbox as pending + unread with the contact attached, so staff can
 * reply from the post/comment side or invite the person manually.
 */
import { within24hWindow } from "./connectors/messaging";
import * as inbox from "./services/inbox";
import type { Channel } from "./types";
import type { Contact, Conversation, Message } from "@/db/schema";

export const TRIGGER_KINDS = [
  "follow",
  "page_like",
  "post_like",
  "comment",
  "ad_referral",
  "postback",
  "optin"
] as const;
export type TriggerKind = (typeof TRIGGER_KINDS)[number];

export type TriggerEvent = {
  channel: Channel;
  kind: TriggerKind;
  /** Channel-native user id (PSID/IGSID) when Meta provides it. */
  externalId?: string;
  contact?: { name?: string; handle?: string };
  context?: {
    adId?: string;
    adTitle?: string;
    postId?: string;
    commentId?: string;
    commentText?: string;
    /** m.me ref param or postback payload. */
    ref?: string;
  };
};

/** The grey reason line shown in the thread (mirrors Instagram's own UX). */
function reasonLine(ev: TriggerEvent): string {
  switch (ev.kind) {
    case "follow":
      return "Followed the account, welcome flow triggered.";
    case "page_like":
      return "Liked / followed the page, welcome flow triggered.";
    case "post_like":
      return `Liked a post${ev.context?.postId ? ` (${ev.context.postId})` : ""}, engagement flow triggered.`;
    case "comment":
      return `Commented${ev.context?.commentText ? `: “${ev.context.commentText.slice(0, 120)}”` : " on a post"}, private reply sent.`;
    case "ad_referral":
      return `Opened this chat through an ad${ev.context?.adTitle ? ` (“${ev.context.adTitle}”)` : ev.context?.adId ? ` (${ev.context.adId})` : ""}.`;
    case "postback":
      return "Tapped Get Started.";
    case "optin":
      return "Opted in to messages.";
  }
}

/** Opener templates, edit freely; the engine fills the first name when known. */
const OPENERS: Record<TriggerKind, (name: string) => string> = {
  follow: (n) =>
    `Hi${n}! Thanks for the follow, welcome to Dental Med Austria 🦷 Curious about a treatment, our quality standards, or planning a visit from abroad? Just ask.`,
  page_like: (n) =>
    `Hi${n}! Thanks for the follow, welcome to Dental Med Austria 🦷 Ask us anything about treatments, pricing or planning your visit.`,
  post_like: (n) =>
    `Hi${n}! Glad our post caught your eye 🦷 Want details on that treatment, or a free treatment plan? Just reply here.`,
  comment: (n) =>
    `Hi${n}! Thanks for your comment, happy to continue here in private. What would you like to know: treatment details, pricing, or planning a visit?`,
  ad_referral: (n) =>
    `Hi${n}! Thanks for reaching out 🙌 You're chatting with Dental Med Austria, tell us what you're interested in (a treatment, pricing, or a free treatment plan) and we'll take it from there.`,
  postback: (n) =>
    `Welcome${n}! You're chatting with Dental Med Austria 🦷 How can we help, a treatment, pricing, or planning your visit?`,
  optin: (n) =>
    `Thanks for opting in${n}! We'll keep you posted, and you can ask us anything about treatments or your visit right here.`
};

/** Trigger kinds whose entry point legally opens a direct-DM path. */
const DIRECT_DM_KINDS: readonly TriggerKind[] = ["ad_referral", "postback", "optin"];

export type TriggerResult = {
  conversation: Conversation;
  contact: Contact;
  signal: Message;
  opener: Message | null;
  /** Why no opener was sent, when it wasn't. */
  skipped?: string;
};

function firstName(ev: TriggerEvent): string {
  const n = ev.contact?.name?.trim().split(/\s+/)[0];
  return n ? ` ${n}` : "";
}

/** Stable identity for a trigger occurrence, used to swallow webhook retries. */
function dedupKey(ev: TriggerEvent): string | null {
  if (ev.context?.commentId) return `comment:${ev.context.commentId}`;
  if (ev.kind === "ad_referral" && ev.externalId)
    return `ad:${ev.context?.adId ?? "?"}:${ev.externalId}`;
  if (ev.kind === "post_like" && ev.externalId && ev.context?.postId)
    return `like:${ev.context.postId}:${ev.externalId}`;
  if ((ev.kind === "follow" || ev.kind === "page_like") && ev.externalId)
    return `${ev.kind}:${ev.externalId}`;
  return null;
}

export async function handleTrigger(ev: TriggerEvent): Promise<TriggerResult | null> {
  const key = dedupKey(ev);

  // Webhook deliveries retry; a person likes-then-unlikes-then-likes. One
  // opener per occurrence: resolve the conversation this signal WOULD land in
  // (by externalId OR the contactId fallback) and skip if we already fired.
  if (key) {
    const { conversation: existing } = await inbox.resolveConversation({
      channel: ev.channel,
      externalId: ev.externalId,
      contact: ev.contact
    });
    const detail = await inbox.getConversation(existing.id);
    if (
      detail?.messages.some(
        (m) => (m.meta as { triggerKey?: string } | null)?.triggerKey === key
      )
    ) {
      return null;
    }
  }

  const { conversation, contact, message: signal } = await inbox.recordSignal({
    channel: ev.channel,
    externalId: ev.externalId,
    reason: reasonLine(ev),
    contact: ev.contact,
    // Meta counts ad clicks / Get Started / opt-ins as opening the 24h window.
    opensWindow: DIRECT_DM_KINDS.includes(ev.kind),
    meta: {
      trigger: ev.kind, ...(key ? { triggerKey: key } : {}), ...(ev.context ?? {})
    }
  });

  const opener = OPENERS[ev.kind](firstName(ev));

  // 1. Comment → the one permitted private reply.
  if (ev.kind === "comment" && ev.context?.commentId) {
    const sent = await inbox.sendMessage({
      conversationId: conversation.id,
      body: opener,
      author: "bot",
      privateReplyTo: ev.context.commentId,
      meta: { trigger: ev.kind, privateReply: true }
    });
    return { conversation, contact, signal, opener: sent?.message ?? null };
  }

  // 2. Ad referral / postback / opt-in → the user opened the thread; DM away.
  if (DIRECT_DM_KINDS.includes(ev.kind)) {
    const sent = await inbox.sendMessage({
      conversationId: conversation.id,
      body: opener,
      author: "bot",
      meta: { trigger: ev.kind }
    });
    return { conversation, contact, signal, opener: sent?.message ?? null };
  }

  // 3. Follow / likes → only messageable if a conversation window is open.
  if (within24hWindow(conversation.lastInboundAt)) {
    const sent = await inbox.sendMessage({
      conversationId: conversation.id,
      body: opener,
      author: "bot",
      meta: { trigger: ev.kind }
    });
    return { conversation, contact, signal, opener: sent?.message ?? null };
  }

  // No legal path, surface the signal to staff instead of dropping it.
  await inbox.flagForHuman(conversation.id);
  return {
    conversation,
    contact,
    signal,
    opener: null,
    skipped:
      "No open messaging window, Meta only allows DMs from an ad click, comment, or user message. Signal flagged for staff."
  };
}

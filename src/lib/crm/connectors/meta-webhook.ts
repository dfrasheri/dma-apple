/**
 * Meta Graph webhook ingestion, the unifier for the three Meta channels.
 *
 * Messenger, Instagram DMs and WhatsApp Cloud API all deliver through the same
 * Graph webhook mechanism; the top-level `object` field says which product:
 *   "page"                      → Messenger      (entry[].messaging[])
 *   "instagram"                 → Instagram DMs  (entry[].messaging[])
 *   "whatsapp_business_account" → WhatsApp       (entry[].changes[].value.messages[])
 *
 * `parseMetaWebhook` normalises all three into channel-agnostic inbound events
 * plus proactive trigger events (referrals, comments, likes, opt-ins), so the
 * rest of the CRM never sees a provider-specific shape. Echo events (our own
 * outbound mirrored back) and delivery/read statuses are dropped.
 *
 * `verifyMetaSignature` checks X-Hub-Signature-256 (HMAC-SHA256 of the RAW
 * request body with the app secret), required in production so nobody can
 * inject fake messages into the inbox.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import type { TriggerEvent } from "../proactive";
import type { Channel } from "../types";

export type ParsedInboundEvent = {
  channel: Channel;
  /** Channel-native sender id: PSID / IGSID / WhatsApp phone (wa_id). */
  externalId: string;
  body: string;
  /** Provider message id (`mid` / WhatsApp id), used to dedup webhook retries. */
  providerMessageId?: string;
  contact?: { name?: string; handle?: string; phone?: string };
  /** Context line to record in the thread first (e.g. "opened via ad"). */
  signal?: { reason: string; meta?: Record<string, unknown> };
};

export type ParsedMetaWebhook = {
  messages: ParsedInboundEvent[];
  triggers: TriggerEvent[];
};

type Referral = {
  ref?: string;
  source?: string;
  type?: string;
  ad_id?: string;
  ads_context_data?: { ad_title?: string; post_id?: string };
};

type MessagingEvent = {
  sender?: { id?: string };
  message?: { mid?: string; text?: string; is_echo?: boolean; referral?: Referral };
  /** messaging_referrals, ad click / m.me link WITHOUT a typed message yet. */
  referral?: Referral;
  /** messaging_postbacks, Get Started / persistent-menu buttons. */
  postback?: { title?: string; payload?: string; referral?: Referral };
  /** messaging_optins. */
  optin?: { ref?: string; payload?: string };
};

type ChangeValue = {
  // WhatsApp (field "messages")
  messaging_product?: string;
  contacts?: { wa_id?: string; profile?: { name?: string } }[];
  messages?: { id?: string; from?: string; type?: string; text?: { body?: string } }[];
  // Facebook Page feed (field "feed")
  item?: string;
  verb?: string;
  from?: { id?: string; name?: string; username?: string };
  post_id?: string;
  comment_id?: string;
  message?: string;
  reaction_type?: string;
  // Instagram comments (field "comments") / follows (beta)
  id?: string;
  text?: string;
  media?: { id?: string };
  follower_id?: string;
};

type MetaPayload = {
  object?: string;
  entry?: {
    id?: string;
    messaging?: MessagingEvent[];
    changes?: { field?: string; value?: ChangeValue }[];
  }[];
};

/** True when the body looks like a Meta webhook (vs the dev simulator format). */
export function isMetaPayload(payload: unknown): payload is MetaPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "object" in payload &&
    "entry" in payload
  );
}

export function verifyMetaSignature(
  rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  const received = signatureHeader.slice("sha256=".length);
  if (received.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(received, "utf8"), Buffer.from(expected, "utf8"));
}

const adContext = (r: Referral) => ({
  adId: r.ad_id,
  adTitle: r.ads_context_data?.ad_title,
  postId: r.ads_context_data?.post_id,
  ref: r.ref
});

/** Messenger / Instagram `messaging` array → inbound texts + trigger events. */
function parseMessagingEvents(
  channel: Channel,
  events: MessagingEvent[] | undefined,
  out: ParsedMetaWebhook
): void {
  for (const ev of events ?? []) {
    const senderId = ev.sender?.id;
    if (!senderId) continue;

    const text = ev.message?.text;
    if (text && !ev.message?.is_echo) {
      // Ad referral attached to a typed message: the bot pipeline answers the
      // text (no extra opener), but the thread still gets the grey "opened
      // this chat through an ad" line, exactly like Instagram shows it.
      const ref = ev.message?.referral;
      out.messages.push({
        channel,
        externalId: senderId,
        body: text, ...(ev.message?.mid ? { providerMessageId: ev.message.mid } : {}), ...(ref
          ? {
              signal: {
                reason: `Opened this chat through an ad${ref.ads_context_data?.ad_title ? ` (“${ref.ads_context_data.ad_title}”)` : ref.ad_id ? ` (${ref.ad_id})` : ""}.`,
                meta: { trigger: "ad_referral", ...adContext(ref) }
              }
            }
          : {})
      });
      continue;
    }

    // messaging_referrals: clicked a CTM/CTI ad or m.me link, no message yet →
    // this is the "You opened this chat through an ad" moment. Reach out.
    if (ev.referral) {
      out.triggers.push({
        channel,
        kind: "ad_referral",
        externalId: senderId,
        context: adContext(ev.referral)
      });
      continue;
    }

    if (ev.postback) {
      out.triggers.push({
        channel,
        kind: "postback",
        externalId: senderId,
        context: { ref: ev.postback.payload ?? ev.postback.title }
      });
      continue;
    }

    if (ev.optin) {
      out.triggers.push({
        channel,
        kind: "optin",
        externalId: senderId,
        context: { ref: ev.optin.payload ?? ev.optin.ref }
      });
    }
  }
}

/** Facebook Page `feed` changes → comment / like / reaction triggers. */
function parsePageFeedChange(
  pageId: string | undefined,
  value: ChangeValue,
  out: ParsedMetaWebhook
): void {
  if (value.verb !== "add" || !value.from?.id) return;
  // Ignore the page acting on its own content.
  if (pageId && value.from.id === pageId) return;

  if (value.item === "comment" && value.comment_id) {
    out.triggers.push({
      channel: "messenger",
      kind: "comment",
      externalId: value.from.id,
      contact: { name: value.from.name },
      context: {
        commentId: value.comment_id,
        commentText: value.message,
        postId: value.post_id
      }
    });
    return;
  }

  if (value.item === "like" || value.item === "reaction") {
    out.triggers.push({
      channel: "messenger",
      kind: "post_like",
      externalId: value.from.id,
      contact: { name: value.from.name },
      context: { postId: value.post_id }
    });
  }
}

/** Instagram `changes` → comment triggers (+ follow, wired for Meta's beta). */
function parseInstagramChange(
  field: string | undefined,
  value: ChangeValue,
  out: ParsedMetaWebhook
): void {
  if (field === "comments" && value.id && value.from?.id) {
    out.triggers.push({
      channel: "instagram",
      kind: "comment",
      externalId: value.from.id,
      contact: { name: value.from.username, handle: value.from.username },
      context: {
        commentId: value.id,
        commentText: value.text,
        postId: value.media?.id
      }
    });
    return;
  }

  // Not in the public API yet (limited beta), parsed so it lights up the day
  // Meta ships it. Until then Instagram's native welcome message covers follows.
  if (field === "follows") {
    const followerId = value.follower_id ?? value.from?.id;
    if (!followerId) return;
    out.triggers.push({
      channel: "instagram",
      kind: "follow",
      externalId: followerId,
      contact: { name: value.from?.username, handle: value.from?.username }
    });
  }
}

function parseWhatsAppChange(value: ChangeValue | undefined, out: ParsedMetaWebhook): void {
  if (value?.messaging_product !== "whatsapp") return;
  for (const msg of value.messages ?? []) {
    // Non-text types (media, reactions, statuses) are skipped for now.
    if (msg.type !== "text" || !msg.text?.body || !msg.from) continue;
    const profile = value.contacts?.find((c) => c.wa_id === msg.from);
    out.messages.push({
      channel: "whatsapp",
      externalId: msg.from,
      body: msg.text.body, ...(msg.id ? { providerMessageId: msg.id } : {}),
      contact: { name: profile?.profile?.name, phone: `+${msg.from}` }
    });
  }
}

export function parseMetaWebhook(payload: MetaPayload): ParsedMetaWebhook {
  const out: ParsedMetaWebhook = { messages: [], triggers: [] };
  for (const entry of payload.entry ?? []) {
    switch (payload.object) {
      case "page":
        parseMessagingEvents("messenger", entry.messaging, out);
        for (const change of entry.changes ?? []) {
          if (change.field === "feed" && change.value)
            parsePageFeedChange(entry.id, change.value, out);
        }
        break;
      case "instagram":
        parseMessagingEvents("instagram", entry.messaging, out);
        for (const change of entry.changes ?? []) {
          if (change.value) parseInstagramChange(change.field, change.value, out);
        }
        break;
      case "whatsapp_business_account":
        for (const change of entry.changes ?? []) {
          parseWhatsAppChange(change.value, out);
        }
        break;
    }
  }
  return out;
}

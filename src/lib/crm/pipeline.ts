/**
 * The ONE inbound pipeline every Meta channel funnels through, WhatsApp,
 * Messenger, Instagram (all via Meta webhooks):
 *
 *   handleInbound()
 *     → inbox.recordInbound()          store message, upsert contact/conversation
 *     → bot.draftReply()               same grounded brain the website uses
 *     → inbox.sendMessage(author:bot)  reply through the channel connector
 *     → on handoff: flagForHuman()     bot sent a holding line; humans take over
 *
 * The bot's holding drafts ("let me confirm with the team…") are written to be
 * sendable, so on handoff we still reply, nobody gets silence on WhatsApp -
 * but the conversation goes `pending` + unread for staff.
 *
 * Channels differ ONLY in transport (webhook parsing in, connector out); any
 * behaviour change made here applies to all of them at once.
 */
import { draftReply, type BotDraft } from "./bot";
import type { SendResult } from "./connectors/messaging";
import type { InboundMessageInput } from "./schemas";
import * as inbox from "./services/inbox";
import { stitchConversationToLead } from "./services/leads";
import { detectLangFromContext } from "@/lib/chat-i18n";
import type { Contact, Conversation, Message } from "@/db/schema";

export type InboundResult = {
  conversation: Conversation;
  contact: Contact;
  message: Message;
  /** Null when the bot is switched off for this conversation. */
  bot: {
    draft: BotDraft;
    message: Message | null;
    sendResult: SendResult | null;
  } | null;
};

export async function handleInbound(
  input: InboundMessageInput & { providerMessageId?: string; meta?: Record<string, unknown> }
): Promise<InboundResult> {
  // Language of the inbound text itself, persisted on the inbound message so
  // analytics can read language per message across every channel (parity with
  // the webchat's meta.lang). The contact isn't resolved yet at this point, so
  // no locale hint here; the contact-locale-aware resolution happens in the
  // bot draft below and lands on the bot reply's meta.lang.
  const lang = detectLangFromContext(input.body, []);
  const { conversation, message, contact, duplicate } = await inbox.recordInbound({
    ...input,
    meta: { ...(input.meta ?? {}), lang }
  });

  // Webhook retry of a message we already stored: don't draft/send a second reply.
  if (duplicate) return { conversation, contact, message, bot: null };

  // Phone-stitching: if this contact has an open lead (e.g. from the WhatsApp
  // form or the webchat), link this thread to it and hand it to the lead owner.
  // Best-effort, a stitching failure must never break inbound handling.
  try {
    stitchConversationToLead(contact, conversation);
  } catch (err) {
    console.error("[pipeline] lead stitching failed:", err);
  }

  if (!conversation.botEnabled) {
    await inbox.flagForHuman(conversation.id);
    return { conversation, contact, message, bot: null };
  }

  // Prior turns in this thread (excludes the message we just recorded) so the
  // bot answers follow-ups ("yes", "how much for that one?") with context.
  const history = inbox.recentTurns(conversation.id, { excludeId: message.id, limit: 8 });
  const draft = await draftReply(input.body, {
    contactName: contact.name,
    history,
    // Known contact locale (e.g. from a lead) so a short "ok"/"po" from a
    // German-speaking patient is answered in German, not English.
    localeHint: contact.locale ?? undefined,
    imageReceived: input.meta?.imageReceived === true
  });
  const sent = await inbox.sendMessage({
    conversationId: conversation.id,
    body: draft.text,
    author: "bot",
    meta: {
      intent: draft.intent,
      lang: draft.lang,
      confidence: draft.confidence,
      citedFactIds: draft.citedFactIds,
      handoff: draft.handoff, ...(draft.reason ? { reason: draft.reason } : {})
    }
  });

  if (draft.handoff) await inbox.flagForHuman(conversation.id);

  return {
    conversation,
    contact,
    message,
    bot: { draft, message: sent?.message ?? null, sendResult: sent?.sendResult ?? null }
  };
}

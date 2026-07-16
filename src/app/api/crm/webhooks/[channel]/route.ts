import { NextResponse } from "next/server";
import { z } from "zod";
import { created, fail, guard } from "@/lib/crm/http";
import {
  isMetaPayload,
  parseMetaWebhook,
  verifyMetaSignature
} from "@/lib/crm/connectors/meta-webhook";
import { handleInbound } from "@/lib/crm/pipeline";
import { handleTrigger, TRIGGER_KINDS } from "@/lib/crm/proactive";
import { clientIp, isProd, rateLimitOr429 } from "@/lib/crm/security";
import * as inboxService from "@/lib/crm/services/inbox";
import { inboundMessageSchema } from "@/lib/crm/schemas";
import { CHANNELS } from "@/lib/crm/types";
import type { Channel } from "@/lib/crm/types";

export const runtime = "nodejs";

/**
 * /api/crm/webhooks/[channel], inbound events from every channel.
 *
 * Point ALL Meta products (WhatsApp Cloud API, Messenger, Instagram) at ONE
 * URL, e.g. /api/crm/webhooks/meta, the payload's `object` field determines
 * the channel, not the path segment. The path only matters for the dev
 * simulator formats below.
 *
 * GET, Meta's webhook verification handshake (hub.challenge echo).
 * POST, one of:
 *   1. a real Meta payload (signature-checked when META_APP_SECRET is set):
 *      texts run the bot pipeline; referrals/postbacks/comments/likes/follows
 *      run the proactive trigger engine;
 *   2. dev simulator message  {externalId?, body, contact?}
 *   3. dev simulator trigger  {trigger: "comment"|"ad_referral"|..., externalId?,
 *      contact?, context?}
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const expected = process.env.META_WEBHOOK_VERIFY_TOKEN?.trim();

  if (mode === "subscribe" && expected && token === expected && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }
  return fail("Webhook verification failed", 403);
}

const simulatorTriggerSchema = z.object({
  trigger: z.enum([...TRIGGER_KINDS] as [string, ...string[]]),
  externalId: z.string().optional(),
  contact: z.object({ name: z.string().optional(), handle: z.string().optional() }).optional(),
  context: z
    .object({
      adId: z.string().optional(),
      adTitle: z.string().optional(),
      postId: z.string().optional(),
      commentId: z.string().optional(),
      commentText: z.string().optional(),
      ref: z.string().optional()
    })
    .optional()
});

export const POST = guard(
  async (req, { params }) => {
    // Defense-in-depth on a public, unauthenticated endpoint: even with a valid
    // Meta signature, a leaked webhook URL / compromised credential shouldn't be
    // able to flood the DB + bot. Signature verification is the primary gate;
    // this caps burst volume per source IP (generous, real Meta traffic for a
    // clinic is well under this).
    const rl = rateLimitOr429(`webhook:${clientIp(req)}`, { limit: 240, windowMs: 60_000 });
    if (!rl.ok) return fail("Too many requests", 429, { retryAfterSec: rl.retryAfterSec });

    const { channel } = await params;
    const raw = await req.text();

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return fail("Body must be valid JSON", 422);
    }

    // ── Real Meta webhook (Messenger / Instagram / WhatsApp) ─────────────────
    if (isMetaPayload(payload)) {
      const appSecret = process.env.META_APP_SECRET?.trim();
      if (appSecret) {
        const sig = req.headers.get("x-hub-signature-256");
        if (!verifyMetaSignature(raw, sig, appSecret)) {
          return fail("Invalid webhook signature", 401);
        }
      } else if (isProd) {
        // No secret in production = anyone could forge inbound messages.
        // Refuse rather than trust an unsigned Meta-shaped payload.
        return fail("Webhook signature verification not configured", 503);
      }
      const { messages, triggers } = parseMetaWebhook(payload);
      // Meta expects a fast 200 even for event types we don't handle.
      const conversationIds: string[] = [];
      for (const ev of messages) {
        if (ev.signal) {
          await inboxService.recordSignal({
            channel: ev.channel,
            externalId: ev.externalId,
            reason: ev.signal.reason,
            contact: ev.contact,
            meta: ev.signal.meta
          });
        }
        const r = await handleInbound({
          channel: ev.channel,
          externalId: ev.externalId,
          body: ev.body,
          contact: ev.contact,
          providerMessageId: ev.providerMessageId,
          meta: ev.meta
        });
        conversationIds.push(r.conversation.id);
      }
      let openersSent = 0;
      for (const t of triggers) {
        const r = await handleTrigger(t);
        if (r) {
          conversationIds.push(r.conversation.id);
          if (r.opener) openersSent += 1;
        }
      }
      return created({
        messages: messages.length,
        triggers: triggers.length,
        openersSent,
        conversations: [...new Set(conversationIds)]
      });
    }

    // ── Dev simulator formats: channel comes from the path ───────────────────
    // These accept unsigned inbound events, so they must NEVER run in prod -
    // in production only signature-verified Meta payloads (above) are allowed.
    if (isProd) {
      return fail("Unsigned webhook payloads are not accepted in production", 403);
    }
    if (!(CHANNELS as readonly string[]).includes(channel)) {
      return fail("Unknown channel", 400);
    }

    if (typeof payload === "object" && payload !== null && "trigger" in payload) {
      const parsed = simulatorTriggerSchema.safeParse(payload);
      if (!parsed.success) return fail("Invalid trigger body", 422, parsed.error.flatten());
      const result = await handleTrigger({
        channel: channel as Channel,
        kind: parsed.data.trigger as (typeof TRIGGER_KINDS)[number],
        externalId: parsed.data.externalId,
        contact: parsed.data.contact,
        context: parsed.data.context
      });
      return created(result ?? { deduped: true });
    }

    const parsed = inboundMessageSchema.safeParse({ ...(payload as object), channel });
    if (!parsed.success) return fail("Invalid request body", 422, parsed.error.flatten());

    const result = await handleInbound(parsed.data);
    return created(result);
  },
  { public: true }
);

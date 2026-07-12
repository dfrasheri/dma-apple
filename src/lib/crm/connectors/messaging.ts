/**
 * Outbound messaging connector, one `sendOutbound` for every channel.
 *
 * Live mode (env vars set) sends through the real APIs:
 *   - messenger / instagram → Meta Graph send API  POST /me/messages
 *                             (needs META_PAGE_ACCESS_TOKEN; the IG account
 *                             must be linked to the Facebook Page)
 *   - whatsapp              → WhatsApp Business Cloud API
 *                             POST /{WHATSAPP_PHONE_NUMBER_ID}/messages
 *                             (needs WHATSAPP_ACCESS_TOKEN)
 *   - webchat               → stored in the DB (the site widget uses /api/chat,
 *                             not this path)
 *   - email                 → still mock (SMTP/provider seam)
 *
 * Without the env vars every channel behaves as a mock that records the message
 * and reports delivered, so the demo inbox keeps working.
 *
 * The 24h-window rule is real Meta policy: outside 24h since the user's last
 * inbound message, only pre-approved templates may be sent on Meta channels -
 * so live sends are refused (delivered:false, requiresTemplate:true) rather
 * than fired and rejected by the API.
 */
import { MESSAGING_WINDOW_MS, type Channel } from "../types";

const GRAPH_BASE = "https://graph.facebook.com/v23.0";

/** Meta: free-form replies only within 24h of the user's last inbound message. */
export function within24hWindow(lastInboundAt: Date | null | undefined): boolean {
  if (!lastInboundAt) return false;
  return Date.now() - lastInboundAt.getTime() < MESSAGING_WINDOW_MS;
}

export type SendResult = {
  delivered: boolean;
  /** Outside the window on a Meta channel → only an approved template may send. */
  requiresTemplate: boolean;
  /** Provider message id when a live API accepted the send. */
  providerMessageId?: string;
  note?: string;
};

const TEMPLATE_CHANNELS: Channel[] = ["instagram", "whatsapp", "messenger"];

const env = (k: string) => {
  const v = process.env[k];
  return v && v.trim() ? v.trim() : null;
};

const mockDelivered = (note: string): SendResult => ({
  delivered: true,
  requiresTemplate: false,
  note
});

/** Messenger + Instagram DMs share the Graph send API (page-scoped ids). */
async function sendViaGraph(externalId: string, body: string): Promise<SendResult> {
  const token = env("META_PAGE_ACCESS_TOKEN");
  if (!token) return mockDelivered("no META_PAGE_ACCESS_TOKEN, mock delivery");
  const res = await fetch(`${GRAPH_BASE}/me/messages?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: externalId },
      messaging_type: "RESPONSE",
      message: { text: body }
    })
  });
  const json = (await res.json().catch(() => ({}))) as {
    message_id?: string;
    error?: { message?: string };
  };
  if (!res.ok) {
    return {
      delivered: false,
      requiresTemplate: false,
      note: `Graph send failed (${res.status}): ${json.error?.message ?? "unknown error"}`
    };
  }
  return { delivered: true, requiresTemplate: false, providerMessageId: json.message_id };
}

async function sendViaWhatsApp(externalId: string, body: string): Promise<SendResult> {
  const token = env("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = env("WHATSAPP_PHONE_NUMBER_ID");
  if (!token || !phoneNumberId)
    return mockDelivered("no WHATSAPP_ACCESS_TOKEN/WHATSAPP_PHONE_NUMBER_ID, mock delivery");
  const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: externalId,
      type: "text",
      text: { body, preview_url: false }
    })
  });
  const json = (await res.json().catch(() => ({}))) as {
    messages?: { id: string }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    return {
      delivered: false,
      requiresTemplate: false,
      note: `WhatsApp send failed (${res.status}): ${json.error?.message ?? "unknown error"}`
    };
  }
  return { delivered: true, requiresTemplate: false, providerMessageId: json.messages?.[0]?.id };
}

/**
 * Meta "private reply", the ONE message a page may send in DM to someone who
 * commented on a post (the comment-to-DM mechanic; allowed entry point, no
 * prior conversation needed).
 *   - facebook page comment → POST /{comment_id}/private_replies
 *   - instagram comment     → POST /me/messages with recipient {comment_id}
 */
export async function sendPrivateReply(
  channel: Channel,
  commentId: string,
  body: string
): Promise<SendResult> {
  const token = env("META_PAGE_ACCESS_TOKEN");
  if (!token) return mockDelivered("no META_PAGE_ACCESS_TOKEN, mock private reply");
  try {
    const url =
      channel === "instagram"
        ? `${GRAPH_BASE}/me/messages?access_token=${encodeURIComponent(token)}`
        : `${GRAPH_BASE}/${commentId}/private_replies?access_token=${encodeURIComponent(token)}`;
    const payload =
      channel === "instagram"
        ? { recipient: { comment_id: commentId }, message: { text: body } }
        : { message: body };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = (await res.json().catch(() => ({}))) as {
      message_id?: string;
      id?: string;
      error?: { message?: string };
    };
    if (!res.ok) {
      return {
        delivered: false,
        requiresTemplate: false,
        note: `Private reply failed (${res.status}): ${json.error?.message ?? "unknown error"}`
      };
    }
    return {
      delivered: true,
      requiresTemplate: false,
      providerMessageId: json.message_id ?? json.id
    };
  } catch (err) {
    return {
      delivered: false,
      requiresTemplate: false,
      note: `Private reply error: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

/** True when this channel would hit a real external API (vs the mock). */
function isLive(channel: Channel): boolean {
  if (channel === "whatsapp")
    return Boolean(env("WHATSAPP_ACCESS_TOKEN") && env("WHATSAPP_PHONE_NUMBER_ID"));
  if (channel === "messenger" || channel === "instagram")
    return Boolean(env("META_PAGE_ACCESS_TOKEN"));
  return false;
}

export async function sendOutbound(
  channel: Channel,
  externalId: string | null,
  body: string,
  ctx: { lastInboundAt?: Date | null } = {}
): Promise<SendResult> {
  const inWindow = within24hWindow(ctx.lastInboundAt);
  const requiresTemplate = !inWindow && TEMPLATE_CHANNELS.includes(channel);

  // Outside the 24h window on a live Meta channel: refuse the free-form send.
  if (requiresTemplate && isLive(channel)) {
    return {
      delivered: false,
      requiresTemplate: true,
      note: "Outside the 24h window, send an approved message template instead."
    };
  }

  try {
    switch (channel) {
      case "messenger":
      case "instagram":
        if (!externalId)
          return { ...mockDelivered("no recipient id, mock delivery"), requiresTemplate };
        return { ...(await sendViaGraph(externalId, body)), requiresTemplate };
      case "whatsapp":
        if (!externalId)
          return { ...mockDelivered("no recipient number, mock delivery"), requiresTemplate };
        return { ...(await sendViaWhatsApp(externalId, body)), requiresTemplate };
      case "webchat":
        return { delivered: true, requiresTemplate: false };
      case "email":
        // REAL API SEAM: SMTP / provider API.
        return mockDelivered("email connector is mock");
    }
  } catch (err) {
    return {
      delivered: false,
      requiresTemplate,
      note: `Send error: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

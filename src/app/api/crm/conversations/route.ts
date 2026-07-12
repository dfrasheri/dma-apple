import { guard, ok } from "@/lib/crm/http";
import * as inboxService from "@/lib/crm/services/inbox";
import { CHANNELS, CONVERSATION_STATUSES } from "@/lib/crm/types";
import type { Channel, ConversationStatus } from "@/lib/crm/types";

export const runtime = "nodejs";

/** GET /api/crm/conversations, list, optionally filtered by ?status & ?channel. */
export const GET = guard(async (req) => {
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");
  const channelParam = url.searchParams.get("channel");

  const status =
    statusParam && (CONVERSATION_STATUSES as readonly string[]).includes(statusParam)
      ? (statusParam as ConversationStatus)
      : undefined;
  const channel =
    channelParam && (CHANNELS as readonly string[]).includes(channelParam)
      ? (channelParam as Channel)
      : undefined;

  return ok(await inboxService.listConversations({ status, channel }));
});

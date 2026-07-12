import { created, guard, notFound, parseBody } from "@/lib/crm/http";
import { messageSendSchema } from "@/lib/crm/schemas";
import * as inboxService from "@/lib/crm/services/inbox";

export const runtime = "nodejs";

/** POST /api/crm/conversations/[id]/messages, send an outbound reply. */
export const POST = guard(async (req, { params }) => {
  const { id } = await params;
  const { body, author, meta } = await parseBody(req, messageSendSchema);
  const result = await inboxService.sendMessage({
    conversationId: id,
    body,
    author,
    meta
  });
  return result ? created(result) : notFound("Conversation");
});

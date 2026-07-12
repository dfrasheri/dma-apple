import { guard, notFound, ok, parseBody } from "@/lib/crm/http";
import { conversationUpdateSchema } from "@/lib/crm/schemas";
import * as inboxService from "@/lib/crm/services/inbox";

export const runtime = "nodejs";

/** GET /api/crm/conversations/[id], full thread. */
export const GET = guard(async (_req, { params }) => {
  const { id } = await params;
  const conv = await inboxService.getConversation(id);
  return conv ? ok(conv) : notFound("Conversation");
});

/** PATCH /api/crm/conversations/[id], update status / assignee / botEnabled. */
export const PATCH = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, conversationUpdateSchema);
  const conv = await inboxService.updateConversation(id, body);
  return conv ? ok(conv) : notFound("Conversation");
});

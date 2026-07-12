import { guard, ok } from "@/lib/crm/http";
import * as inboxService from "@/lib/crm/services/inbox";

export const runtime = "nodejs";

/** GET /api/crm/conversations/[id]/draft, bot-suggested reply (does not send). */
export const GET = guard(async (_req, { params }) => {
  const { id } = await params;
  const draft = await inboxService.draftForConversation(id);
  return ok(draft);
});

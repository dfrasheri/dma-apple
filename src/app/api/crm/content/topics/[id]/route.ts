import { guard, notFound, ok, parseBody } from "@/lib/crm/http";
import { contentTopicStatusSchema } from "@/lib/crm/schemas";
import * as content from "@/lib/crm/services/content";

export const runtime = "nodejs";

/** PATCH /api/crm/content/topics/:id → HIL status change (approve/reject/…). */
export const PATCH = guard(async (req, ctx) => {
  const { id } = await ctx.params;
  const { status } = await parseBody(req, contentTopicStatusSchema);
  const updated = await content.setTopicStatus(id, status);
  return updated ? ok(updated) : notFound("Topic");
});

/** POST /api/crm/content/topics/:id → re-roll this single topic in place. */
export const POST = guard(async (_req, ctx) => {
  const { id } = await ctx.params;
  const updated = await content.regenerateTopic(id);
  return updated ? ok(updated) : notFound("Topic");
});

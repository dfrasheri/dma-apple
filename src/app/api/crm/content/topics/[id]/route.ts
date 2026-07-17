import { guard, notFound, ok, parseBody } from "@/lib/crm/http";
import { contentTopicPatchSchema } from "@/lib/crm/schemas";
import * as content from "@/lib/crm/services/content";

export const runtime = "nodejs";

/**
 * PATCH /api/crm/content/topics/:id — two body shapes:
 *  - `{ status }`            → HIL status change (approve/reject/…)
 *  - `{ locale, …fields }`   → edit the localized variant (title/slug/
 *    metaDescription/body) and/or the topic-level keyword/brief.
 */
export const PATCH = guard(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await parseBody(req, contentTopicPatchSchema);

  if ("status" in body) {
    const updated = await content.setTopicStatus(id, body.status);
    return updated ? ok(updated) : notFound("Topic");
  }

  const { locale, ...fields } = body;
  const updated = await content.editTopicVariant(id, locale, fields);
  return updated ? ok(updated) : notFound("Topic variant");
});

/** POST /api/crm/content/topics/:id → re-roll this single topic in place. */
export const POST = guard(async (_req, ctx) => {
  const { id } = await ctx.params;
  const updated = await content.regenerateTopic(id);
  return updated ? ok(updated) : notFound("Topic");
});

/** DELETE /api/crm/content/topics/:id → topic + variants + its published posts. */
export const DELETE = guard(async (_req, ctx) => {
  const { id } = await ctx.params;
  const deleted = await content.deleteTopic(id);
  return deleted ? ok({ deleted: true }) : notFound("Topic");
});

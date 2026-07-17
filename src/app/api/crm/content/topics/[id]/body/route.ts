import { guard, notFound, ok, parseBody } from "@/lib/crm/http";
import { contentBodyGenerateSchema } from "@/lib/crm/schemas";
import * as content from "@/lib/crm/services/content";

export const runtime = "nodejs";

/**
 * POST /api/crm/content/topics/:id/body → draft the article body for one
 * (topic, locale) variant — Claude when a key is configured, deterministic
 * knowledge-grounded fallback otherwise — and persist it on the variant.
 * Returns the updated variant.
 */
export const POST = guard(async (req, { params }) => {
  const { id } = await params;
  const { locale } = await parseBody(req, contentBodyGenerateSchema);
  const variant = await content.generateArticleBody(id, locale);
  return variant ? ok(variant) : notFound("Topic variant");
});

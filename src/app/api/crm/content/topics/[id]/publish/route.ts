import { created, fail, guard, notFound } from "@/lib/crm/http";
import * as content from "@/lib/crm/services/content";

export const runtime = "nodejs";

/**
 * POST /api/crm/content/topics/:id/publish → push every variant that has a
 * generated body to `published_posts` (the public blog feed). 201 with the
 * published posts. Expected domain failures — no body drafted yet, or a slug
 * already owned by another published post — come back as 409s with the
 * service's message; a missing topic is a 404.
 */
export const POST = guard(async (_req, { params }) => {
  const { id } = await params;
  try {
    const posts = await content.publishTopic(id);
    return created(posts);
  } catch (err) {
    if (err instanceof Error) {
      if (/not found/i.test(err.message)) return notFound("Topic");
      return fail(err.message, 409);
    }
    throw err;
  }
});

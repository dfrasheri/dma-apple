import { guard, notFound, ok } from "@/lib/crm/http";
import * as content from "@/lib/crm/services/content";

export const runtime = "nodejs";

/**
 * POST /api/crm/content/topics/:id/unpublish → remove this topic's articles
 * from the public blog (deletes its published_posts rows) and move the topic
 * back to "approved". Returns the updated topic.
 */
export const POST = guard(async (_req, { params }) => {
  const { id } = await params;
  const topic = await content.unpublishTopic(id);
  return topic ? ok(topic) : notFound("Topic");
});

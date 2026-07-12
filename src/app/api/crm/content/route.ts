import { guard, ok, parseBody } from "@/lib/crm/http";
import { contentGenerateSchema } from "@/lib/crm/schemas";
import * as content from "@/lib/crm/services/content";

export const runtime = "nodejs";

/**
 * GET /api/crm/content              → list all calendars (summaries)
 * GET /api/crm/content?latest=1     → newest calendar with topics + variants
 * GET /api/crm/content?id=<calId>   → a specific calendar with topics + variants
 */
export const GET = guard(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) return ok(await content.getCalendar(id));
  if (url.searchParams.get("latest")) return ok(await content.getLatestCalendar());
  return ok(await content.listCalendars());
});

/** POST /api/crm/content → generate (or regenerate) a month's calendar. */
export const POST = guard(async (req) => {
  const body = await parseBody(req, contentGenerateSchema);
  return ok(await content.generateMonth(body));
});

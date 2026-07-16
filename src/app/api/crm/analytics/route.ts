import { fail, guard, ok } from "@/lib/crm/http";
import * as analyticsService from "@/lib/crm/services/analytics";

export const runtime = "nodejs";

/** GET /api/crm/analytics?days=90 → { ok, data: { analytics } } */
export const GET = guard(async (req) => {
  const raw = new URL(req.url).searchParams.get("days");
  let days: number | undefined;
  if (raw !== null) {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 1 || n > 365) {
      return fail("days must be a number between 1 and 365", 400);
    }
    days = Math.floor(n);
  }
  const analytics = await analyticsService.getChatAnalytics(
    days === undefined ? undefined : { days }
  );
  return ok({ analytics });
});

import { guard, ok, parseBody } from "@/lib/crm/http";
import { marketUpsertSchema } from "@/lib/crm/schemas";
import * as marketService from "@/lib/crm/services/market";

export const runtime = "nodejs";

export const GET = guard(async () => ok(await marketService.listMarket()));

export const POST = guard(async (req) => {
  const body = await parseBody(req, marketUpsertSchema);
  return ok(await marketService.upsertMarket(body));
});

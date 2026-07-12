import { guard, ok, created, parseBody } from "@/lib/crm/http";
import { affiliateCreateSchema } from "@/lib/crm/schemas";
import * as affiliates from "@/lib/crm/services/affiliates";

export const runtime = "nodejs";

/** GET /api/crm/affiliates, every affiliate link + what it brought. */
export const GET = guard(async () => ok(affiliates.listWithStats()));

/** POST /api/crm/affiliates, staff creates an affiliate (auto-codes if omitted). */
export const POST = guard(async (req) => {
  const body = await parseBody(req, affiliateCreateSchema);
  const a = affiliates.createAffiliate(body);
  return created({ ...a, link: affiliates.affiliateLink(a.code) });
});

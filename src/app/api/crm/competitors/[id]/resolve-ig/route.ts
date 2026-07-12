import { guard, ok, notFound } from "@/lib/crm/http";
import * as competitorsService from "@/lib/crm/services/competitors";

export const runtime = "nodejs";

export const POST = guard(async (_req, { params }) => {
  const { id } = await params;
  const updated = await competitorsService.resolveInstagram(id);
  return updated ? ok(updated) : notFound("Competitor");
});

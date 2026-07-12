import { guard, ok, parseBody, created } from "@/lib/crm/http";
import { competitorCreateSchema } from "@/lib/crm/schemas";
import * as competitorsService from "@/lib/crm/services/competitors";

export const runtime = "nodejs";

export const GET = guard(async () => ok(await competitorsService.listCompetitors()));

export const POST = guard(async (req) => {
  const body = await parseBody(req, competitorCreateSchema);
  return created(await competitorsService.createCompetitor(body));
});

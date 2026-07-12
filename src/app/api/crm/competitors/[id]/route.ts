import { guard, ok, parseBody, notFound } from "@/lib/crm/http";
import { competitorUpdateSchema } from "@/lib/crm/schemas";
import * as competitorsService from "@/lib/crm/services/competitors";

export const runtime = "nodejs";

export const GET = guard(async (_req, { params }) => {
  const { id } = await params;
  const competitor = await competitorsService.getCompetitor(id);
  return competitor ? ok(competitor) : notFound("Competitor");
});

export const PATCH = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, competitorUpdateSchema);
  const competitor = await competitorsService.updateCompetitor(id, body);
  return competitor ? ok(competitor) : notFound("Competitor");
});

export const DELETE = guard(async (_req, { params }) => {
  const { id } = await params;
  await competitorsService.deleteCompetitor(id);
  return ok({ deleted: true });
});

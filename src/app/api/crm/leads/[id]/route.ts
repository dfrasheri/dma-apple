import { guard, ok, parseBody, notFound } from "@/lib/crm/http";
import { leadUpdateSchema } from "@/lib/crm/schemas";
import * as leadsService from "@/lib/crm/services/leads";

export const runtime = "nodejs";

export const GET = guard(async (_req, { params }) => {
  const { id } = await params;
  const lead = await leadsService.getLead(id);
  return lead ? ok(lead) : notFound("Lead");
});

export const PATCH = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, leadUpdateSchema);
  const updated = await leadsService.updateLead(id, body);
  return updated ? ok(updated) : notFound("Lead");
});

import { guard, parseBody, created, notFound } from "@/lib/crm/http";
import { activityCreateSchema } from "@/lib/crm/schemas";
import * as leadsService from "@/lib/crm/services/leads";

export const runtime = "nodejs";

export const POST = guard(async (req, { params }) => {
  const { id } = await params;
  const lead = await leadsService.getLead(id);
  if (!lead) return notFound("Lead");
  const body = await parseBody(req, activityCreateSchema);
  return created(leadsService.logActivity(id, body.type ?? "note", body.body, body.author));
});

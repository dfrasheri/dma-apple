import { guard, ok, parseBody, created, fail } from "@/lib/crm/http";
import { leadCreateSchema, type LeadCreateInput } from "@/lib/crm/schemas";
import { LEAD_STAGES, type LeadStage } from "@/lib/crm/types";
import * as leadsService from "@/lib/crm/services/leads";

export const runtime = "nodejs";

const isLeadStage = (v: string): v is LeadStage =>
  (LEAD_STAGES as readonly string[]).includes(v);

export const GET = guard(async (req) => {
  const stageParam = new URL(req.url).searchParams.get("stage");
  if (stageParam !== null) {
    if (!isLeadStage(stageParam)) return fail("Invalid stage", 422);
    return ok(await leadsService.listLeads({ stage: stageParam }));
  }
  return ok(await leadsService.listLeads());
});

export const POST = guard(async (req) => {
  // zod applies `.default("other")` to `source` at parse time; `parseBody`'s
  // generic resolves to the schema *input* type, so annotate with the output type.
  const body = (await parseBody(req, leadCreateSchema)) as LeadCreateInput;
  return created(await leadsService.createLead(body));
});

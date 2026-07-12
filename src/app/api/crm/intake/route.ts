/**
 * PUBLIC lead-intake endpoint for the marketing site.
 *
 * The marketing site has no CRM session, so the route guard runs with
 * `{ public: true }`. NOTE: the edge middleware gates all of `/api/crm/*`
 * except `/api/crm/auth`, so `/api/crm/intake` must ALSO be allow-listed in
 * `src/middleware.ts` for this to be reachable without a session.
 */
import { guard, parseBody, created } from "@/lib/crm/http";
import { leadCreateSchema, type LeadCreateInput } from "@/lib/crm/schemas";
import * as leadsService from "@/lib/crm/services/leads";

export const runtime = "nodejs";

export const POST = guard(
  async (req) => {
    const body = await parseBody(req, leadCreateSchema);
    // `parseBody`'s generic resolves to the schema INPUT type, where `source` is
    // optional (it carries a zod `.default("other")`). At runtime zod has already
    // applied the default, so we re-affirm it to satisfy the service's output type
    // without an unchecked cast.
    const input: LeadCreateInput = { ...body, source: body.source ?? "other" };
    const lead = await leadsService.createLead(input);
    return created({ id: lead.id });
  },
  { public: true }
);

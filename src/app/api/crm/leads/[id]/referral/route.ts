/**
 * POST /api/crm/leads/[id]/referral, mint (or fetch) the patient's referral
 * link, to embed in their preventiv / treatment-plan estimate. The patient
 * becomes a `kind: "patient"` affiliate, so any leads they bring are tracked
 * alongside partner affiliates.
 */
import { guard, ok, notFound } from "@/lib/crm/http";
import * as leadsService from "@/lib/crm/services/leads";
import { referralForPatient } from "@/lib/crm/services/affiliates";

export const runtime = "nodejs";

export const POST = guard(async (_req, { params }) => {
  const { id } = await params;
  const lead = await leadsService.getLead(id);
  if (!lead || !lead.contact) return notFound("Lead");
  const { affiliate, link } = referralForPatient({
    name: lead.contact.name,
    email: lead.contact.email,
    phone: lead.contact.phone,
  });
  return ok({ code: affiliate.code, link, affiliateId: affiliate.id });
});

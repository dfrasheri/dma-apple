/**
 * POST /api/affiliate/register, PUBLIC help-desk registration.
 *
 * Files an affiliate application (status `pending`) and returns the would-be
 * referral link. Staff approve it (→ active) in the CRM. Reachable without a
 * session (the middleware matcher excludes /api).
 */
import { NextResponse } from "next/server";
import { affiliateRegisterSchema } from "@/lib/crm/schemas";
import { registerAffiliate, affiliateLink } from "@/lib/crm/services/affiliates";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = affiliateRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid request", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const a = registerAffiliate(parsed.data);
  return NextResponse.json(
    { ok: true, id: a.id, code: a.code, link: affiliateLink(a.code), status: a.status },
    { status: 201 },
  );
}

import { guard, notFound, ok, parseBody } from "@/lib/crm/http";
import { teamMemberUpdateSchema } from "@/lib/crm/schemas";
import * as team from "@/lib/crm/services/team";

export const runtime = "nodejs";

/** GET /api/crm/team/[id], one member. */
export const GET = guard(async (_req, { params }) => {
  const { id } = await params;
  const member = team.getMember(id);
  return member ? ok(member) : notFound("Team member");
});

/** PATCH /api/crm/team/[id], rename, change role, or (de)activate. */
export const PATCH = guard(async (req, { params }) => {
  const { id } = await params;
  const body = await parseBody(req, teamMemberUpdateSchema);
  const member = team.updateMember(id, body);
  return member ? ok(member) : notFound("Team member");
});

import { created, guard, ok, parseBody } from "@/lib/crm/http";
import { teamMemberCreateSchema } from "@/lib/crm/schemas";
import * as team from "@/lib/crm/services/team";
import { TEAM_ROLES, type TeamRole } from "@/lib/crm/types";

export const runtime = "nodejs";

/** GET /api/crm/team[?role=coordinator&active=1], the assignment roster. */
export const GET = guard(async (req) => {
  const url = new URL(req.url);
  const roleParam = url.searchParams.get("role");
  const role = (TEAM_ROLES as readonly string[]).includes(roleParam ?? "")
    ? (roleParam as TeamRole)
    : undefined;
  const activeOnly = url.searchParams.get("active") === "1";
  return ok(team.listMembers({ role, activeOnly }));
});

/** POST /api/crm/team, add a member to the rotation. */
export const POST = guard(async (req) => {
  const body = await parseBody(req, teamMemberCreateSchema);
  return created(team.createMember(body));
});

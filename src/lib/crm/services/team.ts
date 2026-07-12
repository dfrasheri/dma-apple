/**
 * Team roster + round-robin lead routing.
 *
 * `nextAssignee(role)` hands out work fairly across however many ACTIVE members
 * hold a role: the member assigned longest ago (never-assigned first) is next,
 * and the pick advances their cursor. Adding or deactivating people rebalances
 * automatically, the rotation is just "oldest cursor wins", no counters to
 * migrate when the roster changes.
 */
import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { teamMembers, type TeamMember } from "@/db/schema";
import type { TeamMemberCreateInput, TeamMemberUpdateInput } from "../schemas";
import type { TeamRole } from "../types";

const now = () => new Date();

export function listMembers(
  opts: { role?: TeamRole; activeOnly?: boolean } = {}
): TeamMember[] {
  const conds = [];
  if (opts.role) conds.push(eq(teamMembers.role, opts.role));
  if (opts.activeOnly) conds.push(eq(teamMembers.active, true));
  const base = db.select().from(teamMembers);
  const filtered = conds.length ? base.where(and(...conds)) : base;
  return filtered.orderBy(asc(teamMembers.createdAt)).all();
}

export function getMember(id: string): TeamMember | null {
  return db.select().from(teamMembers).where(eq(teamMembers.id, id)).get() ?? null;
}

export function createMember(input: TeamMemberCreateInput): TeamMember {
  return db
    .insert(teamMembers)
    .values({
      name: input.name,
      email: input.email && input.email.includes("@") ? input.email : null,
      role: input.role,
      active: input.active
    })
    .returning()
    .get();
}

export function updateMember(
  id: string,
  patch: TeamMemberUpdateInput
): TeamMember | null {
  const before = getMember(id);
  if (!before) return null;
  const set: Partial<TeamMember> = { updatedAt: now() };
  if (patch.name !== undefined) set.name = patch.name;
  if (patch.email !== undefined)
    set.email = patch.email && patch.email.includes("@") ? patch.email : null;
  if (patch.role !== undefined) set.role = patch.role;
  if (patch.active !== undefined) set.active = patch.active;
  return db.update(teamMembers).set(set).where(eq(teamMembers.id, id)).returning().get();
}

/**
 * Round-robin pick: the ACTIVE member with this role whose cursor is oldest
 * (never-assigned members go first). Advances the winner's cursor. Returns
 * null when nobody active holds the role, callers leave the work unowned.
 */
export function nextAssignee(role: TeamRole): TeamMember | null {
  const member = db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.role, role), eq(teamMembers.active, true)))
    .orderBy(
      sql`${teamMembers.lastAssignedAt} IS NOT NULL`,
      asc(teamMembers.lastAssignedAt),
      asc(teamMembers.createdAt)
    )
    .limit(1)
    .get();
  if (!member) return null;
  db.update(teamMembers)
    .set({ lastAssignedAt: now(), updatedAt: now() })
    .where(eq(teamMembers.id, member.id))
    .run();
  return member;
}

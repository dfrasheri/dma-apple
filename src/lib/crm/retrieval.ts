/**
 * Fact retrieval, STRUCTURED FILTER, not fuzzy text search. This is what keeps
 * "open day in Venice?" from ever returning the Venice Beach row: city/date/
 * procedure are exact (case-insensitive) equality filters.
 *
 * Only ever returns facts that are `approved` AND not superseded AND not retired
 *, i.e. facts that have cleared the human-in-the-loop gate. The bot reads from
 * here, so the bot physically cannot state an unreviewed fact.
 */
import { and, desc, eq, isNull, sql, type AnyColumn } from "drizzle-orm";
import { db } from "@/db/client";
import { socialFacts, socialPosts, type SocialFact, type SocialPost } from "@/db/schema";
import type { FactType } from "./types";

export type FactQuery = {
  type?: FactType;
  city?: string;
  date?: string;
  procedure?: string;
  doctor?: string;
};

export type RetrievedFact = SocialFact & { post: SocialPost | null };

const ciEq = (col: AnyColumn, value: string) =>
  sql`lower(${col}) = ${value.trim().toLowerCase()}`;

export async function findFacts(q: FactQuery): Promise<RetrievedFact[]> {
  const conds = [
    eq(socialFacts.status, "approved"),
    isNull(socialFacts.supersededBy)
  ];
  if (q.type) conds.push(eq(socialFacts.type, q.type));
  if (q.city) conds.push(ciEq(socialFacts.city, q.city));
  if (q.procedure) conds.push(ciEq(socialFacts.procedure, q.procedure));
  if (q.doctor) conds.push(ciEq(socialFacts.doctor, q.doctor));
  if (q.date) conds.push(eq(socialFacts.date, q.date));

  const rows = db
    .select()
    .from(socialFacts)
    .leftJoin(socialPosts, eq(socialFacts.sourcePostId, socialPosts.postId))
    .where(and(...conds))
    .orderBy(desc(socialPosts.postTimestamp), desc(socialFacts.confidence))
    .all();

  return rows.map((r) => ({ ...r.social_facts, post: r.social_posts }));
}

/** The single best (most recent, most confident) approved fact for a query, if any. */
export async function bestFact(q: FactQuery): Promise<RetrievedFact | null> {
  const rows = await findFacts(q);
  return rows[0] ?? null;
}

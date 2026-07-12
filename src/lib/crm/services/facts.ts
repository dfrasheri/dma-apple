/**
 * Knowledge-base service, the DB application of the reconcile/extract/HIL
 * pipeline. Routes and the seed call these; the pure logic lives in
 * `reconcile.ts` / `extract.ts`.
 *
 * Lifecycle of a fact:
 *   ingest → extract → grade (auto-approve only if safe) → [HIL review] →
 *   approved (+ supersede older same-subject facts) → served by the bot
 *   …and on a post edit/delete: re-extract in place / retire, keyed on post_id.
 */
import { and, desc, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/db/client";
import {
  socialFacts,
  socialPosts,
  type SocialFact,
  type SocialPost
} from "@/db/schema";
import {
  AUTO_APPROVE_CONFIDENCE,
  HIGH_STAKES_FACT_TYPES,
  type FactStatus,
  type FactType
} from "../types";
import { extractFacts, type ExtractedFact } from "../extract";
import {
  contentHash,
  factSubjectKey,
  planReconcile,
  type IncomingPost
} from "../reconcile";

export type FactWithPost = SocialFact & { post: SocialPost | null };

const now = () => new Date();
const toDate = (v: IncomingPost["postTimestamp"]) =>
  v == null ? null : new Date(v);

/** Initial status for a freshly-extracted fact, the auto-trust decision. */
function gradeFact(f: Pick<ExtractedFact, "type" | "confidence" | "conflictFlag">): FactStatus {
  const highStakes = HIGH_STAKES_FACT_TYPES.includes(f.type);
  if (highStakes) {
    return f.confidence >= AUTO_APPROVE_CONFIDENCE && !f.conflictFlag
      ? "approved"
      : "pending_review";
  }
  return f.confidence >= 0.5 ? "approved" : "pending_review";
}

function insertFactRow(f: ExtractedFact, postId: string, status: FactStatus) {
  db.insert(socialFacts)
    .values({
      type: f.type,
      city: f.city ?? null,
      venue: f.venue ?? null,
      date: f.date ?? null,
      procedure: f.procedure ?? null,
      doctor: f.doctor ?? null,
      payload: f.payload ?? null,
      sourcePostId: postId,
      confidence: f.confidence,
      status,
      conflictFlag: f.conflictFlag,
      conflictReason: f.conflictReason ?? null,
      extractedAt: now()
    })
    .run();
}

function insertPostWithFacts(post: IncomingPost) {
  const ts = toDate(post.postTimestamp);
  db.insert(socialPosts)
    .values({
      postId: post.postId,
      account: post.account,
      channel: "instagram",
      caption: post.caption ?? null,
      mediaUrl: post.mediaUrl ?? null,
      permalink: post.permalink ?? null,
      postTimestamp: ts,
      contentHash: contentHash(post.caption, post.mediaUrl),
      status: "live",
      fetchedAt: now()
    })
    .run();

  for (const f of extractFacts({ caption: post.caption, mediaUrl: post.mediaUrl, postTimestamp: ts })) {
    insertFactRow(f, post.postId, gradeFact(f));
  }
}

/**
 * A post's content changed: update the row, then reconcile its facts in place by
 * subject. Matched facts are UPDATED (and high-stakes ones re-gated to review),
 * new subjects inserted, vanished subjects retired. Row identity is preserved so
 * there's never a stale duplicate.
 */
function updatePostFacts(post: IncomingPost) {
  const ts = toDate(post.postTimestamp);
  db.update(socialPosts)
    .set({
      caption: post.caption ?? null,
      mediaUrl: post.mediaUrl ?? null,
      permalink: post.permalink ?? null,
      postTimestamp: ts,
      contentHash: contentHash(post.caption, post.mediaUrl),
      status: "live",
      fetchedAt: now()
    })
    .where(eq(socialPosts.postId, post.postId))
    .run();

  const existing = db
    .select()
    .from(socialFacts)
    .where(and(eq(socialFacts.sourcePostId, post.postId), ne(socialFacts.status, "retired")))
    .all();

  const extracted = extractFacts({ caption: post.caption, mediaUrl: post.mediaUrl, postTimestamp: ts });
  const usedExisting = new Set<string>();

  for (const f of extracted) {
    const key = factSubjectKey(f);
    const match = existing.find((e) => !usedExisting.has(e.id) && factSubjectKey(e) === key);
    const highStakes = HIGH_STAKES_FACT_TYPES.includes(f.type);
    // An edit to a high-stakes fact must be re-confirmed by a human.
    const status: FactStatus = highStakes ? "pending_review" : gradeFact(f);

    if (match) {
      usedExisting.add(match.id);
      db.update(socialFacts)
        .set({
          city: f.city ?? null,
          venue: f.venue ?? null,
          date: f.date ?? null,
          procedure: f.procedure ?? null,
          doctor: f.doctor ?? null,
          payload: f.payload ?? null,
          confidence: f.confidence,
          status,
          conflictFlag: f.conflictFlag,
          conflictReason: f.conflictReason ?? null,
          supersededBy: null,
          reviewedBy: null,
          reviewedAt: null,
          extractedAt: now(),
          updatedAt: now()
        })
        .where(eq(socialFacts.id, match.id))
        .run();
    } else {
      insertFactRow(f, post.postId, status);
    }
  }

  // Facts whose subject disappeared from the edited caption → retire.
  for (const e of existing) {
    if (!usedExisting.has(e.id)) {
      db.update(socialFacts)
        .set({ status: "retired", updatedAt: now() })
        .where(eq(socialFacts.id, e.id))
        .run();
    }
  }
}

function retirePost(postId: string) {
  db.update(socialPosts).set({ status: "deleted" }).where(eq(socialPosts.postId, postId)).run();
  db.update(socialFacts)
    .set({ status: "retired", updatedAt: now() })
    .where(and(eq(socialFacts.sourcePostId, postId), ne(socialFacts.status, "retired")))
    .run();
}

export type ReconcileSummary = {
  inserted: number;
  updated: number;
  retired: number;
  unchanged: number;
};

/** Diff `incoming` against stored posts and apply inserts/updates/retires. */
export async function reconcile(
  incoming: IncomingPost[],
  scope: "full" | "partial" = "full"
): Promise<ReconcileSummary> {
  const stored = db
    .select({
      postId: socialPosts.postId,
      contentHash: socialPosts.contentHash,
      status: socialPosts.status
    })
    .from(socialPosts)
    .all();

  const plan = planReconcile(stored, incoming, scope);

  for (const p of plan.toInsert) insertPostWithFacts(p);
  for (const u of plan.toUpdate) updatePostFacts(u.post);
  for (const postId of plan.toRetire) retirePost(postId);

  return {
    inserted: plan.toInsert.length,
    updated: plan.toUpdate.length,
    retired: plan.toRetire.length,
    unchanged: plan.unchangedPostIds.length
  };
}

// ── reads ────────────────────────────────────────────────────────────────────
function joinFacts() {
  return db
    .select()
    .from(socialFacts)
    .leftJoin(socialPosts, eq(socialFacts.sourcePostId, socialPosts.postId));
}

const mapRow = (r: { social_facts: SocialFact; social_posts: SocialPost | null }): FactWithPost => ({
  ...r.social_facts,
  post: r.social_posts
});

export async function listFacts(opts: { status?: FactStatus; type?: FactType; city?: string } = {}): Promise<FactWithPost[]> {
  const conds = [];
  if (opts.status) conds.push(eq(socialFacts.status, opts.status));
  if (opts.type) conds.push(eq(socialFacts.type, opts.type));
  if (opts.city) conds.push(eq(socialFacts.city, opts.city));
  const base = joinFacts();
  const filtered = conds.length ? base.where(and(...conds)) : base;
  const rows = filtered.orderBy(desc(socialFacts.extractedAt)).all();
  return rows.map(mapRow);
}

export async function listReviewQueue(): Promise<FactWithPost[]> {
  const rows = joinFacts()
    .where(eq(socialFacts.status, "pending_review"))
    .orderBy(desc(socialFacts.conflictFlag), desc(socialFacts.extractedAt))
    .all();
  return rows.map(mapRow);
}

export async function reviewQueueCount(): Promise<number> {
  return (await listReviewQueue()).length;
}

export async function getFact(id: string): Promise<FactWithPost | null> {
  const row = joinFacts().where(eq(socialFacts.id, id)).get();
  return row ? mapRow(row) : null;
}

/** Approve (and supersede older same-subject approved facts) or reject a fact. */
export async function reviewFact(
  id: string,
  decision: "approve" | "reject",
  reviewer = "staff"
): Promise<FactWithPost | null> {
  if (decision === "reject") {
    db.update(socialFacts)
      .set({ status: "rejected", reviewedBy: reviewer, reviewedAt: now(), updatedAt: now() })
      .where(eq(socialFacts.id, id))
      .run();
    return getFact(id);
  }

  db.update(socialFacts)
    .set({ status: "approved", reviewedBy: reviewer, reviewedAt: now(), updatedAt: now(), supersededBy: null })
    .where(eq(socialFacts.id, id))
    .run();

  const me = await getFact(id);
  if (me) {
    const myKey = factSubjectKey(me);
    const myTs = me.post?.postTimestamp?.getTime() ?? 0;
    const others = joinFacts()
      .where(and(eq(socialFacts.status, "approved"), isNull(socialFacts.supersededBy)))
      .all()
      .map(mapRow);
    for (const o of others) {
      if (o.id === id) continue;
      if (factSubjectKey(o) === myKey && (o.post?.postTimestamp?.getTime() ?? 0) <= myTs) {
        db.update(socialFacts)
          .set({ supersededBy: id, updatedAt: now() })
          .where(eq(socialFacts.id, o.id))
          .run();
      }
    }
  }
  return getFact(id);
}

/** Human edits to a fact's structured fields → back to the review queue. */
export async function updateFactFields(
  id: string,
  patch: Partial<Pick<SocialFact, "type" | "city" | "venue" | "date" | "procedure" | "doctor">>
): Promise<FactWithPost | null> {
  db.update(socialFacts)
    .set({ ...patch, status: "pending_review", conflictFlag: false, conflictReason: null, updatedAt: now() })
    .where(eq(socialFacts.id, id))
    .run();
  return getFact(id);
}

export async function listPosts(): Promise<SocialPost[]> {
  return db.select().from(socialPosts).orderBy(desc(socialPosts.postTimestamp)).all();
}

/**
 * Reconciliation + supersession engine, the single most important box in the
 * whole system. Pure and unit-testable; the DB apply lives in
 * `services/facts.ts`.
 *
 * Keyed on `postId` (the platform post id), NEVER appended blindly:
 *   - post seen for the first time            → INSERT (+ extract facts)
 *   - post content changed (hash differs)     → UPDATE in place (+ re-extract)
 *   - post marked deleted, or missing from a  → RETIRE (its facts go `retired`)
 *     FULL re-sync
 *   - a newer post about the same subject      → SUPERSEDE the older fact
 *
 * Because facts reference the post by `postId`, an edit/delete updates the same
 * rows instead of leaving a stale duplicate, that's what kills the "old post
 * still in the DB" nightmare.
 */
import { createHash } from "crypto";
import type { FactType } from "./types";

export type StoredPost = {
  postId: string;
  contentHash: string | null;
  status: "live" | "edited" | "deleted";
};

export type IncomingPost = {
  postId: string;
  account: string;
  caption?: string | null;
  mediaUrl?: string | null;
  permalink?: string | null;
  postTimestamp?: string | number | Date | null;
  /** Platform told us this post was removed. */
  deleted?: boolean;
};

export type ReconcilePlan = {
  toInsert: IncomingPost[];
  /** Content changed (or a deleted post was re-published). Re-extract facts. */
  toUpdate: { post: IncomingPost; previousHash: string | null }[];
  /** postIds to retire (deleted, or absent from a full re-sync). */
  toRetire: string[];
  unchangedPostIds: string[];
};

/** Stable content fingerprint, lets us detect an edit without diffing text. */
export function contentHash(
  caption?: string | null,
  mediaUrl?: string | null
): string {
  return createHash("sha256")
    .update(`${caption ?? ""} ${mediaUrl ?? ""}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Diff the incoming feed against what we already have.
 * @param scope "full" = an account re-sync (retire posts no longer present);
 *              "partial" = a webhook for specific posts (never retire on absence).
 */
export function planReconcile(
  stored: StoredPost[],
  incoming: IncomingPost[],
  scope: "full" | "partial" = "full"
): ReconcilePlan {
  const storedById = new Map(stored.map((p) => [p.postId, p]));
  const seen = new Set<string>();

  const plan: ReconcilePlan = {
    toInsert: [],
    toUpdate: [],
    toRetire: [],
    unchangedPostIds: []
  };

  for (const post of incoming) {
    seen.add(post.postId);
    const prev = storedById.get(post.postId);

    if (post.deleted) {
      if (prev && prev.status !== "deleted") plan.toRetire.push(post.postId);
      continue;
    }

    const hash = contentHash(post.caption, post.mediaUrl);
    if (!prev) {
      plan.toInsert.push(post);
    } else if (prev.contentHash !== hash || prev.status === "deleted") {
      // changed, or a previously-deleted post was re-published
      plan.toUpdate.push({ post, previousHash: prev.contentHash });
    } else {
      plan.unchangedPostIds.push(post.postId);
    }
  }

  // On a full re-sync, anything live we hold but didn't see again is gone.
  if (scope === "full") {
    for (const p of stored) {
      if (p.status !== "deleted" && !seen.has(p.postId)) {
        plan.toRetire.push(p.postId);
      }
    }
  }

  return plan;
}

/**
 * Supersession identity for a fact: the *subject* it describes, independent of
 * the value. A newer post giving a new date for "open_day · Venice · zirconium
 * crowns" supersedes the older fact with the same key. Date/price live in the
 * value, not the key, so a correction matches and replaces.
 */
export function factSubjectKey(f: {
  type: FactType;
  city?: string | null;
  procedure?: string | null;
  venue?: string | null;
}): string {
  const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();
  return [f.type, norm(f.city), norm(f.procedure), norm(f.venue)].join("|");
}

export type SupersedeCandidate = {
  id: string;
  subjectKey: string;
  postTimestamp: number; // ms
};

/**
 * Given the currently-approved facts and a set of newly-approved facts, decide
 * which old facts a new fact replaces (same subject, older source post).
 * Returns pairs of { oldId → supersededByNewId }.
 */
export function planSupersessions(
  approved: SupersedeCandidate[],
  incoming: SupersedeCandidate[]
): { oldId: string; newId: string }[] {
  const out: { oldId: string; newId: string }[] = [];
  for (const fresh of incoming) {
    for (const old of approved) {
      if (old.id === fresh.id) continue;
      if (
        old.subjectKey === fresh.subjectKey &&
        fresh.postTimestamp >= old.postTimestamp
      ) {
        out.push({ oldId: old.id, newId: fresh.id });
      }
    }
  }
  return out;
}

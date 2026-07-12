/**
 * Shared security primitives for the PUBLIC surface (webhooks, intake), the
 * routes that run with `{ public: true }` and therefore need their own defenses
 * instead of the staff-session gate.
 *
 *  - `rateLimit`: a lightweight fixed-window limiter keyed by an arbitrary
 *    string (sender id, IP). In-memory, per server instance, not a distributed
 *    guarantee, but it caps a trivial flood without adding infra. Swap for
 *    Redis/Upstash at scale.
 *  - `isProd`: gate dev-only affordances (unsigned simulator payloads) out of
 *    production.
 */

export const isProd = process.env.NODE_ENV === "production";

// ── Fixed-window rate limiter ────────────────────────────────────────────────
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Returns { ok, retryAfterSec }. `ok:false` → caller should 429. */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): { ok: boolean; retryAfterSec: number } {
  const nowMs = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt <= nowMs) {
    buckets.set(key, { count: 1, resetAt: nowMs + opts.windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (b.count >= opts.limit) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - nowMs) / 1000) };
  }
  b.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Opportunistic sweep so the map can't grow unbounded on a long-lived server. */
function sweep() {
  if (buckets.size < 5000) return;
  const nowMs = Date.now();
  for (const [k, b] of buckets) if (b.resetAt <= nowMs) buckets.delete(k);
}

/** Best-effort client IP from proxy headers (Vercel/most hosts set these). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function rateLimitOr429(
  key: string,
  opts: { limit: number; windowMs: number }
): { ok: true } | { ok: false; retryAfterSec: number } {
  sweep();
  const r = rateLimit(key, opts);
  return r.ok ? { ok: true } : { ok: false, retryAfterSec: r.retryAfterSec };
}

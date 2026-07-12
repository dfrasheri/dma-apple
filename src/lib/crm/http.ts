/**
 * Thin helpers for CRM route handlers, consistent JSON envelopes, zod body
 * parsing, and a session guard (defense-in-depth behind the middleware gate).
 */
import { NextResponse } from "next/server";
import type { ZodTypeAny, output } from "zod";
import { hasValidSession } from "./auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json({ ok: false, error: message, details: extra }, { status });
}

export const notFound = (what = "Resource") => fail(`${what} not found`, 404);
export const unauthorized = () => fail("Unauthorized", 401);

/** Parse + validate a JSON body. Throws `BodyError` on failure (catch with `guard`). */
export class BodyError extends Error {
  constructor(public details: unknown) {
    super("Invalid request body");
  }
}

export async function parseBody<S extends ZodTypeAny>(
  req: Request,
  schema: S
): Promise<output<S>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new BodyError("Body must be valid JSON");
  }
  const result = schema.safeParse(raw);
  if (!result.success) throw new BodyError(result.error.flatten());
  // `output<S>` = the *parsed* type, so zod `.default()` fields are present.
  return result.data;
}

/** 401 if the staff session cookie is missing/invalid. Returns null when OK. */
export async function requireSession(): Promise<NextResponse | null> {
  return (await hasValidSession()) ? null : unauthorized();
}

/**
 * Wrap a route handler with auth + error handling. Most CRM routes use this:
 *   export const POST = guard(async (req) => { ... return ok(x) })
 * Pass `{ public: true }` to skip the session check (e.g. inbound webhooks).
 */
export function guard(
  handler: (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>,
  opts: { public?: boolean } = {}
) {
  return async (req: Request, ctx: { params: Promise<Record<string, string>> }) => {
    try {
      if (!opts.public) {
        const denied = await requireSession();
        if (denied) return denied;
      }
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof BodyError) return fail("Invalid request body", 422, err.details);
      console.error("[crm] route error:", err);
      return fail("Internal error", 500);
    }
  };
}

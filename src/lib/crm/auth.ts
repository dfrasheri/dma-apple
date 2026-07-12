/**
 * Node-runtime auth helpers for the CRM password gate (login/logout routes and
 * route-handler defense-in-depth). The edge verifier is in `auth-edge.ts`.
 */
import crypto from "crypto";
import { cookies } from "next/headers";
import { CRM_COOKIE, DEV_SECRET } from "./auth-edge";

export { CRM_COOKIE };

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function secret(): string {
  return process.env.CRM_SECRET || DEV_SECRET;
}

/** The single staff password. Dev fallback "dentalmedaustria"; set CRM_PASSWORD in prod. */
export function crmPassword(): string {
  return process.env.CRM_PASSWORD || "dentalmedaustria";
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(crmPassword());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function signSession(ttlMs = SESSION_TTL_MS): string {
  const payload = { sub: "staff", iat: Date.now(), exp: Date.now() + ttlMs };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = crypto.createHmac("sha256", secret()).update(data).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    return typeof payload?.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Read the session cookie in a Server Component / route handler. */
export async function hasValidSession(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(CRM_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_MS / 1000
};

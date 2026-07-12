/**
 * Edge-safe session verification (Web Crypto only, no Node imports).
 *
 * Imported by `src/middleware.ts`, which runs on the edge runtime. The matching
 * signer lives in `auth.ts` (Node runtime, used by the login route). Token format:
 *   base64url(JSON payload) "." base64url(HMAC-SHA256(payload, secret))
 */
export const CRM_COOKIE = "elx_crm_session";

/** Dev fallback so the CRM works out of the box; override in production via env. */
export const DEV_SECRET = "dentalmedaustria-dev-secret-change-me";

export function getSecret(): string {
  return process.env.CRM_SECRET || DEV_SECRET;
}

function b64urlToBytes(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    s.length + ((4 - (s.length % 4)) % 4),
    "="
  );
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Returns true iff the token's signature matches and it has not expired. */
export async function verifySessionEdge(
  token: string | undefined,
  secret = getSecret()
): Promise<boolean> {
  if (!token) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const mac = await crypto.subtle.sign("HMAC", key, enc.encode(data));
    const expected = bytesToB64url(new Uint8Array(mac));
    if (expected !== sig) return false;

    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(data)));
    return typeof payload?.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

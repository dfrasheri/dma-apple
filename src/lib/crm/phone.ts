/**
 * Phone canonicalisation + fuzzy matching, the glue that stitches a lead
 * captured on the website ("067 703 3332", "+355 67 703 3332"…) to the same
 * person arriving later through the WhatsApp Cloud API webhook, whose wa_id is
 * always the bare E.164 digits ("355677033332"). Exact string equality never
 * matches those, which is how duplicate contacts are born.
 *
 * Pure functions only, DB lookups live in the services that use them.
 */

/** Digits-only canonical form; strips punctuation and the international 00 prefix. */
export function normalizePhone(raw: string | null | undefined): string {
  if (!raw) return "";
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  return d;
}

/** Matching form: canonical digits with local trunk zeros stripped ("0677…" → "677…"). */
function significant(raw: string | null | undefined): string {
  return normalizePhone(raw).replace(/^0+/, "");
}

/**
 * A national subscriber number (mobile/landline, country code + trunk zero
 * stripped) runs ~9–11 digits across DMA's markets (AL/IT/DE/AT/CH/GB/FR).
 * Requiring the shorter side to clear this floor stops an 8-digit *fragment*
 * of a longer, unrelated number from merging two different patients.
 */
const MIN_NATIONAL_DIGITS = 9;

/**
 * The gap between a full E.164 number and its national part is a country code -
 * and ITU country codes are 1–3 digits (there is no 4-digit one). Capping at 3
 * stops a longer unrelated number whose tail coincides from matching.
 */
const MIN_CC_PREFIX = 1;
const MAX_CC_PREFIX = 3;

/**
 * True when two phone strings plausibly denote the same line: equal significant
 * digits, or a suffix match where the longer side simply carries a country code
 * the shorter lacks ("0677033332" ↔ "+355677033332"). Guarded twice so it can't
 * conflate different people: the shorter side must be a full national number
 * (≥9 digits) AND the extra leading digits must be country-code-sized (1–4), so
 * a short fragment can never match the tail of a long unrelated number.
 */
export function phonesMatch(
  a: string | null | undefined,
  b: string | null | undefined
): boolean {
  const A = significant(a);
  const B = significant(b);
  if (!A || !B) return false;
  if (A === B) return true;
  const [short, long] = A.length <= B.length ? [A, B] : [B, A];
  if (short.length < MIN_NATIONAL_DIGITS || !long.endsWith(short)) return false;
  const ccLen = long.length - short.length;
  return ccLen >= MIN_CC_PREFIX && ccLen <= MAX_CC_PREFIX;
}

/**
 * Origin helpers, turn a phone number / locale into a country, and mint the
 * human-readable lead reference code (origin + channel + date).
 *
 * Example refCode: `CH-WC-260628-A3F2`
 *   CH     country (Switzerland), where the lead is from
 *   WC     channel (web chat), the media they contacted us from
 *   260628 date (YYMMDD)
 *   A3F2   random disambiguator
 */
import type { LeadSource } from "./types";

export type Country = { code: string; name: string };

/** Longest-prefix-first so +355 (AL) wins over +35, +1 stays last, etc. */
const PHONE_PREFIXES: { prefix: string; code: string; name: string }[] = [
  { prefix: "+355", code: "AL", name: "Albania" },
  { prefix: "+353", code: "IE", name: "Ireland" },
  { prefix: "+351", code: "PT", name: "Portugal" },
  { prefix: "+377", code: "MC", name: "Monaco" },
  { prefix: "+41", code: "CH", name: "Switzerland" },
  { prefix: "+49", code: "DE", name: "Germany" },
  { prefix: "+43", code: "AT", name: "Austria" },
  { prefix: "+39", code: "IT", name: "Italy" },
  { prefix: "+33", code: "FR", name: "France" },
  { prefix: "+44", code: "GB", name: "United Kingdom" },
  { prefix: "+31", code: "NL", name: "Netherlands" },
  { prefix: "+32", code: "BE", name: "Belgium" },
  { prefix: "+34", code: "ES", name: "Spain" },
  { prefix: "+46", code: "SE", name: "Sweden" },
  { prefix: "+47", code: "NO", name: "Norway" },
  { prefix: "+45", code: "DK", name: "Denmark" },
  { prefix: "+358", code: "FI", name: "Finland" },
  { prefix: "+30", code: "GR", name: "Greece" },
  { prefix: "+1", code: "US", name: "United States" },
];

const LOCALE_COUNTRY: Record<string, Country> = {
  "de-ch": { code: "CH", name: "Switzerland" },
  "fr-ch": { code: "CH", name: "Switzerland" },
  "it-ch": { code: "CH", name: "Switzerland" },
  "de-at": { code: "AT", name: "Austria" },
  "de-de": { code: "DE", name: "Germany" },
  "de": { code: "DE", name: "Germany" },
  "it-it": { code: "IT", name: "Italy" },
  "it": { code: "IT", name: "Italy" },
  "fr-fr": { code: "FR", name: "France" },
  "fr": { code: "FR", name: "France" },
  "sq-al": { code: "AL", name: "Albania" },
  "sq": { code: "AL", name: "Albania" },
};

/** Normalise a phone string and match its international dialling prefix. */
export function countryFromPhone(phone?: string | null): Country | null {
  if (!phone) return null;
  let p = phone.replace(/[\s()-]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (!p.startsWith("+")) return null;
  for (const e of PHONE_PREFIXES) {
    if (p.startsWith(e.prefix)) return { code: e.code, name: e.name };
  }
  return null;
}

export function countryFromLocale(locale?: string | null): Country | null {
  if (!locale) return null;
  const l = locale.toLowerCase();
  return LOCALE_COUNTRY[l] ?? LOCALE_COUNTRY[l.split("-")[0]] ?? null;
}

/** Best-effort origin: phone dialling code first (most reliable), then locale. */
export function inferCountry(opts: {
  phone?: string | null;
  locale?: string | null;
}): Country | null {
  return countryFromPhone(opts.phone) ?? countryFromLocale(opts.locale);
}

const CHANNEL_CODE: Record<LeadSource, string> = {
  web_form: "WF",
  instagram: "IG",
  whatsapp: "WA",
  messenger: "MS",
  webchat: "WC",
  email: "EM",
  referral: "RF",
  walk_in: "WI",
  other: "OT",
};

export function channelCode(source: LeadSource): string {
  return CHANNEL_CODE[source] ?? "OT";
}

function yymmdd(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getFullYear() % 100)}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

/** Mint a lead reference: COUNTRY-CHANNEL-YYMMDD-RAND. */
export function makeRefCode(opts: {
  countryCode?: string | null;
  source: LeadSource;
  date?: Date;
}): string {
  const country = (opts.countryCode || "XX").toUpperCase();
  const date = opts.date ?? new Date();
  const rand = (globalThis.crypto?.randomUUID?.() ?? `${Math.random()}`)
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 4)
    .toUpperCase();
  return `${country}-${channelCode(opts.source)}-${yymmdd(date)}-${rand}`;
}

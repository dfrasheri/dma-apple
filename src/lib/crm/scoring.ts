/**
 * Lead scoring (✚ derived). Pure + deterministic so it can run on create, on
 * edit, and in tests identically. Returns a 0–100 score plus the factor
 * breakdown the lead detail page shows ("why this score?").
 */
import type { LeadSource } from "./types";

export type ScoreInput = {
  source?: LeadSource;
  service?: string | null;
  valueEstimate?: number | null;
  contact?: {
    email?: string | null;
    phone?: string | null;
    country?: string | null;
    city?: string | null;
  } | null;
  /** Optional market signal for the contact's city. */
  market?: {
    affluenceIndex?: number | null;
    medicalTourismDemand?: string | null;
  } | null;
};

export type ScoreFactor = { label: string; points: number };

const SOURCE_POINTS: Record<LeadSource, number> = {
  web_form: 25,
  referral: 25,
  whatsapp: 18,
  instagram: 15,
  messenger: 12,
  webchat: 12,
  email: 10,
  walk_in: 8,
  other: 5
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

export function scoreLead(input: ScoreInput): {
  score: number;
  factors: ScoreFactor[];
} {
  const factors: ScoreFactor[] = [];
  const push = (label: string, points: number) => {
    if (points) factors.push({ label, points });
  };

  push("Base", 10);
  push(`Source: ${input.source ?? "other"}`, SOURCE_POINTS[input.source ?? "other"]);

  if (input.contact?.email) push("Has email", 8);
  if (input.contact?.phone) push("Has phone", 8);
  if (input.contact?.country) push("Country known", 4);

  if (input.service && input.service.trim()) push("Service of interest", 10);

  if (input.valueEstimate && input.valueEstimate > 0) {
    push("Est. deal value", clamp(Math.round(input.valueEstimate / 200), 0, 20));
  }

  if (input.market?.affluenceIndex != null) {
    push("Market affluence", Math.round((input.market.affluenceIndex / 100) * 15));
  }
  if (input.market?.medicalTourismDemand === "high") push("High-demand market", 8);
  else if (input.market?.medicalTourismDemand === "medium") push("Medium-demand market", 4);

  const score = clamp(factors.reduce((sum, f) => sum + f.points, 0));
  return { score, factors };
}

/**
 * Affiliates service, referral partners and patient referrers.
 *
 * An affiliate owns a short `code` used in `…/?ref=CODE`. Leads carry the
 * `affiliateId` they were attributed to (resolved from the ref code at intake),
 * so "what each link brought" is just an aggregation over leads. Patient
 * referral links (for the preventiv / treatment plan) are affiliates of
 * `kind: "patient"`, minted on demand per patient.
 */
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { affiliates, leads, type Affiliate } from "@/db/schema";
import { SITE_URL } from "@/lib/seo";
import type { AffiliateKind, AffiliateStatus } from "../types";

export type AffiliateStats = {
  leadsBrought: number;
  won: number;
  pipelineValue: number;
  wonValue: number;
  conversion: number; // 0–1
};

export type AffiliateWithStats = Affiliate & { link: string; stats: AffiliateStats };

/** The public referral URL for a code. */
export function affiliateLink(code: string): string {
  const base = (SITE_URL || "https://dentalmedaustria.com").replace(/\/$/, "");
  return `${base}/?ref=${code}`;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "dma";
}

function rand(n: number): string {
  const src = (globalThis.crypto?.randomUUID?.() ?? `${Math.random()}${Math.random()}`).replace(
    /[^a-z0-9]/gi,
    "",
  );
  return src.slice(0, n).toUpperCase();
}

/** A unique code derived from a seed name, guaranteed not to collide. */
function uniqueCode(seed: string): string {
  for (let i = 0; i < 25; i++) {
    const code = `${slug(seed)}${rand(i < 5 ? 3 : 5)}`.toUpperCase();
    const exists = db.select({ id: affiliates.id }).from(affiliates).where(eq(affiliates.code, code)).get();
    if (!exists) return code;
  }
  return `DMA${rand(8)}`;
}

export type CreateAffiliateInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  kind?: AffiliateKind;
  status?: AffiliateStatus;
  commissionPct?: number | null;
  company?: string | null;
  website?: string | null;
  audience?: string | null;
  notes?: string | null;
  code?: string | null;
};

export function createAffiliate(input: CreateAffiliateInput): Affiliate {
  const code = (input.code && input.code.trim().toUpperCase()) || uniqueCode(input.name);
  return db
    .insert(affiliates)
    .values({
      code,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      kind: input.kind ?? "partner",
      status: input.status ?? "active",
      commissionPct: input.commissionPct ?? null,
      company: input.company ?? null,
      website: input.website ?? null,
      audience: input.audience ?? null,
      notes: input.notes ?? null,
    })
    .returning()
    .get();
}

/** Public help-desk registration → a pending partner application. */
export function registerAffiliate(input: CreateAffiliateInput): Affiliate {
  return createAffiliate({ ...input, kind: "partner", status: "pending" });
}

export function getByCode(code: string): Affiliate | undefined {
  if (!code) return undefined;
  return db
    .select()
    .from(affiliates)
    .where(eq(affiliates.code, code.trim().toUpperCase()))
    .get();
}

/** Resolve a ref code to an affiliate id for lead attribution (any status). */
export function resolveAffiliateId(code?: string | null): string | null {
  if (!code) return null;
  return getByCode(code)?.id ?? null;
}

/**
 * Get (or mint) the patient referral affiliate for a treated patient, so their
 * preventiv can carry a personal share link. Deduped by email when present.
 */
export function referralForPatient(patient: {
  name: string;
  email?: string | null;
  phone?: string | null;
}): { affiliate: Affiliate; link: string } {
  const email = patient.email?.trim().toLowerCase() || null;
  let existing: Affiliate | undefined;
  if (email) {
    existing = db
      .select()
      .from(affiliates)
      .where(and(eq(affiliates.email, email), eq(affiliates.kind, "patient")))
      .get();
  }
  const affiliate =
    existing ??
    createAffiliate({
      name: patient.name,
      email: patient.email ?? null,
      phone: patient.phone ?? null,
      kind: "patient",
      status: "active",
      notes: "Auto-created patient referrer (preventiv share link).",
    });
  return { affiliate, link: affiliateLink(affiliate.code) };
}

/** Every affiliate with what its link brought. */
export function listWithStats(): AffiliateWithStats[] {
  const all = db.select().from(affiliates).orderBy(desc(affiliates.createdAt)).all();

  const agg = db
    .select({
      affiliateId: leads.affiliateId,
      total: sql<number>`count(*)`,
      won: sql<number>`sum(case when ${leads.stage} = 'won' then 1 else 0 end)`,
      value: sql<number>`coalesce(sum(${leads.valueEstimate}), 0)`,
      wonValue: sql<number>`coalesce(sum(case when ${leads.stage} = 'won' then ${leads.valueEstimate} else 0 end), 0)`,
    })
    .from(leads)
    .where(isNotNull(leads.affiliateId))
    .groupBy(leads.affiliateId)
    .all();

  const byId = new Map(agg.map((r) => [r.affiliateId, r]));

  return all.map((a) => {
    const r = byId.get(a.id);
    const leadsBrought = Number(r?.total ?? 0);
    const won = Number(r?.won ?? 0);
    return {
      ...a,
      link: affiliateLink(a.code),
      stats: {
        leadsBrought,
        won,
        pipelineValue: Number(r?.value ?? 0),
        wonValue: Number(r?.wonValue ?? 0),
        conversion: leadsBrought > 0 ? won / leadsBrought : 0,
      },
    };
  });
}

/**
 * Market-intelligence service, per-city affluence & demand (◆ sourced, annual).
 * Feeds lead scoring (`scoring.ts` via leads service) and adds context to the
 * competitor map.
 */
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { marketStats, type MarketStat } from "@/db/schema";
import type { MarketUpsertInput } from "../schemas";

const now = () => new Date();

export async function listMarket(): Promise<MarketStat[]> {
  return db.select().from(marketStats).orderBy(desc(marketStats.affluenceIndex)).all();
}

export async function getByCity(city: string): Promise<MarketStat | null> {
  return db.select().from(marketStats).where(eq(marketStats.city, city)).get() ?? null;
}

export async function upsertMarket(input: MarketUpsertInput): Promise<MarketStat> {
  const existing = db
    .select()
    .from(marketStats)
    .where(and(eq(marketStats.city, input.city), eq(marketStats.year, input.year)))
    .get();

  const values = {
    city: input.city,
    country: input.country ?? null,
    affluenceIndex: input.affluenceIndex ?? null,
    medianIncome: input.medianIncome ?? null,
    population: input.population ?? null,
    medicalTourismDemand: input.medicalTourismDemand ?? null,
    topProcedures: input.topProcedures ?? null,
    source: input.source ?? null,
    year: input.year,
    notes: input.notes ?? null
  };

  if (existing) {
    return db
      .update(marketStats)
      .set({ ...values, updatedAt: now() })
      .where(eq(marketStats.id, existing.id))
      .returning()
      .get();
  }
  return db.insert(marketStats).values(values).returning().get();
}

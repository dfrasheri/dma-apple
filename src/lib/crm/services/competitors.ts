/**
 * Competitor-map service.
 *
 * Two clearly-separated halves:
 *   - PUBLIC display: name/website (◆ OSM), a derived public IG profile URL
 *     (✚, parsed from the website), and a human-maintained ESTIMATED price band
 *     (✎, never scraped).
 *   - PRIVATE harvest (followers/engagement/posts): NOT IMPLEMENTED, out of
 *     scope by design (ToS / anti-bot).
 */
import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { competitors, type Competitor } from "@/db/schema";
import { resolveInstagramFromWebsite } from "../connectors/instagram-fetch";
import type { CompetitorCreateInput, CompetitorUpdateInput } from "../schemas";

const now = () => new Date();
const blankToNull = (v?: string | null) => (v && v.trim() ? v : null);

export async function listCompetitors(): Promise<Competitor[]> {
  return db.select().from(competitors).orderBy(asc(competitors.city), asc(competitors.name)).all();
}

export async function getCompetitor(id: string): Promise<Competitor | null> {
  return db.select().from(competitors).where(eq(competitors.id, id)).get() ?? null;
}

export async function createCompetitor(input: CompetitorCreateInput): Promise<Competitor> {
  return db
    .insert(competitors)
    .values({
      name: input.name,
      city: input.city ?? null,
      country: input.country ?? null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      website: blankToNull(input.website),
      instagramUrl: blankToNull(input.instagramUrl),
      priceBand: input.priceBand ?? null,
      priceSource: input.priceSource ?? null,
      priceUpdatedAt: input.priceBand ? now() : null,
      services: input.services ?? null,
      rating: input.rating ?? null,
      notes: input.notes ?? null
    })
    .returning()
    .get();
}

export async function updateCompetitor(
  id: string,
  patch: CompetitorUpdateInput
): Promise<Competitor | null> {
  const set: Partial<Competitor> = { updatedAt: now() };
  if (patch.name !== undefined) set.name = patch.name;
  if (patch.city !== undefined) set.city = patch.city;
  if (patch.country !== undefined) set.country = patch.country;
  if (patch.lat !== undefined) set.lat = patch.lat;
  if (patch.lng !== undefined) set.lng = patch.lng;
  if (patch.website !== undefined) set.website = blankToNull(patch.website);
  if (patch.instagramUrl !== undefined) set.instagramUrl = blankToNull(patch.instagramUrl);
  if (patch.priceSource !== undefined) set.priceSource = patch.priceSource;
  if (patch.services !== undefined) set.services = patch.services;
  if (patch.rating !== undefined) set.rating = patch.rating;
  if (patch.notes !== undefined) set.notes = patch.notes;
  if (patch.priceBand !== undefined) {
    set.priceBand = patch.priceBand;
    set.priceUpdatedAt = now();
  }
  db.update(competitors).set(set).where(eq(competitors.id, id)).run();
  return getCompetitor(id);
}

export async function deleteCompetitor(id: string): Promise<void> {
  db.delete(competitors).where(eq(competitors.id, id)).run();
}

/** Derive the public IG profile URL from the competitor's website (✚ derived). */
export async function resolveInstagram(id: string): Promise<Competitor | null> {
  const c = await getCompetitor(id);
  if (!c?.website) return c;
  const url = await resolveInstagramFromWebsite(c.website);
  db.update(competitors)
    .set({ instagramUrl: url, igCheckedAt: now(), updatedAt: now() })
    .where(eq(competitors.id, id))
    .run();
  return getCompetitor(id);
}

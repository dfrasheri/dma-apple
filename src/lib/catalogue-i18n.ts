// Locale-aware resolution of catalogue treatment content + rich sections.
// English is the source of truth; for `sq` we prefer the hand-translated overlay
// (catalogue-content-sq.ts) and fall back to the English resolver when a slug is
// not yet translated. Server-only (imports the large SQ content overlay).
import type { Locale } from "./dictionaries";
import type { CatalogueCategory, CatalogueService } from "./catalogue";
import type { TreatmentContent } from "./catalogue-content";
import type { ProcedureSections } from "./catalogue-sections";
import { CATEGORY_PROCESS, getTreatmentContent } from "./catalogue-content";
import { resolveProcedureSections } from "./catalogue-sections";
import { CATALOGUE_CONTENT_SQ, PROCEDURE_SECTIONS_SQ } from "./catalogue-content-sq";

/** Treatment content for a slug in the active locale (falls back to English). */
export function localizedTreatmentContent(
  slug: string,
  locale: Locale,
): TreatmentContent | undefined {
  if (locale === "sq" && CATALOGUE_CONTENT_SQ[slug]) return CATALOGUE_CONTENT_SQ[slug];
  return getTreatmentContent(slug);
}

/** Rich landing-page sections for a service in the active locale (falls back to English). */
export function localizedSections(
  service: CatalogueService,
  category: CatalogueCategory | undefined,
  content: TreatmentContent,
  locale: Locale,
): ProcedureSections {
  if (locale === "sq" && PROCEDURE_SECTIONS_SQ[service.slug]) {
    return PROCEDURE_SECTIONS_SQ[service.slug];
  }
  const process = CATEGORY_PROCESS[service.category] ?? [];
  return resolveProcedureSections(service, category, content, process);
}

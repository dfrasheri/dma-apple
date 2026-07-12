/**
 * Dump the live DMAWEB clinic knowledge (CLINIC_PROFILE + KNOWLEDGE) into the
 * standalone GHL-CRM's snapshot file so the CRM chatbot grounds on exactly the
 * same facts as the website. The website is the single source of truth; this
 * script is the one-way refresh. Re-run after any site content change:
 *
 *   npx tsx scripts/dump-knowledge.mts
 */
import { writeFileSync } from "node:fs";
import { CLINIC_PROFILE, KNOWLEDGE } from "../src/lib/clinic-knowledge";

const OUT = "C:/Users/frash/GHL-CRM/src/lib/clinic-knowledge.json";

const snapshot = {
  profile: CLINIC_PROFILE,
  knowledge: KNOWLEDGE,
};

writeFileSync(OUT, JSON.stringify(snapshot, null, 2), "utf8");

const kinds = new Set(KNOWLEDGE.map((e) => e.kind));
console.log(`Wrote ${OUT}`);
console.log(`  entries: ${KNOWLEDGE.length}`);
console.log(`  kinds:   ${[...kinds].sort().join(", ")}`);
console.log(`  safety:  ${KNOWLEDGE.filter((e) => e.kind === "safety").length} entries`);
console.log(`  standards: ${CLINIC_PROFILE.standards.join(" | ")}`);

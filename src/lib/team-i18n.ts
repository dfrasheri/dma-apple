// Helper to localise a team member's role label. The English role string lives
// in lib/pages.ts (the source); here we map it to a dictionary key so server
// pages can render it in the active locale. Bio paragraphs stay English by policy.
import type { Bio } from "@/lib/pages";

const ROLE_KEYS: Record<string, string> = {
  // Leadership (non-clinical) roles: the dictionary values behind this key
  // read "Founder & Managing Director" in every locale.
  "Founder & Managing Director": "role.founder-managing-director",
};

/** Return the localized role for a bio, falling back to the English source. */
export function localizedRole(t: (key: string) => string, bio: Bio): string {
  const key = ROLE_KEYS[bio.role];
  return key ? t(key) : bio.role;
}

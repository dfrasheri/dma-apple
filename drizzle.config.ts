import type { Config } from "drizzle-kit";

/**
 * Drizzle config for the Dental Med Austria CRM.
 *
 * SQLite today (file `crm.db`), but the schema in `src/db/schema.ts` is written
 * dialect-portable — moving to Postgres later is a driver + dialect change here,
 * not a rewrite.
 */
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.CRM_DB_PATH ?? "crm.db"
  },
  strict: true,
  verbose: true
} satisfies Config;

/**
 * CRM database client (better-sqlite3 + Drizzle).
 *
 * A process-wide singleton, Next.js hot-reload would otherwise open a new
 * SQLite handle on every change. Only ever imported from Node-runtime code
 * (route handlers, server components, scripts), never from middleware (edge).
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const dbPath = process.env.CRM_DB_PATH ?? "crm.db";

const globalForDb = globalThis as unknown as {
  __crmSqlite?: Database.Database;
};

const sqlite = globalForDb.__crmSqlite ?? new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalForDb.__crmSqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export { schema };
export type DB = typeof db;

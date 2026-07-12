/**
 * Apply generated Drizzle migrations to the SQLite database.
 * Run with: `npm run db:migrate`
 */
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./client";

migrate(db, { migrationsFolder: "./drizzle" });
console.log("✓ CRM migrations applied");

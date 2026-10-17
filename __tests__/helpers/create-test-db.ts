import { drizzle } from "drizzle-orm/sql-js"
import { migrate } from "drizzle-orm/sql-js/migrator"
import initSqlJs from "sql.js"

import * as schema from "~/database/drizzle/schema"

import { fileURLToPath } from "node:url"

const MIGRATIONS_FOLDER = fileURLToPath(
  new URL("../../drizzle", import.meta.url),
)

/**
 * In-memory SQLite database with every app migration applied, for tests that
 * need real SQL (balance, ledger, recurring sync).
 *
 * The app's own `drizzleDb` opens `expo-sqlite`, which does not exist in Node.
 * A test swaps it for this one:
 *
 * ```ts
 * vi.mock("~/database/drizzle/db", async () => {
 *   const { createTestDb } = await import("@tests/helpers/create-test-db")
 *   return { drizzleDb: await createTestDb() }
 * })
 * ```
 *
 * Boundary: sql.js is synchronous, like the app's driver, so `transaction()`
 * callbacks and `.all()`/`.get()` behave the same. It does not model
 * `expo-sqlite` (WAL, `busy_timeout`, the change listener), so contention and
 * `SQLITE_BUSY` retry paths in the write queue are not testable here.
 */
export async function createTestDb() {
  const SQL = await initSqlJs()
  const sqlite = new SQL.Database()
  sqlite.run("PRAGMA foreign_keys=ON;")

  const db = drizzle(sqlite, { schema })
  migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
  return db
}

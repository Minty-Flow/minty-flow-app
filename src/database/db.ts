import * as SQLite from "expo-sqlite"

import { runSqliteMigrationsSync } from "./migrations/sqlite-runner"

/**
 * Module-level singleton. `null` until first {@link getDb} call.
 * @internal
 */
let DB: SQLite.SQLiteDatabase | null = null

/**
 * Returns the app-wide SQLite database singleton, opening and configuring it
 * on first access.
 *
 * **Pragmas applied once at open time:**
 * - `journal_mode=WAL` — concurrent reads don't block writes; safer on mobile.
 * - `foreign_keys=ON` — enforces FK constraints (off by default in SQLite).
 * - `busy_timeout=5000` — retries for up to 5 s before throwing `SQLITE_BUSY`,
 *   giving the write-queue time to drain under contention.
 *
 * **Migrations** run synchronously before the instance is returned, so callers
 * always see a fully up-to-date schema.
 *
 * @returns The open {@link SQLite.SQLiteDatabase} instance.
 *
 * @example
 * ```ts
 * const db = getDb()
 * const rows = await db.getAllAsync<RowAccount>("SELECT * FROM accounts")
 * ```
 */
export function getDb(): SQLite.SQLiteDatabase {
  if (DB) return DB

  const db = SQLite.openDatabaseSync("minty_flow_db_v2")

  db.execSync(`
    PRAGMA journal_mode=WAL;
    PRAGMA foreign_keys=ON;
    PRAGMA busy_timeout=5000;
  `)

  DB = db

  runSqliteMigrationsSync(db)

  return db
}

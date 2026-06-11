import type { SQLiteDatabase } from "expo-sqlite"

import { SQLITE_V1_SQL, SQLITE_V1_VERSION } from "./sqlite-v1"
import { SQLITE_V2_SQL, SQLITE_V2_VERSION } from "./sqlite-v2"

/**
 * A migration step. Use `sql` for pure DDL strings (executed via `execSync`),
 * or `run` for migrations that need procedural logic — orphan cleanup,
 * conditional rebuilds, pragma toggling around transactions, etc.
 *
 * @internal
 */
type Migration =
  | { version: number; sql: string }
  | { version: number; run: (db: SQLiteDatabase) => void }

/**
 * Ordered list of all schema migrations.
 *
 * Each entry carries a monotonically increasing integer `version`. Add new
 * migrations by appending to this array — never reorder or mutate existing
 * entries.
 *
 * @internal
 */
const migrations: Migration[] = [
  { version: SQLITE_V1_VERSION, sql: SQLITE_V1_SQL },
  { version: SQLITE_V2_VERSION, sql: SQLITE_V2_SQL },
]

/**
 * Apply any pending schema migrations **synchronously** at database open time.
 *
 * Uses SQLite's built-in `PRAGMA user_version` as the migration version
 * counter. For each migration whose `version` exceeds the current
 * `user_version`, the migration is executed and `user_version` is bumped.
 * Migrations are applied in ascending version order.
 *
 * If a migration throws, `user_version` is NOT bumped — the next launch will
 * retry the migration. Migrations themselves are responsible for atomicity
 * (wrap mutation in `BEGIN`/`COMMIT` so a failure leaves the prior schema
 * intact).
 *
 * **Why synchronous:** `getDb()` is called in module initialization paths
 * (e.g. Zustand store hydration) where async is impractical. The first-open
 * migration cost is paid once per install or schema upgrade.
 *
 * @param db - An open `SQLiteDatabase` instance (must have `PRAGMA
 *   foreign_keys=ON` and `journal_mode=WAL` already set).
 */
export function runSqliteMigrationsSync(db: SQLiteDatabase): void {
  const row = db.getFirstSync<{ user_version: number }>("PRAGMA user_version")
  const currentVersion = row?.user_version ?? 0

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      if ("sql" in migration) {
        db.execSync(migration.sql)
      } else {
        migration.run(db)
      }
      db.execSync(`PRAGMA user_version = ${migration.version}`)
    }
  }
}

import type { SQLiteDatabase } from "expo-sqlite"

import {
  assertSqliteV3State,
  bootstrapSqliteV3,
  SQLITE_V3_VERSION,
} from "./sqlite-v3"

/**
 * Apply any pending schema migrations **synchronously** at database open time.
 *
 * Fresh installs bootstrap directly into the current schema. Existing installs
 * must already be on schema v3, which is the integer-money schema introduced
 * in v0.0.7. Older databases are intentionally no longer supported once the
 * decimal-era migration path is retired.
 *
 * @param db - An open `SQLiteDatabase` instance (must have `PRAGMA
 *   foreign_keys=ON` and `journal_mode=WAL` already set).
 */
export function runSqliteMigrationsSync(db: SQLiteDatabase): void {
  const row = db.getFirstSync<{ user_version: number }>("PRAGMA user_version")
  const currentVersion = row?.user_version ?? 0

  if (currentVersion === 0) {
    bootstrapSqliteV3(db)
    return
  }

  if (currentVersion !== SQLITE_V3_VERSION) {
    throw new Error(
      `Unsupported database schema version ${currentVersion}. Upgrade through v0.0.7 before installing this release.`,
    )
  }

  assertSqliteV3State(db)
}

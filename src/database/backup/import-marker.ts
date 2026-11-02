import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"

import type { MintyFlowBackup } from "./backup-format"

/**
 * An import writes a pre-import snapshot to disk, wipes the tables and inserts
 * the backup. The snapshot file alone cannot say whether the import finished:
 * a kill after the insert commits but before the file is deleted looks the
 * same as a kill mid-import.
 *
 * The marker settles it. The import stamps a random number into the snapshot
 * file and writes the same number to `PRAGMA user_version` inside the insert
 * transaction. `user_version` lives in the database header, so it commits and
 * rolls back with that transaction and needs no table or migration.
 */
export type ImportSnapshot = MintyFlowBackup & { importMarker?: number }

type Db = Pick<typeof drizzleDb, "all" | "run">

// SQLite stores user_version as a signed 32-bit integer.
const MAX_MARKER = 2_147_483_646

export function readImportMarker(db: Db = drizzleDb): number {
  const rows = db.all<{ v: number }>(
    sql.raw("SELECT user_version AS v FROM pragma_user_version"),
  )
  return rows[0]?.v ?? 0
}

export function writeImportMarker(db: Db, marker: number): void {
  if (!Number.isInteger(marker) || marker < 0 || marker > MAX_MARKER) {
    throw new Error(`Invalid import marker ${marker}`)
  }
  db.run(sql.raw(`PRAGMA user_version = ${marker}`))
}

/** A fresh non-zero marker that differs from the one already in the database. */
export function newImportMarker(current: number): number {
  let marker = current
  while (marker === current || marker === 0) {
    marker = 1 + Math.floor(Math.random() * MAX_MARKER)
  }
  return marker
}

/**
 * True when the snapshot's import already committed, so the snapshot is stale
 * and must not be replayed over the imported data. Snapshots written before
 * the marker existed carry none and are always replayed.
 */
export function isImportCommitted(
  snapshot: ImportSnapshot,
  db: Db = drizzleDb,
): boolean {
  const marker = snapshot.importMarker
  return (
    typeof marker === "number" &&
    marker !== 0 &&
    readImportMarker(db) === marker
  )
}

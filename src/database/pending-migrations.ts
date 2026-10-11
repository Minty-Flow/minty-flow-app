import { getDb } from "~/database/db"

interface MigrationBundle {
  journal: { entries: { when: number }[] }
}

function tableExists(name: string): boolean {
  return (
    getDb().getFirstSync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`,
      name,
    ) != null
  )
}

function hasUserData(): boolean {
  const db = getDb()
  return (
    db.getFirstSync(`SELECT 1 AS x FROM accounts LIMIT 1`) != null ||
    db.getFirstSync(`SELECT 1 AS x FROM transactions LIMIT 1`) != null
  )
}

/**
 * Whether an existing database holds user data and still has migrations to
 * apply. Fresh installs (no migration table yet), up-to-date databases and
 * empty databases have nothing at risk, so they return false.
 */
export function hasPendingMigrationsWithData(
  migrations: MigrationBundle,
): boolean {
  if (!tableExists("__drizzle_migrations")) return false

  const last = getDb().getFirstSync<{ created_at: number | string | null }>(
    `SELECT created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1`,
  )
  const latest = Math.max(...migrations.journal.entries.map((e) => e.when))
  if (Number(last?.created_at ?? 0) >= latest) return false

  return hasUserData()
}

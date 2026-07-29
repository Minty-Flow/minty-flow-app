import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { generateInternalJsonBackup } from "~/database/services/data-management-service"

const REQUIRED_TABLES = [
  "categories",
  "tags",
  "accounts",
  "recurring_transactions",
  "budgets",
  "goals",
  "loans",
  "transactions",
  "transfers",
  "transaction_tags",
  "budget_accounts",
  "budget_categories",
  "goal_accounts",
]

// TODO(remove-after-drizzle-rollout): compatibility bootstrap for users upgrading
// from the pre-Drizzle SQLite schema. Delete once old v3 installs are no longer supported.

function tableExists(name: string): boolean {
  return (
    drizzleDb.get<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${name}`,
    ) != null
  )
}

interface DrizzleMigrationBundle {
  journal: {
    entries: { when: number }[]
  }
}

function latestMigrationMs(migrations: DrizzleMigrationBundle): number {
  return Math.max(...migrations.journal.entries.map((entry) => entry.when))
}

export function isDrizzleBaselineApplied(
  migrations: DrizzleMigrationBundle,
): boolean {
  if (!tableExists("__drizzle_migrations")) return false
  try {
    const row = drizzleDb.get<{ created_at: number | string | null }>(
      sql`SELECT created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1`,
    )
    return Number(row?.created_at ?? 0) >= latestMigrationMs(migrations)
  } catch {
    return false
  }
}

export function needsForcedDrizzleMigration(
  migrations: DrizzleMigrationBundle,
): boolean {
  if (isDrizzleBaselineApplied(migrations)) return false

  const existingTables = REQUIRED_TABLES.filter(tableExists)
  if (existingTables.length === 0) return false
  if (existingTables.length !== REQUIRED_TABLES.length) {
    throw new Error("Existing database schema is incomplete.")
  }
  return true
}

export async function exportLegacyDbForForcedMigration(): Promise<{
  uri: string
  fileName: string
}> {
  return generateInternalJsonBackup("minty-flow-drizzle-migration")
}

export function markLegacyDbAsDrizzleBaseline(
  migrations: DrizzleMigrationBundle,
): void {
  drizzleDb.run(
    sql.raw(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at numeric
    );
  `),
  )
  drizzleDb.run(sql`
    UPDATE loans
    SET loan_type = lower(loan_type)
    WHERE loan_type IN (${"LENT"}, ${"BORROWED"})
  `)
  for (const entry of migrations.journal.entries) {
    drizzleDb.run(sql`
      INSERT INTO "__drizzle_migrations" ("hash", "created_at")
      SELECT ${""}, ${entry.when}
      WHERE NOT EXISTS (
        SELECT 1 FROM "__drizzle_migrations" WHERE created_at = ${entry.when}
      )
    `)
  }
}

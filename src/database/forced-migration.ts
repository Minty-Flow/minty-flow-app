import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { generateInternalJsonBackup } from "~/database/services/data-management-service"

const REQUIRED_SCHEMA = {
  categories: [
    "id",
    "name",
    "type",
    "icon",
    "color_scheme_name",
    "created_at",
    "updated_at",
  ],
  tags: [
    "id",
    "name",
    "type",
    "color_scheme_name",
    "icon",
    "created_at",
    "updated_at",
  ],
  accounts: [
    "id",
    "name",
    "type",
    "balance",
    "currency_code",
    "icon",
    "color_scheme_name",
    "is_primary",
    "exclude_from_balance",
    "is_archived",
    "sort_order",
    "created_at",
    "updated_at",
  ],
  recurring_transactions: [
    "id",
    "json_transaction_template",
    "transfer_to_account_id",
    "range",
    "rules",
    "last_generated_transaction_date",
    "disabled",
    "created_at",
  ],
  budgets: [
    "id",
    "name",
    "amount",
    "currency_code",
    "period",
    "start_date",
    "end_date",
    "alert_threshold",
    "is_active",
    "icon",
    "color_scheme_name",
    "created_at",
    "updated_at",
  ],
  goals: [
    "id",
    "name",
    "description",
    "target_amount",
    "currency_code",
    "target_date",
    "icon",
    "color_scheme_name",
    "goal_type",
    "is_archived",
    "created_at",
    "updated_at",
  ],
  loans: [
    "id",
    "name",
    "description",
    "principal_amount",
    "loan_type",
    "due_date",
    "account_id",
    "category_id",
    "icon",
    "color_scheme_name",
    "created_at",
    "updated_at",
  ],
  transactions: [
    "id",
    "account_id",
    "category_id",
    "amount",
    "type",
    "transaction_date",
    "title",
    "description",
    "is_deleted",
    "deleted_at",
    "is_pending",
    "requires_manual_confirmation",
    "account_balance_before",
    "subtype",
    "extra",
    "has_attachments",
    "recurring_id",
    "location",
    "goal_id",
    "budget_id",
    "loan_id",
    "created_at",
    "updated_at",
  ],
  transfers: [
    "id",
    "from_transaction_id",
    "to_transaction_id",
    "from_account_id",
    "to_account_id",
    "conversion_rate",
    "created_at",
    "updated_at",
  ],
  transaction_tags: ["transaction_id", "tag_id"],
  budget_accounts: ["budget_id", "account_id", "created_at"],
  budget_categories: ["budget_id", "category_id", "created_at"],
  goal_accounts: ["goal_id", "account_id", "created_at"],
} as const

const REQUIRED_TABLES = Object.keys(REQUIRED_SCHEMA) as Array<
  keyof typeof REQUIRED_SCHEMA
>

// TODO(remove-after-drizzle-rollout): compatibility bootstrap for users upgrading
// from the pre-Drizzle SQLite schema. Delete once old v3 installs are no longer supported.

function tableExists(name: string): boolean {
  return (
    drizzleDb.get<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${name}`,
    ) != null
  )
}

function tableColumns(table: keyof typeof REQUIRED_SCHEMA): Set<string> {
  const rows = drizzleDb.all<{ name: string }>(
    sql.raw(`PRAGMA table_info("${table}")`),
  )
  return new Set(rows.map((row) => row.name))
}

function missingRequiredColumns(table: keyof typeof REQUIRED_SCHEMA): string[] {
  const existing = tableColumns(table)
  return REQUIRED_SCHEMA[table].filter((column) => !existing.has(column))
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
  const missingColumns = REQUIRED_TABLES.flatMap((table) =>
    missingRequiredColumns(table).map((column) => `${table}.${column}`),
  )
  if (missingColumns.length > 0) {
    throw new Error(
      `Existing database schema is missing required columns: ${missingColumns.join(", ")}`,
    )
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

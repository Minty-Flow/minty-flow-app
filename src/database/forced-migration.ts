import * as SQLite from "expo-sqlite"

import { closeDbSync, getDb } from "~/database/db"
import { resetDrizzleDb } from "~/database/drizzle/db"
import { logger } from "~/utils/logger"

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

const REQUIRED_INDEXES = [
  "idx_accounts_only_one_primary",
  "idx_ba_budget",
  "idx_ba_account",
  "idx_bc_budget",
  "idx_bc_category",
  "idx_ga_goal",
  "idx_ga_account",
  "idx_loan_account",
  "idx_loan_category",
  "idx_ttag_tx",
  "idx_ttag_tag",
  "idx_tx_date",
  "idx_tx_account",
  "idx_tx_category",
  "idx_tx_is_deleted",
  "idx_tx_is_pending",
  "idx_tx_type",
  "idx_tx_goal",
  "idx_tx_budget",
  "idx_tx_loan",
  "idx_tx_loan_deleted",
  "idx_tx_recurring",
  "idx_tx_date_created",
  "idx_transfer_from_tx",
  "idx_transfer_to_tx",
  "transfers_from_transaction_id_unique",
  "transfers_to_transaction_id_unique",
] as const

const REBUILD_ORDER = [
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
] as const satisfies readonly (keyof typeof REQUIRED_SCHEMA)[]

const COPY_SELECTS: Record<keyof typeof REQUIRED_SCHEMA, string> = {
  categories: `
    SELECT id, name, type, icon, color_scheme_name, created_at, updated_at
    FROM "__legacy_categories"
  `,
  tags: `
    SELECT id, name, type, color_scheme_name, icon, created_at, updated_at
    FROM "__legacy_tags"
  `,
  accounts: `
    SELECT id, name, type, balance, currency_code, icon, color_scheme_name, is_primary,
      exclude_from_balance, is_archived, sort_order, created_at, updated_at
    FROM "__legacy_accounts"
  `,
  recurring_transactions: `
    SELECT id, json_transaction_template, transfer_to_account_id, range, rules,
      last_generated_transaction_date, disabled, created_at
    FROM "__legacy_recurring_transactions"
  `,
  budgets: `
    SELECT id, name, amount, currency_code, period, start_date, end_date,
      alert_threshold, is_active, icon, color_scheme_name, created_at, updated_at
    FROM "__legacy_budgets"
  `,
  goals: `
    SELECT id, name, description, target_amount, currency_code, target_date, icon,
      color_scheme_name, goal_type, is_archived, created_at, updated_at
    FROM "__legacy_goals"
  `,
  loans: `
    SELECT id, name, description, principal_amount, lower(loan_type) AS loan_type,
      due_date, account_id, category_id, icon, color_scheme_name, created_at, updated_at
    FROM "__legacy_loans"
  `,
  transactions: `
    SELECT id, account_id, category_id, amount, type, transaction_date, title,
      description, is_deleted, deleted_at, is_pending, requires_manual_confirmation,
      account_balance_before, subtype, extra, has_attachments, recurring_id,
      location, goal_id, budget_id, loan_id, created_at, updated_at
    FROM "__legacy_transactions"
  `,
  transfers: `
    SELECT id, from_transaction_id, to_transaction_id, from_account_id, to_account_id,
      conversion_rate, created_at, updated_at
    FROM "__legacy_transfers"
  `,
  transaction_tags: `
    SELECT transaction_id, tag_id
    FROM "__legacy_transaction_tags"
  `,
  budget_accounts: `
    SELECT budget_id, account_id, created_at
    FROM "__legacy_budget_accounts"
  `,
  budget_categories: `
    SELECT budget_id, category_id, created_at
    FROM "__legacy_budget_categories"
  `,
  goal_accounts: `
    SELECT goal_id, account_id, created_at
    FROM "__legacy_goal_accounts"
  `,
}

const REQUIRED_TABLES = Object.keys(REQUIRED_SCHEMA) as Array<
  keyof typeof REQUIRED_SCHEMA
>

export type DatabaseState = "fresh" | "legacy" | "drizzle"

interface DrizzleMigrationBundle {
  journal: {
    entries: { when: number; idx: number }[]
  }
  migrations: Record<string, string>
}

function quoteIdentifier(name: string): string {
  return `"${name.replaceAll('"', '""')}"`
}

function tableExists(name: string): boolean {
  return (
    getDb().getFirstSync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?`,
      name,
    ) != null
  )
}

function indexExists(name: string): boolean {
  return (
    getDb().getFirstSync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type = 'index' AND name = ?`,
      name,
    ) != null
  )
}

function tableColumns(table: keyof typeof REQUIRED_SCHEMA): Set<string> {
  const rows = getDb().getAllSync<{ name: string }>(
    `PRAGMA table_info(${quoteIdentifier(table)})`,
  )
  return new Set(rows.map((row) => row.name))
}

function missingRequiredColumns(table: keyof typeof REQUIRED_SCHEMA): string[] {
  const existing = tableColumns(table)
  return REQUIRED_SCHEMA[table].filter((column) => !existing.has(column))
}

function hasAllRequiredIndexes(): boolean {
  return REQUIRED_INDEXES.every(indexExists)
}

function hasAllRequiredTablesAndColumns(): boolean {
  return REQUIRED_TABLES.every(
    (table) => tableExists(table) && missingRequiredColumns(table).length === 0,
  )
}

function latestMigrationMs(migrations: DrizzleMigrationBundle): number {
  return Math.max(...migrations.journal.entries.map((entry) => entry.when))
}

export function isDrizzleBaselineApplied(
  migrations: DrizzleMigrationBundle,
): boolean {
  if (!tableExists("__drizzle_migrations")) return false
  if (!hasAllRequiredTablesAndColumns()) return false
  if (!hasAllRequiredIndexes()) return false

  try {
    const row = getDb().getFirstSync<{ created_at: number | string | null }>(
      `SELECT created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1`,
    )
    return Number(row?.created_at ?? 0) >= latestMigrationMs(migrations)
  } catch {
    return false
  }
}

export function getDatabaseState(
  migrations: DrizzleMigrationBundle,
): DatabaseState {
  const existingTables = REQUIRED_TABLES.filter(tableExists)

  if (existingTables.length === 0) return "fresh"

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

  return isDrizzleBaselineApplied(migrations) ? "drizzle" : "legacy"
}

function buildLegacyBackupFileName(): string {
  return `minty-flow-drizzle-migration-${new Date().toISOString().replaceAll(":", "-")}.db`
}

// TODO(remove-after-drizzle-rollout): compatibility bootstrap for users upgrading
// from the pre-Drizzle SQLite schema. Delete once old installs are no longer supported.
export async function exportLegacyDbForForcedMigration(): Promise<{
  uri: string
  fileName: string
}> {
  const fileName = buildLegacyBackupFileName()
  const backupName = fileName.replace(/\.db$/i, "")

  try {
    SQLite.deleteDatabaseSync(backupName, SQLite.defaultDatabaseDirectory)
  } catch {
    // stale backup DB is harmless; overwrite below
  }

  const sourceDb = getDb()
  const backupDb = SQLite.openDatabaseSync(
    backupName,
    { useNewConnection: true },
    SQLite.defaultDatabaseDirectory,
  )

  try {
    SQLite.backupDatabaseSync({
      sourceDatabase: sourceDb,
      destDatabase: backupDb,
    })
  } finally {
    backupDb.closeSync()
  }

  const verifiedBackup = SQLite.openDatabaseSync(
    backupName,
    { useNewConnection: true },
    SQLite.defaultDatabaseDirectory,
  )
  try {
    verifiedBackup.getFirstSync("SELECT name FROM sqlite_master LIMIT 1")
    return {
      uri: verifiedBackup.databasePath,
      fileName,
    }
  } finally {
    verifiedBackup.closeSync()
  }
}

function execSync(db: SQLite.SQLiteDatabase, source: string): void {
  db.execSync(source)
}

function seedDrizzleMigrations(
  db: SQLite.SQLiteDatabase,
  migrations: DrizzleMigrationBundle,
): void {
  execSync(
    db,
    `
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at numeric
      );
    `,
  )

  for (const entry of migrations.journal.entries) {
    db.runSync(
      `INSERT INTO "__drizzle_migrations" ("hash", "created_at")
       SELECT ?, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM "__drizzle_migrations" WHERE created_at = ?
       )`,
      "",
      entry.when,
      entry.when,
    )
  }
}

function createCurrentSchema(
  db: SQLite.SQLiteDatabase,
  migrations: DrizzleMigrationBundle,
): void {
  for (const entry of migrations.journal.entries) {
    const key = `m${entry.idx.toString().padStart(4, "0")}`
    const source = migrations.migrations[key]
    if (!source) {
      throw new Error(`Missing migration SQL for ${key}`)
    }
    for (const statement of source
      .split("--> statement-breakpoint")
      .map((stmt) => stmt.trim())
      .filter(Boolean)) {
      execSync(db, statement)
    }
  }
}

function renameLegacyTables(db: SQLite.SQLiteDatabase): void {
  for (const table of REQUIRED_TABLES) {
    execSync(
      db,
      `ALTER TABLE ${quoteIdentifier(table)} RENAME TO ${quoteIdentifier(`__legacy_${table}`)};`,
    )
  }
}

function copyLegacyData(db: SQLite.SQLiteDatabase): void {
  for (const table of REBUILD_ORDER) {
    const columns = REQUIRED_SCHEMA[table].join(", ")
    execSync(
      db,
      `INSERT INTO ${quoteIdentifier(table)} (${columns}) ${COPY_SELECTS[table].trim()};`,
    )
  }
}

function dropLegacyTables(db: SQLite.SQLiteDatabase): void {
  for (const table of [...REBUILD_ORDER].reverse()) {
    execSync(db, `DROP TABLE ${quoteIdentifier(`__legacy_${table}`)};`)
  }
}

function assertForeignKeysValid(db: SQLite.SQLiteDatabase): void {
  const violations = db.getAllSync<{
    table: string
    rowid: number
    parent: string
    fkid: number
  }>("PRAGMA foreign_key_check")

  if (violations.length > 0) {
    const summary = violations
      .slice(0, 5)
      .map(
        (row) =>
          `${row.table}(rowid=${row.rowid}) -> ${row.parent} [fk ${row.fkid}]`,
      )
      .join(", ")
    throw new Error(`Foreign key validation failed after rebuild: ${summary}`)
  }
}

export function upgradeLegacyDbToDrizzle(
  migrations: DrizzleMigrationBundle,
): void {
  const db = getDb()

  execSync(db, `PRAGMA foreign_keys = OFF;`)
  execSync(db, `BEGIN IMMEDIATE;`)

  try {
    execSync(db, `DROP TABLE IF EXISTS "__drizzle_migrations";`)
    renameLegacyTables(db)
    createCurrentSchema(db, migrations)
    copyLegacyData(db)
    seedDrizzleMigrations(db, migrations)
    assertForeignKeysValid(db)
    dropLegacyTables(db)
    execSync(db, `COMMIT;`)
  } catch (error) {
    try {
      execSync(db, `ROLLBACK;`)
    } catch (rollbackError) {
      logger.error("Forced DB migration rollback failed", {
        error:
          rollbackError instanceof Error
            ? rollbackError.message
            : String(rollbackError),
      })
    }
    throw error
  } finally {
    execSync(db, `PRAGMA foreign_keys = ON;`)
  }

  closeDbSync()
  resetDrizzleDb()
}

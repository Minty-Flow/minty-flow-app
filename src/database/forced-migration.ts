import { File } from "expo-file-system"
import * as FileSystem from "expo-file-system/legacy"
import * as SQLite from "expo-sqlite"
import { unzip, zip } from "react-native-zip-archive"

import {
  BACKUP_JSON_NAME,
  type RawRow as BackupRawRow,
  type MintyFlowBackup,
  SCHEMA_VERSION,
  validateBackup,
} from "~/database/backup/backup-format"
import { closeDbSync, getDb } from "~/database/db"
import { resetDrizzleDb } from "~/database/drizzle/db"
import { currencyRegistryService } from "~/services/currency-registry"
import { attachmentsDirectory } from "~/utils/attachments"
import { logger } from "~/utils/logger"
import { getMinorUnitDigits, roundToSafeInteger } from "~/utils/money"

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

type RawRow = Record<string, string | number | null>
type MoneyStorageState = "decimal" | "minor"

const SQLITE_MINOR_MONEY_VERSION = 3
const MIGRATION_BACKUP_DIR = "migration-exports"

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

function tableColumnTypes(
  db: SQLite.SQLiteDatabase,
  table: keyof typeof REQUIRED_SCHEMA,
): Map<string, string> {
  const rows = db.getAllSync<{ name: string; type: string }>(
    `PRAGMA table_info(${quoteIdentifier(table)})`,
  )
  return new Map(rows.map((row) => [row.name, row.type.trim().toUpperCase()]))
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

function buildLegacyZipBackupFileName(): string {
  return `minty-flow-backup-before-update-${new Date().toISOString().replaceAll(":", "-")}.zip`
}

async function prepareMigrationBackupDir(): Promise<string> {
  const dir = `${FileSystem.documentDirectory}${MIGRATION_BACKUP_DIR}/${Date.now()}/`
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
  return dir
}

// TODO: Remove compatibility bootstrap once old pre-Drizzle installs are no longer supported.
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

function normalizeBackupRow(
  table: keyof typeof REQUIRED_SCHEMA,
  row: RawRow,
  moneyState: MoneyStorageState,
  accountCurrencies: Map<string, string>,
): BackupRawRow {
  if (table === "accounts") {
    const currency = accountCurrencies.get(String(row.id))
    if (!currency) throw new Error(`Account ${row.id} is missing currency`)
    return {
      ...row,
      balance:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.balance, currency)
          : row.balance,
    }
  }
  if (table === "budgets") {
    const currency = assertKnownCurrency(row.currency_code, `budget ${row.id}`)
    return {
      ...row,
      amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.amount, currency)
          : row.amount,
    }
  }
  if (table === "goals") {
    const currency = assertKnownCurrency(row.currency_code, `goal ${row.id}`)
    return {
      ...row,
      target_amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.target_amount, currency)
          : row.target_amount,
    }
  }
  if (table === "loans") {
    const currency = accountCurrencies.get(String(row.account_id))
    if (!currency) throw new Error(`Loan ${row.id} has no valid account`)
    return {
      ...row,
      loan_type:
        typeof row.loan_type === "string"
          ? row.loan_type.toLowerCase()
          : row.loan_type,
      principal_amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.principal_amount, currency)
          : row.principal_amount,
    }
  }
  if (table === "transactions") {
    const currency = accountCurrencies.get(String(row.account_id))
    if (!currency) throw new Error(`Transaction ${row.id} has no valid account`)
    return {
      ...row,
      amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.amount, currency)
          : row.amount,
      account_balance_before:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.account_balance_before, currency)
          : row.account_balance_before,
    }
  }
  if (
    table === "recurring_transactions" &&
    moneyState === "decimal" &&
    typeof row.json_transaction_template === "string"
  ) {
    const template = JSON.parse(row.json_transaction_template) as RawRow
    const currency = accountCurrencies.get(String(template.accountId ?? ""))
    if (!currency) {
      throw new Error(`Recurring rule ${row.id} has no valid account`)
    }
    template.amount = majorNumberToMinorUnits(template.amount, currency)
    return {
      ...row,
      json_transaction_template: JSON.stringify(template),
    }
  }

  return row
}

function legacyBackupRows(
  db: SQLite.SQLiteDatabase,
  table: keyof typeof REQUIRED_SCHEMA,
  moneyState: MoneyStorageState,
  accountCurrencies: Map<string, string>,
): BackupRawRow[] {
  return db
    .getAllSync<RawRow>(`SELECT * FROM ${quoteIdentifier(table)}`)
    .map((row) => normalizeBackupRow(table, row, moneyState, accountCurrencies))
}

function getAccountCurrencies(
  db: SQLite.SQLiteDatabase,
  table: "accounts" | "__legacy_accounts",
): Map<string, string> {
  const currencies = new Map<string, string>()
  for (const row of db.getAllSync<RawRow>(
    `SELECT * FROM ${quoteIdentifier(table)}`,
  )) {
    const id = String(row.id)
    currencies.set(id, assertKnownCurrency(row.currency_code, `account ${id}`))
  }
  return currencies
}

function buildLegacyBackupInMemory(db: SQLite.SQLiteDatabase): MintyFlowBackup {
  const moneyState = getMoneyStorageState(db)
  const accountCurrencies = getAccountCurrencies(db, "accounts")

  return {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appId: "minty-flow-app",
    },
    data: {
      categories: legacyBackupRows(
        db,
        "categories",
        moneyState,
        accountCurrencies,
      ),
      tags: legacyBackupRows(db, "tags", moneyState, accountCurrencies),
      accounts: legacyBackupRows(db, "accounts", moneyState, accountCurrencies),
      recurring_transactions: legacyBackupRows(
        db,
        "recurring_transactions",
        moneyState,
        accountCurrencies,
      ),
      budgets: legacyBackupRows(db, "budgets", moneyState, accountCurrencies),
      goals: legacyBackupRows(db, "goals", moneyState, accountCurrencies),
      loans: legacyBackupRows(db, "loans", moneyState, accountCurrencies),
      transactions: legacyBackupRows(
        db,
        "transactions",
        moneyState,
        accountCurrencies,
      ),
      transfers: legacyBackupRows(
        db,
        "transfers",
        moneyState,
        accountCurrencies,
      ),
      transaction_tags: legacyBackupRows(
        db,
        "transaction_tags",
        moneyState,
        accountCurrencies,
      ),
      budget_accounts: legacyBackupRows(
        db,
        "budget_accounts",
        moneyState,
        accountCurrencies,
      ),
      budget_categories: legacyBackupRows(
        db,
        "budget_categories",
        moneyState,
        accountCurrencies,
      ),
      goal_accounts: legacyBackupRows(
        db,
        "goal_accounts",
        moneyState,
        accountCurrencies,
      ),
    },
  }
}

async function assertZipBackupValid(uri: string): Promise<void> {
  const staging = `${FileSystem.cacheDirectory}migration-backup-${Date.now()}/`
  try {
    await FileSystem.makeDirectoryAsync(staging, { intermediates: true })
    await unzip(uri, staging)
    const json = await FileSystem.readAsStringAsync(
      `${staging}${BACKUP_JSON_NAME}`,
    )
    const result = validateBackup(json)
    if (!result.success) throw new Error(result.message)
  } finally {
    await FileSystem.deleteAsync(staging, { idempotent: true })
  }
}

export async function generateLegacyZipBackupForForcedMigration(): Promise<{
  uri: string
  fileName: string
}> {
  const db = getDb()
  const dir = await prepareMigrationBackupDir()
  const jsonUri = `${dir}${BACKUP_JSON_NAME}`
  const backup = buildLegacyBackupInMemory(db)
  const json = JSON.stringify(backup, null, 2)
  const validBackup = validateBackup(json)
  if (!validBackup.success) throw new Error(validBackup.message)

  await FileSystem.writeAsStringAsync(jsonUri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  })

  const fileName = buildLegacyZipBackupFileName()
  const uri = `${dir}${fileName}`
  const attachments = attachmentsDirectory()
    .list()
    .filter((entry): entry is File => entry instanceof File)
    .map((file) => file.uri)

  try {
    await zip([jsonUri, ...attachments], uri)
    await assertZipBackupValid(uri)
  } finally {
    await FileSystem.deleteAsync(jsonUri, { idempotent: true })
  }

  return { uri, fileName }
}

function execSync(db: SQLite.SQLiteDatabase, source: string): void {
  db.execSync(source)
}

function markSqliteMinorMoneyMigrationApplied(db: SQLite.SQLiteDatabase): void {
  execSync(db, `PRAGMA user_version = ${SQLITE_MINOR_MONEY_VERSION};`)
}

function getUserVersion(db: SQLite.SQLiteDatabase): number {
  return (
    db.getFirstSync<{ user_version: number }>("PRAGMA user_version")
      ?.user_version ?? 0
  )
}

// TODO: Remove decimal-money bridge once minimum supported DB is SQLite v3+ and Drizzle baseline adoption is complete.
function getMoneyStorageState(db: SQLite.SQLiteDatabase): MoneyStorageState {
  const columns = [
    ["accounts", "balance"],
    ["budgets", "amount"],
    ["goals", "target_amount"],
    ["loans", "principal_amount"],
    ["transactions", "amount"],
    ["transactions", "account_balance_before"],
  ] as const

  const types = columns.map(([table, column]) => ({
    label: `${table}.${column}`,
    type: tableColumnTypes(db, table).get(column),
  }))

  const allInteger = types.every((column) => column.type === "INTEGER")
  if (allInteger) return "minor"

  const allReal = types.every((column) => column.type === "REAL")
  if (allReal && getUserVersion(db) < SQLITE_MINOR_MONEY_VERSION) {
    return "decimal"
  }

  throw new Error(
    `Existing database has inconsistent money column types: ${types
      .map((column) => `${column.label}=${column.type ?? "missing"}`)
      .join(", ")}`,
  )
}

function majorNumberToMinorUnits(value: unknown, currencyCode: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid legacy money: ${value}`)
  }
  return roundToSafeInteger(value * 10 ** getMinorUnitDigits(currencyCode))
}

function assertKnownCurrency(code: unknown, label: string): string {
  if (
    typeof code !== "string" ||
    !currencyRegistryService.isCurrencyCodeValid(code)
  ) {
    throw new Error(`Unknown currency for ${label}: ${code}`)
  }
  getMinorUnitDigits(code)
  return code
}

function insertRow(
  db: SQLite.SQLiteDatabase,
  table: keyof typeof REQUIRED_SCHEMA,
  row: RawRow,
): void {
  const columns = REQUIRED_SCHEMA[table]
  const placeholders = columns.map(() => "?").join(", ")
  db.runSync(
    `INSERT INTO ${quoteIdentifier(table)} (${columns.join(", ")}) VALUES (${placeholders})`,
    columns.map((column) => row[column]),
  )
}

function legacyRows<T extends RawRow>(
  db: SQLite.SQLiteDatabase,
  table: keyof typeof REQUIRED_SCHEMA,
): T[] {
  return db.getAllSync<T>(
    `SELECT * FROM ${quoteIdentifier(`__legacy_${table}`)}`,
  )
}

function getLegacyAccountCurrencies(
  db: SQLite.SQLiteDatabase,
): Map<string, string> {
  return getAccountCurrencies(db, "__legacy_accounts")
}

function copyAccounts(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
  accountCurrencies: Map<string, string>,
): void {
  for (const row of legacyRows(db, "accounts")) {
    const currency = accountCurrencies.get(String(row.id))
    if (!currency) throw new Error(`Account ${row.id} is missing currency`)
    insertRow(db, "accounts", {
      ...row,
      balance:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.balance, currency)
          : row.balance,
    })
  }
}

function copyBudgets(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
): void {
  for (const row of legacyRows(db, "budgets")) {
    const currency = assertKnownCurrency(row.currency_code, `budget ${row.id}`)
    insertRow(db, "budgets", {
      ...row,
      amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.amount, currency)
          : row.amount,
    })
  }
}

function copyGoals(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
): void {
  for (const row of legacyRows(db, "goals")) {
    const currency = assertKnownCurrency(row.currency_code, `goal ${row.id}`)
    insertRow(db, "goals", {
      ...row,
      target_amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.target_amount, currency)
          : row.target_amount,
    })
  }
}

function copyLoans(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
  accountCurrencies: Map<string, string>,
): void {
  for (const row of legacyRows(db, "loans")) {
    const currency = accountCurrencies.get(String(row.account_id))
    if (!currency) throw new Error(`Loan ${row.id} has no valid account`)
    insertRow(db, "loans", {
      ...row,
      loan_type:
        typeof row.loan_type === "string"
          ? row.loan_type.toLowerCase()
          : row.loan_type,
      principal_amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.principal_amount, currency)
          : row.principal_amount,
    })
  }
}

function copyTransactions(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
  accountCurrencies: Map<string, string>,
): void {
  for (const row of legacyRows(db, "transactions")) {
    const currency = accountCurrencies.get(String(row.account_id))
    if (!currency) throw new Error(`Transaction ${row.id} has no valid account`)
    insertRow(db, "transactions", {
      ...row,
      amount:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.amount, currency)
          : row.amount,
      account_balance_before:
        moneyState === "decimal"
          ? majorNumberToMinorUnits(row.account_balance_before, currency)
          : row.account_balance_before,
    })
  }
}

function copyRecurringTransactions(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
  accountCurrencies: Map<string, string>,
): void {
  for (const row of legacyRows(db, "recurring_transactions")) {
    if (
      moneyState === "decimal" &&
      typeof row.json_transaction_template === "string"
    ) {
      const template = JSON.parse(row.json_transaction_template) as RawRow
      const currency = accountCurrencies.get(String(template.accountId ?? ""))
      if (!currency) {
        throw new Error(`Recurring rule ${row.id} has no valid account`)
      }
      template.amount = majorNumberToMinorUnits(template.amount, currency)
      insertRow(db, "recurring_transactions", {
        ...row,
        json_transaction_template: JSON.stringify(template),
      })
      continue
    }
    insertRow(db, "recurring_transactions", row)
  }
}

function seedDrizzleMigrations(
  db: SQLite.SQLiteDatabase,
  migrations: DrizzleMigrationBundle,
): void {
  execSync(
    db,
    `
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id integer PRIMARY KEY NOT NULL,
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

function dropLegacyIndexes(db: SQLite.SQLiteDatabase): void {
  for (const index of REQUIRED_INDEXES) {
    execSync(db, `DROP INDEX IF EXISTS ${quoteIdentifier(index)};`)
  }
}

function copyLegacyData(
  db: SQLite.SQLiteDatabase,
  moneyState: MoneyStorageState,
): void {
  const accountCurrencies = getLegacyAccountCurrencies(db)

  for (const table of REBUILD_ORDER) {
    if (table === "accounts") {
      copyAccounts(db, moneyState, accountCurrencies)
      continue
    }
    if (table === "recurring_transactions") {
      copyRecurringTransactions(db, moneyState, accountCurrencies)
      continue
    }
    if (table === "budgets") {
      copyBudgets(db, moneyState)
      continue
    }
    if (table === "goals") {
      copyGoals(db, moneyState)
      continue
    }
    if (table === "loans") {
      copyLoans(db, moneyState, accountCurrencies)
      continue
    }
    if (table === "transactions") {
      copyTransactions(db, moneyState, accountCurrencies)
      continue
    }

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
  const moneyState = getMoneyStorageState(db)

  execSync(db, `PRAGMA foreign_keys = OFF;`)
  execSync(db, `BEGIN IMMEDIATE;`)

  try {
    execSync(db, `DROP TABLE IF EXISTS "__drizzle_migrations";`)
    renameLegacyTables(db)
    dropLegacyIndexes(db)
    createCurrentSchema(db, migrations)
    copyLegacyData(db, moneyState)
    seedDrizzleMigrations(db, migrations)
    markSqliteMinorMoneyMigrationApplied(db)
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

import * as DocumentPicker from "expo-document-picker"
import { Directory, File, Paths } from "expo-file-system"
import * as FileSystem from "expo-file-system/legacy"
import { Platform, Share } from "react-native"
import { unzip, zip } from "react-native-zip-archive"

import { getDb } from "~/database/db"
import { emit } from "~/database/events"
import {
  SQLITE_V1_SQL,
  SQLITE_V1_VERSION,
} from "~/database/migrations/sqlite-v1"
import { runInTransaction } from "~/database/transaction"
import type { RowTransaction } from "~/database/types/rows"
import {
  deleteSqliteSnapshot,
  readSqliteSnapshot,
  writeSqliteSnapshot,
} from "~/database/utils/import-snapshot"
import { attachmentsDirectory } from "~/utils/attachments"
import { getFileExtension, getMimeTypeForExtension } from "~/utils/file-icon"
import { logger } from "~/utils/logger"

// ─── Types ───────────────────────────────────────────────────────────────────

interface BackupMeta {
  version: 1
  schemaVersion: number
  exportedAt: string
  appId: "minty-flow-app"
}

type RawRow = Record<string, unknown>

/** Doubles as the file extension of each export format. */
export type ExportType = "json" | "csv" | "zip"

interface SavedExport {
  uri: string
  fileName: string
  savedToDevice: boolean
}

export interface MintyFlowBackup {
  meta: BackupMeta
  data: {
    categories: RawRow[]
    tags: RawRow[]
    accounts: RawRow[]
    recurring_transactions: RawRow[]
    budgets: RawRow[]
    goals: RawRow[]
    loans: RawRow[]
    transactions: RawRow[]
    transfers: RawRow[]
    transaction_tags: RawRow[]
    budget_accounts: RawRow[]
    budget_categories: RawRow[]
    goal_accounts: RawRow[]
  }
}

type ImportResult =
  | { success: true; counts: Record<string, number> }
  | { success: false; error: string }

type ValidateBackupResult =
  | { success: true; backup: MintyFlowBackup }
  | {
      success: false
      reason: "parse_error" | "validation_error"
      message: string
    }

// ─── Constants ───────────────────────────────────────────────────────────────

const SCHEMA_VERSION = SQLITE_V1_VERSION

// Columns stored as TEXT ISO dates in SQLite — used for WDB→SQLite migration
// (WDB stores these as Unix milliseconds, so we convert on import).
const DATE_COLUMNS = new Set([
  "created_at",
  "updated_at",
  "deleted_at",
  "transaction_date",
  "start_date",
  "end_date",
  "target_date",
  "due_date",
  "last_generated_transaction_date",
])

// Per-table column allowlists matching the SQLite schema exactly.
// Join tables (transaction_tags etc.) have no `id` column in SQLite.
const ALLOWED_COLUMNS: Record<string, string[]> = {
  categories: [
    "id",
    "name",
    "type",
    "icon",
    "color_scheme_name",
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
  tags: [
    "id",
    "name",
    "type",
    "color_scheme_name",
    "icon",
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
  // Join tables: no `id` in SQLite schema
  transaction_tags: ["transaction_id", "tag_id"],
  budget_accounts: ["budget_id", "account_id", "created_at"],
  budget_categories: ["budget_id", "category_id", "created_at"],
  goal_accounts: ["goal_id", "account_id", "created_at"],
}

// Delete order: children before parents to respect FK semantics.
const RESET_ORDER = [
  "transaction_tags",
  "budget_accounts",
  "budget_categories",
  "goal_accounts",
  "transfers",
  "transactions",
  "loans",
  "budgets",
  "goals",
  "recurring_transactions",
  "accounts",
  "tags",
  "categories",
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Each export gets its own folder so two exports sharing a name can't overwrite each other. */
async function prepareExportDir(): Promise<string> {
  const dir = `${FileSystem.documentDirectory}exports/${Date.now()}/`
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
  return dir
}

/** Base name (no extension) suggested when the user doesn't type one. */
export function defaultExportBaseName(type: ExportType): string {
  const date = new Date().toISOString().slice(0, 10)
  const stem = type === "csv" ? "minty-flow-transactions" : "minty-flow-backup"
  return `${stem}-${date}`
}

/**
 * Build `<base>.<ext>` from user-typed text.
 *
 * Sanitising lives here rather than in the caller because the result is concatenated
 * into a file path — a separator or a leading dot must never survive.
 */
function toFileName(type: ExportType, baseName?: string): string {
  const cleaned = (baseName ?? "")
    // biome-ignore lint/suspicious/noControlCharactersInRegex: stripping them is the point
    .replace(/[/\\:*?"<>|\u0000-\u001f]/g, "")
    .slice(0, 100)
    .trim()
    .replace(/^\.+/, "")
  return `${cleaned || defaultExportBaseName(type)}.${type}`
}

/**
 * Copy an exported file out of app-private storage to a folder the user picks.
 *
 * Android uses a folder picker, not a "Save as" dialog: CREATE_DOCUMENT is unusable here
 * because expo-intent-launcher returns the result Intent's `toString()` as `data`, and
 * `Intent.toString()` redacts the URI path (`content://…/...`), so the document URI never
 * survives the trip to JS. Note Android itself forbids granting access to the Download
 * root — users must pick another folder (Documents, or a Download subfolder).
 *
 * @returns false if the user cancelled or the copy failed.
 */
async function saveToDevice(uri: string, fileName: string): Promise<boolean> {
  if (Platform.OS !== "android") {
    await Share.share({ url: uri })
    return true
  }

  try {
    const { StorageAccessFramework: SAF } = FileSystem
    const permission = await SAF.requestDirectoryPermissionsAsync()
    if (!permission.granted) return false

    const ext = getFileExtension(fileName)
    const targetUri = await SAF.createFileAsync(
      permission.directoryUri,
      fileName,
      getMimeTypeForExtension(ext),
    )

    // Binary must not round-trip through a UTF-8 string — that corrupts it.
    // ponytail: pulls the whole file through a base64 JS string (~1.33x), so a very large
    // attachment set can OOM. SAF documents are read-only to File.copy
    // (DestinationSink.ContentResource), so there is no streaming handoff available.
    const encoding =
      ext === "zip"
        ? FileSystem.EncodingType.Base64
        : FileSystem.EncodingType.UTF8
    const content = await FileSystem.readAsStringAsync(uri, { encoding })
    await SAF.writeAsStringAsync(targetUri, content, { encoding })
    return true
  } catch (e) {
    logger.error("Save to device failed", {
      message: e instanceof Error ? e.message : String(e),
    })
    return false
  }
}

/** Convert a column value: normalize Unix-ms timestamps (WDB format) to ISO strings. */
function normalizeColumnValue(col: string, val: unknown): unknown {
  if (
    DATE_COLUMNS.has(col) &&
    typeof val === "number" &&
    Number.isFinite(val)
  ) {
    return new Date(val).toISOString()
  }
  return val ?? null
}

/** Re-derive `has_attachments` from the raw `extra` JSON string. */
function deriveHasAttachments(extraJson: unknown): number {
  if (typeof extraJson !== "string" || !extraJson) return 0
  try {
    const extra = JSON.parse(extraJson) as Record<string, unknown>
    if (!extra.attachments) return 0
    const attachments =
      typeof extra.attachments === "string"
        ? (JSON.parse(extra.attachments) as unknown)
        : extra.attachments
    if (Array.isArray(attachments)) return attachments.length > 0 ? 1 : 0
    if (typeof attachments === "object" && attachments !== null)
      return Object.keys(attachments).length > 0 ? 1 : 0
    return 0
  } catch {
    return 0
  }
}

// ─── Export ──────────────────────────────────────────────────────────────────

/** Fetch all 13 tables from the SQLite DB and return a MintyFlowBackup object. */
async function buildBackupInMemory(): Promise<MintyFlowBackup> {
  const db = getDb()
  const [
    categories,
    tags,
    accounts,
    recurringTransactions,
    budgets,
    goals,
    loans,
    transactions,
    transfers,
    transactionTags,
    budgetAccounts,
    budgetCategories,
    goalAccounts,
  ] = await Promise.all([
    db.getAllAsync<RawRow>("SELECT * FROM categories"),
    db.getAllAsync<RawRow>("SELECT * FROM tags"),
    db.getAllAsync<RawRow>("SELECT * FROM accounts"),
    db.getAllAsync<RawRow>("SELECT * FROM recurring_transactions"),
    db.getAllAsync<RawRow>("SELECT * FROM budgets"),
    db.getAllAsync<RawRow>("SELECT * FROM goals"),
    db.getAllAsync<RawRow>("SELECT * FROM loans"),
    db.getAllAsync<RawRow>("SELECT * FROM transactions"),
    db.getAllAsync<RawRow>("SELECT * FROM transfers"),
    db.getAllAsync<RawRow>("SELECT * FROM transaction_tags"),
    db.getAllAsync<RawRow>("SELECT * FROM budget_accounts"),
    db.getAllAsync<RawRow>("SELECT * FROM budget_categories"),
    db.getAllAsync<RawRow>("SELECT * FROM goal_accounts"),
  ])

  return {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appId: "minty-flow-app",
    },
    data: {
      categories,
      tags,
      accounts,
      recurring_transactions: recurringTransactions,
      budgets,
      goals,
      loans,
      transactions,
      transfers,
      transaction_tags: transactionTags,
      budget_accounts: budgetAccounts,
      budget_categories: budgetCategories,
      goal_accounts: goalAccounts,
    },
  }
}

async function generateJsonBackup(baseName?: string): Promise<{
  uri: string
  fileName: string
}> {
  const dir = await prepareExportDir()
  const backup = await buildBackupInMemory()
  const fileName = toFileName("json", baseName)
  const uri = `${dir}${fileName}`
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return { uri, fileName }
}

export async function saveJsonToDevice(
  baseName?: string,
): Promise<SavedExport> {
  const { uri, fileName } = await generateJsonBackup(baseName)
  const savedToDevice = await saveToDevice(uri, fileName)
  return { uri, fileName, savedToDevice }
}

/** Name of the backup document inside a zip archive. */
const BACKUP_JSON_NAME = "backup.json"

async function generateZipBackup(
  baseName?: string,
): Promise<{ uri: string; fileName: string }> {
  const dir = await prepareExportDir()
  const backup = await buildBackupInMemory()
  const jsonUri = `${dir}${BACKUP_JSON_NAME}`
  await FileSystem.writeAsStringAsync(
    jsonUri,
    JSON.stringify(backup, null, 2),
    {
      encoding: FileSystem.EncodingType.UTF8,
    },
  )

  const fileName = toFileName("zip", baseName)
  const uri = `${dir}${fileName}`
  const attachments = attachmentsDirectory()
    .list()
    .filter((entry): entry is File => entry instanceof File)
    .map((file) => file.uri)

  try {
    // An array source zips to flat basenames, so the live attachment files are archived
    // in place — a nested layout would need staging copies and twice the peak disk.
    await zip([jsonUri, ...attachments], uri)
  } finally {
    await FileSystem.deleteAsync(jsonUri, { idempotent: true })
  }

  return { uri, fileName }
}

export async function saveZipToDevice(baseName?: string): Promise<SavedExport> {
  const { uri, fileName } = await generateZipBackup(baseName)
  const savedToDevice = await saveToDevice(uri, fileName)
  return { uri, fileName, savedToDevice }
}

/**
 * Read a picked backup, transparently unwrapping a zip archive.
 *
 * The extension only routes to a read strategy — it never rejects. `validateBackup`
 * is the gate on whether the contents are actually a backup.
 *
 * @returns The backup JSON text, plus the staging dir holding the archive's attachment
 *   files (null for a plain JSON pick). The caller owns the staging dir.
 */
export async function readPickedBackup(
  uri: string,
  name: string,
): Promise<{ json: string; stagingDir: string | null }> {
  if (!name.toLowerCase().endsWith(".zip")) {
    const json = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    })
    return { json, stagingDir: null }
  }

  const staging = new Directory(Paths.cache, `import-${Date.now()}`)
  staging.create({ intermediates: true, idempotent: true })
  try {
    await unzip(uri, staging.uri)
    const jsonFile = new File(staging, BACKUP_JSON_NAME)
    if (!jsonFile.exists) throw new Error(`Archive has no ${BACKUP_JSON_NAME}`)
    return { json: await jsonFile.text(), stagingDir: staging.uri }
  } catch (e) {
    deleteStagingDir(staging.uri)
    throw e
  }
}

/** Copy an archive's attachment files into permanent storage. Deletes the staging dir. */
export async function restoreAttachmentsFromStaging(
  stagingDir: string,
): Promise<void> {
  const destination = attachmentsDirectory()
  const files = new Directory(stagingDir)
    .list()
    .filter(
      (entry): entry is File =>
        entry instanceof File && entry.name !== BACKUP_JSON_NAME,
    )

  await Promise.all(
    files.map((file) =>
      file.copy(new File(destination, file.name), { overwrite: true }),
    ),
  )
  deleteStagingDir(stagingDir)
}

export function deleteStagingDir(stagingDir: string): void {
  try {
    new Directory(stagingDir).delete()
  } catch {
    // staging lives in the cache dir — the OS reclaims it either way
  }
}

async function generateCsvExport(
  baseName?: string,
): Promise<{ uri: string; fileName: string }> {
  const dir = await prepareExportDir()
  const db = getDb()
  const transactions = await db.getAllAsync<RowTransaction>(
    "SELECT * FROM transactions WHERE is_deleted = 0",
  )

  const headers = [
    "id",
    "date",
    "type",
    "amount",
    "title",
    "description",
    "category_id",
    "account_id",
    "is_pending",
    "goal_id",
    "budget_id",
    "loan_id",
    "recurring_id",
    "subtype",
    "location",
    "created_at",
  ]

  function escapeCsvField(value: unknown): string {
    if (value === null || value === undefined) return ""
    const str = String(value)
    if (
      str.includes(",") ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r")
    ) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = transactions.map((r) =>
    [
      escapeCsvField(r.id),
      escapeCsvField(r.transaction_date), // already ISO string in SQLite
      escapeCsvField(r.type),
      escapeCsvField(r.amount),
      escapeCsvField(r.title),
      escapeCsvField(r.description),
      escapeCsvField(r.category_id),
      escapeCsvField(r.account_id),
      escapeCsvField(r.is_pending),
      escapeCsvField(r.goal_id),
      escapeCsvField(r.budget_id),
      escapeCsvField(r.loan_id),
      escapeCsvField(r.recurring_id),
      escapeCsvField(r.subtype),
      escapeCsvField(r.location),
      escapeCsvField(r.created_at),
    ].join(","),
  )

  const csv = [headers.join(","), ...rows].join("\r\n")
  const fileName = toFileName("csv", baseName)
  const uri = `${dir}${fileName}`
  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return { uri, fileName }
}

export async function saveCsvToDevice(baseName?: string): Promise<SavedExport> {
  const { uri, fileName } = await generateCsvExport(baseName)
  const savedToDevice = await saveToDevice(uri, fileName)
  return { uri, fileName, savedToDevice }
}

export async function saveExistingFileToDevice(
  uri: string,
  fileName: string,
): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri)
  if (!info.exists) throw new Error("file_not_found")
  return saveToDevice(uri, fileName)
}

// ponytail: leaves the export's now-empty parent folder behind. Delete the folder too
// once history records predating per-export folders can no longer be in the store.
export async function deleteExportFile(uri: string): Promise<void> {
  try {
    const info = await FileSystem.getInfoAsync(uri)
    if (info.exists) {
      await FileSystem.deleteAsync(uri)
    }
  } catch {
    // file may already be gone — ignore
  }
}

// ─── Validate ─────────────────────────────────────────────────────────────────

export function validateBackup(json: string): ValidateBackupResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (e) {
    return {
      success: false,
      reason: "parse_error",
      message: e instanceof Error ? e.message : "Invalid JSON",
    }
  }

  try {
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("meta" in parsed) ||
      !("data" in parsed)
    ) {
      return {
        success: false,
        reason: "validation_error",
        message: "Missing required fields: meta, data",
      }
    }
    const p = parsed as Record<string, unknown>
    const meta = p.meta as Record<string, unknown> | undefined
    if (meta?.appId !== "minty-flow-app") {
      return {
        success: false,
        reason: "validation_error",
        message: "Not a Minty Flow backup file",
      }
    }
    if (meta.version !== 1) {
      return {
        success: false,
        reason: "validation_error",
        message: `Unsupported backup version: ${meta.version}`,
      }
    }
    if (
      typeof meta.schemaVersion !== "number" ||
      meta.schemaVersion > SCHEMA_VERSION
    ) {
      return {
        success: false,
        reason: "validation_error",
        message: `Backup schema version ${meta.schemaVersion} is newer than app schema version ${SCHEMA_VERSION}`,
      }
    }
    const data = p.data as Record<string, unknown> | undefined
    if (!data) {
      return {
        success: false,
        reason: "validation_error",
        message: "Missing data section",
      }
    }

    const requiredTables = [
      "categories",
      "accounts",
      "tags",
      "transactions",
      "recurring_transactions",
      "budgets",
      "goals",
      "loans",
      "transfers",
      "transaction_tags",
      "budget_accounts",
      "budget_categories",
      "goal_accounts",
    ]
    for (const table of requiredTables) {
      if (!Array.isArray((data as Record<string, unknown>)[table])) {
        return {
          success: false,
          reason: "validation_error",
          message: `Missing or invalid table: ${table}`,
        }
      }
    }

    const transactions = (data as Record<string, unknown>)
      .transactions as unknown[]
    if (Array.isArray(transactions)) {
      for (let i = 0; i < transactions.length; i++) {
        const row = transactions[i] as Record<string, unknown> | undefined
        if (!row) continue

        if (typeof row.id !== "string" || !row.id.trim()) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid row: id (row ${i})`,
          }
        }
        if (typeof row.amount !== "number") {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid row: amount (row ${i})`,
          }
        }
        // Accept ISO string (SQLite) or Unix ms number (WDB backup) for cross-compat
        const txDate = row.transaction_date
        if (
          typeof txDate !== "string" &&
          (typeof txDate !== "number" || !Number.isFinite(txDate as number))
        ) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid row: transaction_date must be an ISO string or Unix ms number (row ${i})`,
          }
        }
      }
    }

    const accounts = (data as Record<string, unknown>).accounts as unknown[]
    if (Array.isArray(accounts)) {
      for (let i = 0; i < accounts.length; i++) {
        const row = accounts[i] as Record<string, unknown> | undefined
        if (!row) continue
        if (typeof row.id !== "string" || !row.id.trim()) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid account row: id (row ${i})`,
          }
        }
        if (typeof row.name !== "string" || !row.name.trim()) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid account row: name (row ${i})`,
          }
        }
      }
    }

    const categories = (data as Record<string, unknown>).categories as unknown[]
    if (Array.isArray(categories)) {
      for (let i = 0; i < categories.length; i++) {
        const row = categories[i] as Record<string, unknown> | undefined
        if (!row) continue
        if (typeof row.id !== "string" || !row.id.trim()) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid category row: id (row ${i})`,
          }
        }
        if (typeof row.name !== "string" || !row.name.trim()) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid category row: name (row ${i})`,
          }
        }
      }
    }

    return { success: true, backup: parsed as MintyFlowBackup }
  } catch (e) {
    return {
      success: false,
      reason: "validation_error",
      message: e instanceof Error ? e.message : "Validation failed",
    }
  }
}

// ─── Pick file ────────────────────────────────────────────────────────────────

export async function pickBackupFile(): Promise<{
  uri: string
  name: string
} | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  })

  if (result.canceled || !result.assets?.[0]) return null

  const file = result.assets[0]
  return { uri: file.uri, name: file.name ?? "backup" }
}

// ─── Count records ────────────────────────────────────────────────────────────

export function countBackupRecords(backup: MintyFlowBackup): {
  total: number
  tableCount: number
} {
  let total = 0
  let tableCount = 0
  for (const rows of Object.values(backup.data)) {
    if (rows.length > 0) {
      total += rows.length
      tableCount++
    }
  }
  return { total, tableCount }
}

// ─── Import ───────────────────────────────────────────────────────────────────

/**
 * Wipe all rows (reverse FK order) and recreate schema in a single transaction.
 * Two-transaction approach: reset (A) → insert (B) → delete snapshot.
 * Crash between A and B leaves empty DB; snapshot on disk triggers recovery on next launch.
 */
async function resetDatabase(): Promise<void> {
  await runInTransaction("import.reset", async (db) => {
    for (const table of RESET_ORDER) {
      await db.runAsync(`DELETE FROM ${table}`)
    }
    // Recreate tables in case schema evolves (CREATE TABLE IF NOT EXISTS is idempotent)
    await db.execAsync(SQLITE_V1_SQL)
  })
}

/**
 * Insert rows into a table using parameterized INSERT OR IGNORE.
 * Unknown columns (e.g., WDB `id` in join tables) are silently dropped via ALLOWED_COLUMNS.
 * WDB Unix-ms timestamps are converted to ISO strings via normalizeColumnValue.
 * has_attachments is re-derived from extra JSON for transactions.
 */
async function insertRows(tableName: string, rows: RawRow[]): Promise<void> {
  if (rows.length === 0) return
  const cols = ALLOWED_COLUMNS[tableName] ?? []
  if (cols.length === 0) return
  const isTransactions = tableName === "transactions"
  const placeholders = cols.map(() => "?").join(", ")
  const sql = `INSERT OR IGNORE INTO ${tableName} (${cols.join(", ")}) VALUES (${placeholders})`
  const db = getDb()

  for (const row of rows) {
    const values = cols.map((col) => {
      if (isTransactions && col === "has_attachments") {
        return deriveHasAttachments(row.extra)
      }
      return normalizeColumnValue(col, row[col])
    })
    await db.runAsync(sql, values as (string | number | null)[])
  }
}

async function insertAllTiers(data: MintyFlowBackup["data"]): Promise<void> {
  // Tier 1: no FK dependencies
  await insertRows("categories", data.categories)
  await insertRows("tags", data.tags)
  await insertRows("accounts", data.accounts)

  // Tier 2: depend on Tier 1
  await insertRows("recurring_transactions", data.recurring_transactions)
  await insertRows("budgets", data.budgets)
  await insertRows("goals", data.goals)
  await insertRows("loans", data.loans)

  // Tier 3: transactions
  await insertRows("transactions", data.transactions)

  // Tier 4: transfers
  await insertRows("transfers", data.transfers)

  // Tier 5: join tables
  await insertRows("transaction_tags", data.transaction_tags)
  await insertRows("budget_accounts", data.budget_accounts)
  await insertRows("budget_categories", data.budget_categories)
  await insertRows("goal_accounts", data.goal_accounts)
}

export async function recoverInterruptedImport(): Promise<boolean> {
  const snapshot = await readSqliteSnapshot<MintyFlowBackup>()
  if (!snapshot) return false

  await resetDatabase()
  await runInTransaction("recover.insert", async () => {
    await insertAllTiers(snapshot.data)
  })
  // Delete only after confirmed success
  await deleteSqliteSnapshot()
  emit("db:reset", undefined)
  return true
}

export async function importBackup(
  backup: MintyFlowBackup,
): Promise<ImportResult> {
  try {
    const { data } = backup

    // 1️⃣ Build FK ID sets (before any DB mutation)
    const validAccountIds = new Set(data.accounts.map((a) => a.id))
    const validCategoryIds = new Set(data.categories.map((c) => c.id))
    const validTagIds = new Set(data.tags.map((t) => t.id))
    const validRecurringIds = new Set(
      data.recurring_transactions.map((r) => r.id),
    )
    const validBudgetIds = new Set(data.budgets.map((b) => b.id))
    const validGoalIds = new Set(data.goals.map((g) => g.id))
    const validLoanIds = new Set(data.loans.map((l) => l.id))
    const validTransactionIds = new Set(data.transactions.map((t) => t.id))

    // 2️⃣ Validate FKs in memory before any DB write
    for (const tx of data.transactions) {
      if (!validAccountIds.has(tx.account_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid account_id ${tx.account_id}`,
        )
      }
      if (tx.category_id && !validCategoryIds.has(tx.category_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid category_id ${tx.category_id}`,
        )
      }
      if (
        tx.recurring_id &&
        !validRecurringIds.has(tx.recurring_id as string)
      ) {
        throw new Error(
          `Transaction ${tx.id} references invalid recurring_id ${tx.recurring_id}`,
        )
      }
      if (tx.goal_id && !validGoalIds.has(tx.goal_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid goal_id ${tx.goal_id}`,
        )
      }
      if (tx.budget_id && !validBudgetIds.has(tx.budget_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid budget_id ${tx.budget_id}`,
        )
      }
      if (tx.loan_id && !validLoanIds.has(tx.loan_id as string)) {
        throw new Error(
          `Transaction ${tx.id} references invalid loan_id ${tx.loan_id}`,
        )
      }
    }

    for (const row of data.transaction_tags) {
      if (!validTransactionIds.has(row.transaction_id as string)) {
        throw new Error(
          `transaction_tags row references invalid transaction_id ${row.transaction_id}`,
        )
      }
      if (!validTagIds.has(row.tag_id as string)) {
        throw new Error(
          `transaction_tags row references invalid tag_id ${row.tag_id}`,
        )
      }
    }
    for (const row of data.budget_accounts) {
      if (!validBudgetIds.has(row.budget_id as string)) {
        throw new Error(
          `budget_accounts row references invalid budget_id ${row.budget_id}`,
        )
      }
      if (!validAccountIds.has(row.account_id as string)) {
        throw new Error(
          `budget_accounts row references invalid account_id ${row.account_id}`,
        )
      }
    }
    for (const row of data.budget_categories) {
      if (!validBudgetIds.has(row.budget_id as string)) {
        throw new Error(
          `budget_categories row references invalid budget_id ${row.budget_id}`,
        )
      }
      if (!validCategoryIds.has(row.category_id as string)) {
        throw new Error(
          `budget_categories row references invalid category_id ${row.category_id}`,
        )
      }
    }
    for (const row of data.goal_accounts) {
      if (!validGoalIds.has(row.goal_id as string)) {
        throw new Error(
          `goal_accounts row references invalid goal_id ${row.goal_id}`,
        )
      }
      if (!validAccountIds.has(row.account_id as string)) {
        throw new Error(
          `goal_accounts row references invalid account_id ${row.account_id}`,
        )
      }
    }
    for (const row of data.transfers) {
      if (!validTransactionIds.has(row.from_transaction_id as string)) {
        throw new Error(
          `transfers row references invalid from_transaction_id ${row.from_transaction_id}`,
        )
      }
      if (!validTransactionIds.has(row.to_transaction_id as string)) {
        throw new Error(
          `transfers row references invalid to_transaction_id ${row.to_transaction_id}`,
        )
      }
      if (!validAccountIds.has(row.from_account_id as string)) {
        throw new Error(
          `transfers row references invalid from_account_id ${row.from_account_id}`,
        )
      }
      if (!validAccountIds.has(row.to_account_id as string)) {
        throw new Error(
          `transfers row references invalid to_account_id ${row.to_account_id}`,
        )
      }
    }
    for (const row of data.loans) {
      if (!validAccountIds.has(row.account_id as string)) {
        throw new Error(
          `loans row ${row.id} references invalid account_id ${row.account_id}`,
        )
      }
      if (row.category_id && !validCategoryIds.has(row.category_id as string)) {
        throw new Error(
          `loans row ${row.id} references invalid category_id ${row.category_id}`,
        )
      }
    }

    // 3️⃣ Snapshot current DB to disk before any mutation
    // Survives process-kill between reset (A) and insert (B) — recovery reads it on next launch.
    const snapshot = await buildBackupInMemory()
    await writeSqliteSnapshot(snapshot)

    // 4️⃣ Transaction A: wipe all rows
    // 5️⃣ Transaction B: insert backup data
    try {
      await resetDatabase()
      await runInTransaction("import.insert", async () => {
        await insertAllTiers(data)
      })
      // Import succeeded — snapshot no longer needed
      await deleteSqliteSnapshot()
    } catch (importError) {
      // Attempt JS-layer restore from pre-import snapshot
      try {
        await resetDatabase()
        await runInTransaction("restore.insert", async () => {
          await insertAllTiers(snapshot.data)
        })
        // Restore succeeded — snapshot no longer needed
        await deleteSqliteSnapshot()
      } catch {
        // Restore also failed — leave snapshot on disk for next-launch recovery
        throw new Error(
          `Import failed and automatic restore failed: ${importError instanceof Error ? importError.message : String(importError)}. Please re-import from your last exported backup file.`,
        )
      }
      throw importError
    }

    emit("db:reset", undefined)

    const counts: Record<string, number> = {}
    for (const [table, rows] of Object.entries(data)) {
      counts[table] = rows.length
    }

    return { success: true, counts }
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    }
  }
}

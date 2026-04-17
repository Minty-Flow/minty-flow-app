import { Q } from "@nozbe/watermelondb"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system/legacy"
import * as IntentLauncher from "expo-intent-launcher"
import { Platform, Share } from "react-native"

import { getMimeTypeForExtension } from "~/utils/file-icon"

import { database } from "../index"
import { schema } from "../schema"

// ─── Backup types ────────────────────────────────────────────────────────────

export interface BackupMeta {
  version: 1
  schemaVersion: number
  exportedAt: string
  appId: "minty-flow-app"
}

/** Raw row from a WatermelonDB collection — all column values as stored in SQLite. */
type RawRow = Record<string, unknown>

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

/**
 * Discriminated result from {@link validateBackup}.
 *
 * - `parse_error`: The file content is not valid JSON.
 * - `validation_error`: The JSON parsed correctly but does not conform to the
 *   expected Minty Flow backup structure (wrong version, missing tables, etc.).
 */
export type ValidateBackupResult =
  | { success: true; backup: MintyFlowBackup }
  | {
      success: false
      reason: "parse_error" | "validation_error"
      message: string
    }

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * The current WatermelonDB schema version of the app.
 *
 * **Why**: Backups exported from one version of the app may contain columns that
 * do not exist in an older version of the schema. Importing such a backup into an
 * older app build would silently drop those columns (WatermelonDB ignores unknown
 * columns during `prepareCreate`), causing data loss on the next sync.
 *
 * **How**: This value is embedded in every backup's `meta.schemaVersion` field
 * during export and checked during `validateBackup`. A mismatch between the backup's
 * `schemaVersion` and this constant causes validation to fail, preventing the import
 * from proceeding.
 *
 * Sourced directly from `schema.version` so it stays in sync automatically — no
 * manual bump needed when migrations are added.
 */
const SCHEMA_VERSION = schema.version
const INTERNAL_FIELDS = new Set(["_status", "_changed"])

/**
 * Extract plain-object row from a WatermelonDB model, excluding internal sync fields.
 */
function toRawRow(model: { _raw: RawRow }): RawRow {
  const raw: RawRow = {}
  for (const [key, value] of Object.entries(model._raw)) {
    if (!INTERNAL_FIELDS.has(key)) {
      raw[key] = value
    }
  }
  return raw
}

/** Ensures the exports directory exists. */
async function prepareExportDir(): Promise<string> {
  const dir = `${FileSystem.documentDirectory}exports/`
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
  return dir
}

/**
 * Open the system "Save file as…" dialog (Android only) so the user can pick
 * any local folder (e.g. Downloads). Returns true if the file was saved,
 * false if the user cancelled.
 * On iOS the Share sheet already includes "Save to Files", so we delegate there.
 */
async function saveToDevice(
  uri: string,
  fileName: string,
  ext: string,
): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      const mimeType = getMimeTypeForExtension(ext)
      const result = await IntentLauncher.startActivityAsync(
        "android.intent.action.CREATE_DOCUMENT",
        {
          type: mimeType,
          extra: { "android.intent.extra.TITLE": fileName },
        },
      )
      if (
        result.resultCode !== IntentLauncher.ResultCode.Success ||
        !result.data
      ) {
        return false
      }
      const content = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.UTF8,
      })
      await FileSystem.StorageAccessFramework.writeAsStringAsync(
        result.data,
        content,
      )
      return true
    } catch {
      return false
    }
  }
  // iOS: Share sheet includes "Save to Files" natively
  await Share.share({ url: uri })
  return true
}

// ─── Export ──────────────────────────────────────────────────────────────────

/**
 * Build the full JSON backup and write it to the exports dir. Returns { uri, fileName }.
 *
 * Note: Backup includes soft-deleted (trashed) transactions. This is intentional—users
 * may want to recover deleted transactions from an older backup. Imports must handle this.
 */
/** Fetch all tables and return a MintyFlowBackup object without writing to disk. */
async function buildBackupInMemory(): Promise<MintyFlowBackup> {
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
    database.get("categories").query().fetch(),
    database.get("tags").query().fetch(),
    database.get("accounts").query().fetch(),
    database.get("recurring_transactions").query().fetch(),
    database.get("budgets").query().fetch(),
    database.get("goals").query().fetch(),
    database.get("loans").query().fetch(),
    database.get("transactions").query().fetch(),
    database.get("transfers").query().fetch(),
    database.get("transaction_tags").query().fetch(),
    database.get("budget_accounts").query().fetch(),
    database.get("budget_categories").query().fetch(),
    database.get("goal_accounts").query().fetch(),
  ])

  return {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appId: "minty-flow-app",
    },
    data: {
      categories: categories.map(toRawRow),
      tags: tags.map(toRawRow),
      accounts: accounts.map(toRawRow),
      recurring_transactions: recurringTransactions.map(toRawRow),
      budgets: budgets.map(toRawRow),
      goals: goals.map(toRawRow),
      loans: loans.map(toRawRow),
      transactions: transactions.map(toRawRow),
      transfers: transfers.map(toRawRow),
      transaction_tags: transactionTags.map(toRawRow),
      budget_accounts: budgetAccounts.map(toRawRow),
      budget_categories: budgetCategories.map(toRawRow),
      goal_accounts: goalAccounts.map(toRawRow),
    },
  }
}

async function generateJsonBackup(): Promise<{
  uri: string
  fileName: string
}> {
  const dir = await prepareExportDir()
  const backup = await buildBackupInMemory()
  const fileName = `minty-flow-backup-${Date.now()}.json`
  const uri = `${dir}${fileName}`
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return { uri, fileName }
}

/**
 * Export the full database as a JSON backup and open the "Save file as…" dialog.
 * Returns the app-private { uri, fileName, savedToDevice } object.
 */
export async function saveJsonToDevice(): Promise<{
  uri: string
  fileName: string
  savedToDevice: boolean
}> {
  const { uri, fileName } = await generateJsonBackup()
  const savedToDevice = await saveToDevice(uri, fileName, "json")
  return { uri, fileName, savedToDevice }
}

/** Build the CSV transactions export and write it to the exports dir. Returns { uri, fileName }. */
async function generateCsvExport(): Promise<{ uri: string; fileName: string }> {
  const dir = await prepareExportDir()

  const transactions = await database
    .get("transactions")
    .query(Q.where("is_deleted", false))
    .fetch()

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
    "is_transfer",
    "transfer_id",
    "related_account_id",
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
  const rows = transactions.map((model) => {
    const r = model._raw as Record<string, unknown>
    const dateMs = r.transaction_date as number | null
    const createdMs = r.created_at as number | null
    return [
      escapeCsvField(r.id),
      escapeCsvField(dateMs ? new Date(dateMs).toISOString() : null),
      escapeCsvField(r.type),
      escapeCsvField(r.amount),
      escapeCsvField(r.title),
      escapeCsvField(r.description),
      escapeCsvField(r.category_id),
      escapeCsvField(r.account_id),
      escapeCsvField(r.is_pending),
      escapeCsvField(r.is_transfer),
      escapeCsvField(r.transfer_id),
      escapeCsvField(r.related_account_id),
      escapeCsvField(r.goal_id),
      escapeCsvField(r.budget_id),
      escapeCsvField(r.loan_id),
      escapeCsvField(r.recurring_id),
      escapeCsvField(r.subtype),
      escapeCsvField(r.location),
      escapeCsvField(createdMs ? new Date(createdMs).toISOString() : null),
    ].join(",")
  })

  const csv = [headers.join(","), ...rows].join("\r\n")
  const fileName = `minty-flow-transactions-${Date.now()}.csv`
  const uri = `${dir}${fileName}`
  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  })
  return { uri, fileName }
}

/**
 * Export non-deleted transactions as a CSV file and open the "Save file as…" dialog.
 * Returns the app-private { uri, fileName, savedToDevice } object.
 */
export async function saveCsvToDevice(): Promise<{
  uri: string
  fileName: string
  savedToDevice: boolean
}> {
  const { uri, fileName } = await generateCsvExport()
  const savedToDevice = await saveToDevice(uri, fileName, "csv")
  return { uri, fileName, savedToDevice }
}

/**
 * Re-save an already-exported file to a user-chosen device location.
 * Throws with message "file_not_found" if the app-private source file no longer exists.
 * Returns true if saved, false if the user cancelled the picker.
 */
export async function saveExistingFileToDevice(
  uri: string,
  fileName: string,
  ext: string,
): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri)
  if (!info.exists) throw new Error("file_not_found")
  return saveToDevice(uri, fileName, ext)
}

/**
 * Delete the app-private copy of an exported file.
 * Safe to call even if the file no longer exists.
 */
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

/**
 * Parse and validate a JSON string as a Minty Flow backup.
 *
 * Returns a {@link ValidateBackupResult} discriminated union so callers can
 * surface specific error messages to the user:
 * - `parse_error` — the file is not valid JSON at all.
 * - `validation_error` — the JSON parsed but the structure is wrong (bad
 *   version, missing tables, corrupt row fields, etc.).
 */
export function validateBackup(json: string): ValidateBackupResult {
  // ── Phase 1: JSON parsing ──────────────────────────────────────────────────
  // Isolate JSON.parse so that SyntaxErrors are reported as `parse_error`,
  // distinct from structural validation failures below.
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

  // ── Phase 2: Structure validation ─────────────────────────────────────────
  // From here, any failure is a `validation_error` (the file is valid JSON
  // but not a Minty Flow backup).
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
    if (!meta || meta.appId !== "minty-flow-app") {
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
    // Allow older backup schema versions (backward compatibility); WatermelonDB
    // handles default values for new columns. Only reject newer schema versions.
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

    // Validate all required tables are present and are arrays
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

    // Validate critical fields in transaction rows
    const transactions = (data as Record<string, unknown>)
      .transactions as unknown[]
    if (Array.isArray(transactions)) {
      for (let i = 0; i < transactions.length; i++) {
        const row = transactions[i] as Record<string, unknown> | undefined
        if (!row) continue

        // Validate id: must be non-empty string
        if (typeof row.id !== "string" || !row.id.trim()) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid row: id (row ${i})`,
          }
        }

        // Validate amount: must be number
        if (typeof row.amount !== "number") {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid row: amount (row ${i})`,
          }
        }

        // Validate transaction_date: must be a Unix timestamp in milliseconds (number).
        // WatermelonDB stores dates as number, not ISO strings.
        const txDate = row.transaction_date
        if (typeof txDate !== "number" || !Number.isFinite(txDate)) {
          return {
            success: false,
            reason: "validation_error",
            message: `Invalid row: transaction_date must be a number (Unix ms, row ${i})`,
          }
        }
      }
    }

    // Validate critical fields in account rows
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

    // Validate critical fields in category rows
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
    // Catch any unexpected errors during structural checks and report them as
    // validation errors rather than crashing the import flow.
    return {
      success: false,
      reason: "validation_error",
      message: e instanceof Error ? e.message : "Validation failed",
    }
  }
}

// ─── Pick file ────────────────────────────────────────────────────────────────

/**
 * Open the document picker for JSON files.
 * Returns the file URI + name, or null if cancelled.
 */
export async function pickBackupFile(): Promise<{
  uri: string
  name: string
} | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*", // keep flexible for Android compatibility
    copyToCacheDirectory: true,
  })

  if (result.canceled || !result.assets?.[0]) return null

  const file = result.assets[0]

  // Basic validation (UX-level)
  if (!file.name?.toLowerCase().endsWith(".json")) {
    return null
  }

  return {
    uri: file.uri,
    name: file.name ?? "backup",
  }
}
// ─── Count records ────────────────────────────────────────────────────────────

/**
 * Returns summary counts for a parsed backup object: total row count across all
 * tables and the number of non-empty tables.
 *
 * @param backup - A validated {@link MintyFlowBackup} returned by {@link validateBackup}.
 * @returns An object with `total` (sum of all rows) and `tableCount` (tables with at least one row).
 */
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
 * Per-table column allowlists derived from schema.ts.
 * Only these keys are written to _raw during backup import — unknown keys are silently dropped.
 */
const ALLOWED_COLUMNS: Record<string, string[]> = {
  categories: [
    "id",
    "name",
    "type",
    "icon",
    "color_scheme_name",
    "transaction_count",
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
    "created_at",
    "updated_at",
    "sort_order",
  ],
  transactions: [
    "id",
    "transaction_date",
    "is_deleted",
    "deleted_at",
    "title",
    "description",
    "amount",
    "is_pending",
    "requires_manual_confirmation",
    "type",
    "is_transfer",
    "transfer_id",
    "related_account_id",
    "account_balance_before",
    "subtype",
    "extra",
    "has_attachments",
    "category_id",
    "account_id",
    "recurring_id",
    "location",
    "goal_id",
    "budget_id",
    "loan_id",
    "created_at",
    "updated_at",
  ],
  tags: [
    "id",
    "name",
    "type",
    "color_scheme_name",
    "icon",
    "transaction_count",
    "created_at",
    "updated_at",
  ],
  transaction_tags: ["id", "transaction_id", "tag_id"],
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
  recurring_transactions: [
    "id",
    "json_transaction_template",
    "transfer_to_account_id",
    "range",
    "rules",
    "created_at",
    "last_generated_transaction_date",
    "disabled",
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
  budget_accounts: ["id", "budget_id", "account_id", "created_at"],
  budget_categories: ["id", "budget_id", "category_id", "created_at"],
  goal_accounts: ["id", "goal_id", "account_id", "created_at"],
}

/**
 * Batch-insert raw rows into a collection, preserving original IDs.
 *
 * ID preservation: WatermelonDB's `prepareCreate` generates a UUID before calling the
 * creator callback, but the record is stored using `record._raw` as the raw SQLite row.
 * Overriding `record._raw.id` inside the callback replaces the generated ID with the
 * backup's original ID, which WatermelonDB then writes verbatim. This means all FK
 * references in the imported backup survive intact. The `id` key must be present in
 * the ALLOWED_COLUMNS allowlist for the relevant table.
 */
async function insertRows(tableName: string, rows: RawRow[]): Promise<void> {
  if (rows.length === 0) return
  const collection = database.get(tableName)
  const allowed = ALLOWED_COLUMNS[tableName] ?? []
  const CHUNK = 200
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK)
    const ops = chunk.map((row) =>
      collection.prepareCreate((record) => {
        for (const key of allowed) {
          if (key in row) (record._raw as RawRow)[key] = row[key]
        }
      }),
    )
    await database.batch(...ops)
  }
}

/**
 * Wipe the database and restore from the given backup.
 * Import order respects foreign-key dependency tiers.
 * Validates referential integrity before inserting foreign-key-dependent rows.
 */
export async function importBackup(
  backup: MintyFlowBackup,
): Promise<ImportResult> {
  try {
    const { data } = backup

    // 1️⃣ Build valid ID sets for FK validation (before any DB writes).
    const validAccountIds = new Set(data.accounts.map((a: RawRow) => a.id))
    const validCategoryIds = new Set(data.categories.map((c: RawRow) => c.id))
    const validTagIds = new Set(data.tags.map((t: RawRow) => t.id))
    const validRecurringIds = new Set(
      data.recurring_transactions.map((r: RawRow) => r.id),
    )
    const validBudgetIds = new Set(data.budgets.map((b: RawRow) => b.id))
    const validGoalIds = new Set(data.goals.map((g: RawRow) => g.id))
    const validLoanIds = new Set(data.loans.map((l: RawRow) => l.id))
    const validTransactionIds = new Set(
      data.transactions.map((t: RawRow) => t.id),
    )

    // 2️⃣ Validate transactions before writing to DB.
    // This guards against data loss: if validation fails, no DB mutation happens.
    for (const tx of data.transactions) {
      const txRow = tx as RawRow
      if (!validAccountIds.has(txRow.account_id as string)) {
        throw new Error(
          `Transaction ${txRow.id} references invalid account_id ${txRow.account_id}`,
        )
      }
      if (
        txRow.category_id &&
        !validCategoryIds.has(txRow.category_id as string)
      ) {
        throw new Error(
          `Transaction ${txRow.id} references invalid category_id ${txRow.category_id}`,
        )
      }
      if (
        txRow.recurring_id &&
        !validRecurringIds.has(txRow.recurring_id as string)
      ) {
        throw new Error(
          `Transaction ${txRow.id} references invalid recurring_id ${txRow.recurring_id}`,
        )
      }
      if (txRow.goal_id && !validGoalIds.has(txRow.goal_id as string)) {
        throw new Error(
          `Transaction ${txRow.id} references invalid goal_id ${txRow.goal_id}`,
        )
      }
      if (txRow.budget_id && !validBudgetIds.has(txRow.budget_id as string)) {
        throw new Error(
          `Transaction ${txRow.id} references invalid budget_id ${txRow.budget_id}`,
        )
      }
      if (txRow.loan_id && !validLoanIds.has(txRow.loan_id as string)) {
        throw new Error(
          `Transaction ${txRow.id} references invalid loan_id ${txRow.loan_id}`,
        )
      }
    }

    //  2️⃣.b️ Validate join table rows for dangling FKs before any DB write.
    for (const row of data.transaction_tags) {
      const r = row as RawRow
      if (!validTransactionIds.has(r.transaction_id as string)) {
        throw new Error(
          `transaction_tags row ${r.id} references invalid transaction_id ${r.transaction_id}`,
        )
      }
      if (!validTagIds.has(r.tag_id as string)) {
        throw new Error(
          `transaction_tags row ${r.id} references invalid tag_id ${r.tag_id}`,
        )
      }
    }
    for (const row of data.budget_accounts) {
      const r = row as RawRow
      if (!validBudgetIds.has(r.budget_id as string)) {
        throw new Error(
          `budget_accounts row ${r.id} references invalid budget_id ${r.budget_id}`,
        )
      }
      if (!validAccountIds.has(r.account_id as string)) {
        throw new Error(
          `budget_accounts row ${r.id} references invalid account_id ${r.account_id}`,
        )
      }
    }
    for (const row of data.budget_categories) {
      const r = row as RawRow
      if (!validBudgetIds.has(r.budget_id as string)) {
        throw new Error(
          `budget_categories row ${r.id} references invalid budget_id ${r.budget_id}`,
        )
      }
      if (!validCategoryIds.has(r.category_id as string)) {
        throw new Error(
          `budget_categories row ${r.id} references invalid category_id ${r.category_id}`,
        )
      }
    }
    for (const row of data.goal_accounts) {
      const r = row as RawRow
      if (!validGoalIds.has(r.goal_id as string)) {
        throw new Error(
          `goal_accounts row ${r.id} references invalid goal_id ${r.goal_id}`,
        )
      }
      if (!validAccountIds.has(r.account_id as string)) {
        throw new Error(
          `goal_accounts row ${r.id} references invalid account_id ${r.account_id}`,
        )
      }
    }

    // 3️⃣ Snapshot current data so we can restore if the import fails.
    // This does not protect against process-kill mid-unsafeResetDatabase (a WatermelonDB
    // architectural limitation), but it does guard against any JS-layer error during
    // the tiered inserts — the most common failure mode.
    const snapshot = await buildBackupInMemory()

    // 4️⃣ Reset DB then insert all tiers.
    // **Note on atomicity**: `unsafeResetDatabase` issues DDL outside the WatermelonDB
    // write transaction. A process-kill between the reset and the first insertRows call
    // leaves the DB empty with no recovery path. The snapshot above mitigates JS-layer
    // failures but cannot recover from a mid-DDL process kill.
    try {
      await database.write(async () => {
        await database.unsafeResetDatabase()

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
      })
    } catch (importError) {
      // Import failed after the DB was wiped — attempt to restore the pre-import snapshot.
      try {
        await database.write(async () => {
          await database.unsafeResetDatabase()
          const s = snapshot.data
          await insertRows("categories", s.categories)
          await insertRows("tags", s.tags)
          await insertRows("accounts", s.accounts)
          await insertRows("recurring_transactions", s.recurring_transactions)
          await insertRows("budgets", s.budgets)
          await insertRows("goals", s.goals)
          await insertRows("loans", s.loans)
          await insertRows("transactions", s.transactions)
          await insertRows("transfers", s.transfers)
          await insertRows("transaction_tags", s.transaction_tags)
          await insertRows("budget_accounts", s.budget_accounts)
          await insertRows("budget_categories", s.budget_categories)
          await insertRows("goal_accounts", s.goal_accounts)
        })
      } catch {
        // Restore also failed — surface a descriptive error so the caller can prompt
        // the user to manually re-import from their last exported backup file.
        throw new Error(
          `Import failed and automatic restore failed: ${importError instanceof Error ? importError.message : String(importError)}. Please re-import from your last exported backup file.`,
        )
      }
      throw importError
    }

    // 5️⃣ Count imported rows
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

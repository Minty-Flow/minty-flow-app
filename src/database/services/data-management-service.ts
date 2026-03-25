import { Q } from "@nozbe/watermelondb"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system/legacy"
import * as IntentLauncher from "expo-intent-launcher"
import { Platform, Share } from "react-native"

import { getMimeTypeForExtension } from "~/utils/file-icon"

import { database } from "../index"

// ─── Backup types ────────────────────────────────────────────────────────────

export interface BackupMeta {
  version: 1
  schemaVersion: number
  exportedAt: string
  appId: "minty-flow"
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SCHEMA_VERSION = 2
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

/** Build the full JSON backup and write it to the exports dir. Returns { uri, fileName }. */
async function generateJsonBackup(): Promise<{
  uri: string
  fileName: string
}> {
  const dir = await prepareExportDir()

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

  const backup: MintyFlowBackup = {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appId: "minty-flow",
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
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
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

  const csv = [headers.join(","), ...rows].join("\n")
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
 * Returns the typed backup or null if invalid.
 */
export function validateBackup(json: string): MintyFlowBackup | null {
  try {
    const parsed = JSON.parse(json) as unknown
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("meta" in parsed) ||
      !("data" in parsed)
    ) {
      return null
    }
    const p = parsed as Record<string, unknown>
    const meta = p.meta as Record<string, unknown> | undefined
    if (!meta || meta.version !== 1 || meta.appId !== "minty-flow") {
      return null
    }
    const data = p.data as Record<string, unknown> | undefined
    if (!data) {
      return null
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
        return null
      }
    }

    return parsed as MintyFlowBackup
  } catch {
    return null
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

/** Batch-insert raw rows into a collection, preserving IDs. */
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
    // Full wipe — canonical WatermelonDB reset for local-only apps
    await database.write(async () => {
      await database.unsafeResetDatabase()
    })

    const { data } = backup

    // Tier 1: no foreign-key dependencies
    await database.write(async () => {
      await insertRows("categories", data.categories)
      await insertRows("tags", data.tags)
      await insertRows("accounts", data.accounts)
    })

    // Build valid ID sets for referential integrity checks
    const validAccountIds = new Set(data.accounts.map((a: RawRow) => a.id))
    const validCategoryIds = new Set(data.categories.map((c: RawRow) => c.id))
    const validRecurringIds = new Set(
      data.recurring_transactions.map((r: RawRow) => r.id),
    )
    const validBudgetIds = new Set(data.budgets.map((b: RawRow) => b.id))
    const validGoalIds = new Set(data.goals.map((g: RawRow) => g.id))
    const validLoanIds = new Set(data.loans.map((l: RawRow) => l.id))

    // Validate Tier 2 & 3 rows before insert
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

    // Tier 2: depend on Tier 1
    await database.write(async () => {
      await insertRows("recurring_transactions", data.recurring_transactions)
      await insertRows("budgets", data.budgets)
      await insertRows("goals", data.goals)
      await insertRows("loans", data.loans)
    })

    // Tier 3: transactions (depend on accounts, categories, recurring, goals, budgets, loans)
    await database.write(async () => {
      await insertRows("transactions", data.transactions)
    })

    // Tier 4: transfers (depend on transactions and accounts)
    await database.write(async () => {
      await insertRows("transfers", data.transfers)
    })

    // Tier 5: join tables
    await database.write(async () => {
      await insertRows("transaction_tags", data.transaction_tags)
      await insertRows("budget_accounts", data.budget_accounts)
      await insertRows("budget_categories", data.budget_categories)
      await insertRows("goal_accounts", data.goal_accounts)
    })

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

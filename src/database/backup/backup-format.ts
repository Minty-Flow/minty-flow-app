import { assertMinorUnits, getMinorUnitDigits } from "~/utils/money"

export interface BackupMeta {
  version: 1
  schemaVersion: number
  exportedAt: string
  appId: "minty-flow-app"
}

export type RawRow = Record<string, unknown>

/** Doubles as the file extension of each export format. */
export type ExportType = "json" | "csv" | "zip"

export interface SavedExport {
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

export type ImportResult =
  | { success: true; counts: Record<string, number> }
  | { success: false; error: string }

export type ValidateBackupResult =
  | { success: true; backup: MintyFlowBackup }
  | {
      success: false
      reason: "parse_error" | "validation_error"
      message: string
    }

export const SCHEMA_VERSION = 3
export const BACKUP_JSON_NAME = "backup.json"

export const DATE_COLUMNS = new Set([
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

export const ALLOWED_COLUMNS: Record<string, string[]> = {
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
  transaction_tags: ["transaction_id", "tag_id"],
  budget_accounts: ["budget_id", "account_id", "created_at"],
  budget_categories: ["budget_id", "category_id", "created_at"],
  goal_accounts: ["goal_id", "account_id", "created_at"],
}

export const RESET_ORDER = [
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

export function defaultExportBaseName(type: ExportType): string {
  const date = new Date().toISOString().slice(0, 10)
  const stem = type === "csv" ? "minty-flow-transactions" : "minty-flow-backup"
  return `${stem}-${date}`
}

export function normalizeColumnValue(col: string, val: unknown): unknown {
  if (col === "loan_type" && typeof val === "string") {
    if (val === "LENT") return "lent"
    if (val === "BORROWED") return "borrowed"
  }
  if (col === "range") return normalizeRecurringRange(val)
  if (
    DATE_COLUMNS.has(col) &&
    typeof val === "number" &&
    Number.isFinite(val)
  ) {
    return new Date(val).toISOString()
  }
  return val ?? null
}

export function deriveHasAttachments(extraJson: unknown): number {
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

function toTimestampMs(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value) {
    const ms = Date.parse(value)
    return Number.isFinite(ms) ? ms : null
  }
  return null
}

function normalizeRecurringRange(value: unknown): unknown {
  if (typeof value !== "string" || !value) return value ?? null
  try {
    const range = JSON.parse(value) as RawRow
    const from = toTimestampMs(
      range.from ?? range.startDate ?? range.start_date,
    )
    const to =
      toTimestampMs(range.to ?? range.endDate ?? range.end_date) ??
      new Date(2099, 11, 31).getTime()
    if (from === null) return value
    return JSON.stringify({ from, to })
  } catch {
    return value
  }
}

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
      meta.schemaVersion !== SCHEMA_VERSION
    ) {
      const schemaVersion =
        typeof meta.schemaVersion === "number" ? meta.schemaVersion : undefined
      const msg =
        schemaVersion === undefined || schemaVersion < SCHEMA_VERSION
          ? `Backup uses schema v${schemaVersion}. App is v${SCHEMA_VERSION}. Create a new backup with a current app version before restoring here.`
          : `Backup schema version ${schemaVersion} is newer than app schema version ${SCHEMA_VERSION}. Update the app first.`
      return {
        success: false,
        reason: "validation_error",
        message: msg,
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

    const moneyColumns: Partial<Record<string, string[]>> = {
      accounts: ["balance"],
      budgets: ["amount"],
      goals: ["target_amount"],
      loans: ["principal_amount"],
      transactions: ["amount", "account_balance_before"],
    }
    for (const [table, columns] of Object.entries(moneyColumns)) {
      const rows = data[table] as RawRow[]
      for (const [index, row] of rows.entries()) {
        for (const column of columns ?? []) {
          try {
            assertMinorUnits(row[column] as number)
          } catch {
            return {
              success: false,
              reason: "validation_error",
              message: `Invalid integer money: ${table}.${column} (row ${index})`,
            }
          }
        }
      }
    }

    for (const table of ["accounts", "budgets", "goals"]) {
      for (const [index, row] of (data[table] as RawRow[]).entries()) {
        try {
          getMinorUnitDigits(String(row.currency_code))
        } catch {
          return {
            success: false,
            reason: "validation_error",
            message: `Unknown currency: ${table} (row ${index})`,
          }
        }
      }
    }

    const accountIds = new Set(
      (data.accounts as RawRow[]).map((row) => String(row.id)),
    )
    for (const [index, row] of (
      data.recurring_transactions as RawRow[]
    ).entries()) {
      try {
        const template = JSON.parse(
          String(row.json_transaction_template),
        ) as RawRow
        assertMinorUnits(template.amount as number)
        if (!accountIds.has(String(template.accountId))) {
          throw new Error("Unknown recurring account")
        }
      } catch {
        return {
          success: false,
          reason: "validation_error",
          message: `Invalid recurring money template (row ${index})`,
        }
      }
    }

    const transactions = data.transactions as unknown[]
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

    const accounts = data.accounts as unknown[]
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

    const categories = data.categories as unknown[]
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

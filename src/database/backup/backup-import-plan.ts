import { sql } from "drizzle-orm"

import {
  ALLOWED_COLUMNS,
  deriveHasAttachments,
  type MintyFlowBackup,
  normalizeColumnValue,
  type RawRow,
  RESET_ORDER,
} from "~/database/backup/backup-format"
import { runInTransaction } from "~/database/transaction"
import { deriveKind } from "~/domain/derive-kind"
import { TransactionKindEnum } from "~/types/transactions"

type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

const KNOWN_KINDS = new Set<string>(Object.values(TransactionKindEnum))

/** Maps loan id → normalized loan_type, for deriveKind on `kind`-less transaction rows. */
function buildLoanTypeMap(loans: RawRow[]): Map<string, "lent" | "borrowed"> {
  const map = new Map<string, "lent" | "borrowed">()
  for (const loan of loans) {
    const id = typeof loan.id === "string" ? loan.id : null
    const loanType = normalizeColumnValue("loan_type", loan.loan_type)
    if (id && (loanType === "lent" || loanType === "borrowed")) {
      map.set(id, loanType)
    }
  }
  return map
}

function resolveTransactionKind(
  row: RawRow,
  loanTypeById: Map<string, "lent" | "borrowed">,
): string {
  if (typeof row.kind === "string" && KNOWN_KINDS.has(row.kind)) return row.kind
  const loanId = typeof row.loan_id === "string" ? row.loan_id : null
  return deriveKind({
    subtype: typeof row.subtype === "string" ? row.subtype : null,
    isPending: row.is_pending === 1 || row.is_pending === true,
    type: typeof row.type === "string" ? row.type : "",
    loanType: loanId ? (loanTypeById.get(loanId) ?? null) : null,
    recurringId: typeof row.recurring_id === "string" ? row.recurring_id : null,
  })
}

export async function resetDatabaseForBackupImport(): Promise<void> {
  await runInTransaction("import.reset", (db) => {
    db.run(
      sql.raw(RESET_ORDER.map((table) => `DELETE FROM ${table}`).join(";\n")),
    )
  })
}

/**
 * Insert rows into a table using parameterized INSERT.
 * Unknown columns (e.g., WDB `id` in join tables) are silently dropped via ALLOWED_COLUMNS.
 * WDB Unix-ms timestamps are converted to ISO strings via normalizeColumnValue.
 * has_attachments is re-derived from extra JSON for transactions.
 */
function insertRows(
  db: Db,
  tableName: string,
  rows: RawRow[],
  loanTypeById?: Map<string, "lent" | "borrowed">,
): void {
  if (rows.length === 0) return
  const cols = ALLOWED_COLUMNS[tableName] ?? []
  if (cols.length === 0) return
  const isTransactions = tableName === "transactions"
  const queryPrefix = `INSERT INTO ${tableName} (${cols.join(", ")}) VALUES `

  for (const row of rows) {
    const values = cols.map((col) => {
      if (isTransactions && col === "has_attachments") {
        return deriveHasAttachments(row.extra)
      }
      if (isTransactions && col === "kind") {
        return resolveTransactionKind(row, loanTypeById ?? new Map())
      }
      return normalizeColumnValue(col, row[col])
    })
    db.run(
      sql`${sql.raw(queryPrefix)}(${sql.join(
        values.map((value) => sql`${value as string | number | null}`),
        sql`, `,
      )})`,
    )
  }
}

export function insertBackupData(db: Db, data: MintyFlowBackup["data"]): void {
  // Tier 1: no FK dependencies
  insertRows(db, "categories", data.categories)
  insertRows(db, "tags", data.tags)
  insertRows(db, "accounts", data.accounts)

  // Tier 2: depend on Tier 1
  insertRows(db, "recurring_transactions", data.recurring_transactions)
  insertRows(db, "budgets", data.budgets)
  insertRows(db, "goals", data.goals)
  insertRows(db, "loans", data.loans)

  // Tier 3: transactions — `kind`-less rows are backfilled via deriveKind, which
  // needs each linked loan's type.
  insertRows(
    db,
    "transactions",
    data.transactions,
    buildLoanTypeMap(data.loans),
  )

  // Tier 4: transfers
  insertRows(db, "transfers", data.transfers)

  // Tier 5: join tables
  insertRows(db, "transaction_tags", data.transaction_tags)
  insertRows(db, "budget_accounts", data.budget_accounts)
  insertRows(db, "budget_categories", data.budget_categories)
  insertRows(db, "goal_accounts", data.goal_accounts)
}

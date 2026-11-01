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
import { LoanTermEnum } from "~/types/loans"
import { TransactionKindEnum } from "~/types/transactions"

type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

const KNOWN_KINDS = new Set<string>(Object.values(TransactionKindEnum))
const KNOWN_LOAN_TERMS = new Set<string>(Object.values(LoanTermEnum))

/**
 * `term`-less loan rows come from v4-or-earlier snapshots; those loans all
 * predate Slice 4, so they are progress-tracked long-term loans.
 */
function resolveLoanTerm(row: RawRow): string {
  return typeof row.term === "string" && KNOWN_LOAN_TERMS.has(row.term)
    ? row.term
    : LoanTermEnum.LONG_TERM
}

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
  // One statement per run(): expo-sqlite prepares a single statement, so a
  // joined "DELETE ...; DELETE ..." script would only clear the first table.
  await runInTransaction("import.reset", (db) => {
    for (const table of RESET_ORDER) {
      db.run(sql.raw(`DELETE FROM ${table}`))
    }
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
  const isLoans = tableName === "loans"
  const queryPrefix = `INSERT INTO ${tableName} (${cols.join(", ")}) VALUES `

  for (const row of rows) {
    const values = cols.map((col) => {
      if (isTransactions && col === "has_attachments") {
        return deriveHasAttachments(row.extra)
      }
      if (isTransactions && col === "kind") {
        return resolveTransactionKind(row, loanTypeById ?? new Map())
      }
      if (isLoans && col === "term") {
        return resolveLoanTerm(row)
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

/**
 * Migrations 0004 and 0005 repaired data in place without bumping
 * SCHEMA_VERSION, so an older backup restores the damage they fixed. Run the
 * same repairs after an import. One statement per run().
 */
const POST_IMPORT_REPAIRS = [
  // A recurring template pointing at a deleted category: clear it.
  `UPDATE recurring_transactions
   SET json_transaction_template = json_set(json_transaction_template, '$.categoryId', NULL)
   WHERE json_valid(json_transaction_template)
     AND json_extract(json_transaction_template, '$.categoryId') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1 FROM categories
       WHERE categories.id = json_extract(recurring_transactions.json_transaction_template, '$.categoryId')
     )`,
  // A template whose account is gone can never generate: disable the rule.
  `UPDATE recurring_transactions
   SET disabled = 1
   WHERE disabled = 0
     AND json_valid(json_transaction_template)
     AND NOT EXISTS (
       SELECT 1 FROM accounts
       WHERE accounts.id = json_extract(recurring_transactions.json_transaction_template, '$.accountId')
     )`,
  // A loan-linked row carries its loan's kind.
  `UPDATE transactions
   SET kind = CASE (SELECT loan_type FROM loans WHERE loans.id = transactions.loan_id)
     WHEN 'lent' THEN 'lent'
     ELSE 'borrowed'
   END
   WHERE loan_id IS NOT NULL
     AND EXISTS (SELECT 1 FROM loans WHERE loans.id = transactions.loan_id)
     AND kind != CASE (SELECT loan_type FROM loans WHERE loans.id = transactions.loan_id)
       WHEN 'lent' THEN 'lent'
       ELSE 'borrowed'
     END`,
]

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

  repairImportedData(db)
}

export function repairImportedData(db: Db): void {
  for (const statement of POST_IMPORT_REPAIRS) db.run(sql.raw(statement))
}

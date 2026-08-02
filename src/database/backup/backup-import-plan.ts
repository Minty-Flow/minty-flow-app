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

type Db = Parameters<Parameters<typeof runInTransaction>[1]>[0]

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
function insertRows(db: Db, tableName: string, rows: RawRow[]): void {
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

  // Tier 3: transactions
  insertRows(db, "transactions", data.transactions)

  // Tier 4: transfers
  insertRows(db, "transfers", data.transfers)

  // Tier 5: join tables
  insertRows(db, "transaction_tags", data.transaction_tags)
  insertRows(db, "budget_accounts", data.budget_accounts)
  insertRows(db, "budget_categories", data.budget_categories)
  insertRows(db, "goal_accounts", data.goal_accounts)
}

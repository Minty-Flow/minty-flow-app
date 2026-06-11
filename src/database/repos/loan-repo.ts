import { query, queryOne } from "../sql"
import type { RowLoan } from "../types/rows"

export async function getAllLoans(): Promise<RowLoan[]> {
  return query<RowLoan>(`SELECT * FROM loans ORDER BY name ASC`)
}

// export async function getLoanById(id: string): Promise<RowLoan | null> {
//   return queryOne<RowLoan>(`SELECT * FROM loans WHERE id = ?`, [id])
// }

export async function getLoanProgress(
  loanId: string,
  loanType: "lent" | "borrowed",
): Promise<number> {
  const repaymentType = loanType === "lent" ? "income" : "expense"
  const row = await queryOne<{ total: number }>(
    `SELECT COALESCE(SUM(ABS(amount)), 0) as total
     FROM transactions
     WHERE loan_id = ?
       AND type = ?
       AND is_deleted = 0
       AND is_pending = 0`,
    [loanId, repaymentType],
  )
  return row?.total ?? 0
}

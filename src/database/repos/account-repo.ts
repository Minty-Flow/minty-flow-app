import { query } from "../sql"
import type { RowAccount } from "../types/rows"

export async function getAllAccounts(): Promise<RowAccount[]> {
  return query<RowAccount>(`
    SELECT * FROM accounts
    ORDER BY sort_order ASC, created_at ASC
  `)
}

// export async function getAccountById(id: string): Promise<RowAccount | null> {
//   return queryOne<RowAccount>(`SELECT * FROM accounts WHERE id = ?`, [id])
// }

import { query } from "../sql"
import type { RowTransactionTag } from "../types/rows"

export async function getTagsForTransactions(
  txIds: string[],
): Promise<RowTransactionTag[]> {
  if (txIds.length === 0) return []
  const placeholders = txIds.map(() => "?").join(",")
  return query<RowTransactionTag>(
    `SELECT transaction_id, tag_id FROM transaction_tags
     WHERE transaction_id IN (${placeholders})`,
    txIds,
  )
}

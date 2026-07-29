import { inArray } from "drizzle-orm"

import { drizzleDb } from "../drizzle/db"
import { transactionTags } from "../drizzle/schema"
import type { RowTransactionTag } from "../types/rows"

export async function getTagsForTransactions(
  txIds: string[],
): Promise<RowTransactionTag[]> {
  if (txIds.length === 0) return []
  return drizzleDb
    .select({
      transaction_id: transactionTags.transactionId,
      tag_id: transactionTags.tagId,
    })
    .from(transactionTags)
    .where(inArray(transactionTags.transactionId, txIds))
    .all()
}

import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"

export function isUpcoming(row: TransactionWithRelations): boolean {
  return row.isPending || !!row.extra?.recurringId
}

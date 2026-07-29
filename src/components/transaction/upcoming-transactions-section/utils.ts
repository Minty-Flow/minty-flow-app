import type { TransactionWithRelations } from "~/stores/db/transaction.store"

export function isUpcoming(row: TransactionWithRelations): boolean {
  return row.isPending || !!row.extra?.recurringId
}

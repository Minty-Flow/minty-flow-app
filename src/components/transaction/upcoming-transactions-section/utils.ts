import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"

export function isUpcoming(row: TransactionWithRelations): boolean {
  return row.isPending || !!row.extra?.recurringId
}

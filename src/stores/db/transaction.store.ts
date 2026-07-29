import {
  type TransactionFilters,
  type TransactionWithRelations,
  useTransactionsQuery,
} from "~/database/drizzle/hooks/use-transactions-query"

export type { TransactionFilters, TransactionWithRelations }

type Status = "idle" | "loading" | "ready" | "error"

export function useTransactions(filters: TransactionFilters): {
  items: TransactionWithRelations[]
  status: Status
} {
  return useTransactionsQuery(filters)
}

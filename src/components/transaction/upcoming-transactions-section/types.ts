import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"

export interface UseUpcomingSectionOptions {
  transactions: TransactionWithRelations[]
  onTransactionPress: (transactionId: string) => void
  /** Hide rows dated further ahead than this many days. Overdue rows always show. */
  horizonDays?: number
}

export type UpcomingSection = {
  key: string
  data: TransactionWithRelations[]
} & (
  | { upcoming: "summary"; recurringCount: number; pendingCount: number }
  | { upcoming: "recurring" }
  | { upcoming: "pending"; onConfirmAll?: () => void }
)

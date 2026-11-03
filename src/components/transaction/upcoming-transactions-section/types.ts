import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"

export interface UpcomingTransactionsSectionProps {
  transactions: TransactionWithRelations[]
  onTransactionPress: (transactionId: string) => void
  /** Hide rows dated further ahead than this many days. Overdue rows always show. */
  horizonDays?: number
}

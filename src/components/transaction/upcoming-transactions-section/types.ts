import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"

export interface UpcomingTransactionsSectionProps {
  transactions: TransactionWithRelations[]
  onTransactionPress: (transactionId: string) => void
}

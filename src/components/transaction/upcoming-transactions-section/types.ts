import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"

export interface UpcomingTransactionsSectionProps {
  transactions: TransactionWithRelations[]
  onTransactionPress: (transactionId: string) => void
}

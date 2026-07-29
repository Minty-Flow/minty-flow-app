import type { TransactionWithRelations } from "~/stores/db/transaction.store"

export interface UpcomingTransactionsSectionProps {
  transactions: TransactionWithRelations[]
  onTransactionPress: (transactionId: string) => void
}

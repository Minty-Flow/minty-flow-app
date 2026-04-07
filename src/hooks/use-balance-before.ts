import { useEffect, useState } from "react"

import type TransactionModel from "~/database/models/transaction"
import { getBalanceAtTransaction } from "~/database/services/balance-service"
import { logger } from "~/utils/logger"

/**
 * Returns the account's running balance at the moment this transaction settled.
 * This is what Flow displays next to the account name (balance after = snapshot).
 */
export function useBalanceAtTransaction(
  transaction: TransactionModel | null,
): number | null {
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (!transaction) {
      setBalance(null)
      return
    }
    getBalanceAtTransaction(transaction)
      .then(setBalance)
      .catch((e) => logger.error("Balance fetch failed", { error: String(e) }))
  }, [transaction])

  return balance
}

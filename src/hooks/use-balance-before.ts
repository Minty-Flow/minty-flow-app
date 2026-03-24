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

  const accountId = transaction?.accountId ?? null
  const transactionDate = transaction?.transactionDate ?? null

  useEffect(() => {
    if (!accountId || transactionDate === null) {
      setBalance(null)
      return
    }
    const ts =
      transactionDate instanceof Date
        ? transactionDate.getTime()
        : transactionDate
    getBalanceAtTransaction(accountId, ts)
      .then(setBalance)
      .catch((e) => logger.error("Balance fetch failed", { error: String(e) }))
  }, [accountId, transactionDate])

  return balance
}

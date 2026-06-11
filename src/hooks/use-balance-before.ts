import { useEffect, useState } from "react"

import { getBalanceAtTransaction } from "~/database/services-sqlite/balance-service"
import type { Transaction } from "~/types/transactions"
import { logger } from "~/utils/logger"

/**
 * Returns the account's running balance at the moment this transaction settled.
 * This is what Flow displays next to the account name (balance after = snapshot).
 */
export function useBalanceAtTransaction(
  transaction: Pick<
    Transaction,
    "id" | "accountId" | "transactionDate" | "amount" | "type"
  > | null,
): number | null {
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    if (!transaction) {
      setBalance(null)
      return
    }
    let cancelled = false
    getBalanceAtTransaction(transaction)
      .then((b) => {
        if (!cancelled) setBalance(b)
      })
      .catch((e) => {
        if (!cancelled)
          logger.error("Balance fetch failed", { error: String(e) })
      })
    return () => {
      cancelled = true
    }
  }, [transaction])

  return balance
}

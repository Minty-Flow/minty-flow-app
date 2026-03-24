import { useEffect, useState } from "react"

import type RecurringTransactionModel from "~/database/models/recurring-transaction"
import { findRecurringById } from "~/database/services/recurring-transaction-service"

/**
 * Fetch the recurring rule for a transaction. Returns null when ruleId is null
 * or the rule is not found.
 */
export function useRecurringRule(
  ruleId: string | null,
): RecurringTransactionModel | null {
  const [rule, setRule] = useState<RecurringTransactionModel | null>(null)

  useEffect(() => {
    if (!ruleId) {
      setRule(null)
      return
    }
    let cancelled = false
    findRecurringById(ruleId)
      .then((r) => {
        if (!cancelled) setRule(r)
      })
      .catch(() => {
        if (!cancelled) setRule(null)
      })
    return () => {
      cancelled = true
    }
  }, [ruleId])

  return rule
}

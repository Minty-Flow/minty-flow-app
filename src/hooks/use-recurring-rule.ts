import { useEffect, useState } from "react"

import {
  findRecurringById,
  type RecurringTransactionTemplate,
} from "~/database/services-sqlite/recurring-transaction-service"

/**
 * Fetch the recurring rule for a transaction. Returns null when ruleId is null
 * or the rule is not found.
 */
export function useRecurringRule(
  ruleId: string | null,
): RecurringTransactionTemplate | null {
  const [rule, setRule] = useState<RecurringTransactionTemplate | null>(null)

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

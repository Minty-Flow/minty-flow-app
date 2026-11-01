import { useEffect, useState } from "react"

import {
  findRecurringById,
  type RecurringRuleDetails,
} from "~/database/services/recurring-transaction-service"

/**
 * Fetch the recurring rule for a transaction. `rule` is null when ruleId is
 * null or the rule is not found; `loading` is true until the lookup settles,
 * so a caller can tell "not loaded yet" from "no rule".
 */
export function useRecurringRuleState(ruleId: string | null): {
  rule: RecurringRuleDetails | null
  loading: boolean
} {
  const [state, setState] = useState<{
    id: string | null
    rule: RecurringRuleDetails | null
  }>({ id: null, rule: null })

  useEffect(() => {
    if (!ruleId) return
    let cancelled = false
    findRecurringById(ruleId)
      .then((r) => {
        if (!cancelled) setState({ id: ruleId, rule: r })
      })
      .catch(() => {
        if (!cancelled) setState({ id: ruleId, rule: null })
      })
    return () => {
      cancelled = true
    }
  }, [ruleId])

  if (!ruleId) return { rule: null, loading: false }
  if (state.id !== ruleId) return { rule: null, loading: true }
  return { rule: state.rule, loading: false }
}

/**
 * Fetch the recurring rule for a transaction. Returns null when ruleId is null
 * or the rule is not found.
 */
export function useRecurringRule(
  ruleId: string | null,
): RecurringRuleDetails | null {
  return useRecurringRuleState(ruleId).rule
}

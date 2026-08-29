import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import { TransactionTypeEnum } from "~/types/transactions"
import {
  type BalanceEvent,
  type ProjectBalanceResult,
  projectBalance,
} from "~/utils/project-balance"
import { occurrenceDatesInWindow } from "~/utils/recurrence"

import { drizzleDb } from "../db"
import { recurringTransactions } from "../schema"
import { useAccounts } from "./account-read-model"
import {
  parseRecurringRules,
  parseRecurringTemplate,
} from "./recurring-read-model"
import { useTransactions } from "./transaction-read-model"

const DAY_MS = 24 * 60 * 60 * 1000

export interface ProjectedBalanceData {
  result: ProjectBalanceResult
  /** Currency of the first included account. */
  currency: string
  /** false → no recurring/pending inputs; caller shows empty copy, not a flat line. */
  hasInputs: boolean
}

/**
 * Forward balance projection for a set of accounts.
 *
 * ponytail: balances are summed raw, so all `accountIds` must share one
 * currency (account detail passes one id; the cash-flow section passes one
 * currency's accounts). No FX here.
 */
export function useProjectedBalance(
  accountIds: string[],
  horizonDays: number,
): ProjectedBalanceData {
  const accounts = useAccounts()
  const rulesResult = useLiveQuery(
    drizzleDb.select().from(recurringTransactions),
  )
  const { items: pending } = useTransactions({ accountIds, isPending: true })

  const idSet = new Set(accountIds)
  const included = accounts.filter((a) => idSet.has(a.id))
  const startBalanceMinor = included.reduce((s, a) => s + a.balance, 0)
  const currency = included[0]?.currencyCode ?? ""

  const now = new Date()
  const nowMs = now.getTime()
  const horizonEnd = new Date(nowMs + horizonDays * DAY_MS)

  const events: BalanceEvent[] = []

  // Future recurring occurrences not yet spawned as transactions.
  for (const row of rulesResult.data) {
    if (row.disabled) continue
    const template = parseRecurringTemplate(row.jsonTransactionTemplate)
    if (!template || !idSet.has(template.accountId)) continue
    const rules = parseRecurringRules(row.rules)
    if (rules.length === 0) continue
    const delta =
      template.type === TransactionTypeEnum.INCOME
        ? template.amount
        : template.type === TransactionTypeEnum.EXPENSE
          ? -template.amount
          : 0
    if (delta === 0) continue
    for (const d of occurrenceDatesInWindow(rules[0], now, horizonEnd)) {
      events.push({ atMs: d.getTime(), deltaMinor: delta })
    }
  }

  // Still-pending one-offs. Recurring spawns are excluded — the loop above
  // already projects the rule, so counting the pending instance too would
  // double it.
  for (const tx of pending) {
    if (tx.recurringId || !idSet.has(tx.accountId)) continue
    events.push({
      atMs: new Date(tx.transactionDate).getTime(),
      deltaMinor: getBalanceDelta(tx.amount, tx.type, tx.subtype),
    })
  }

  const result = projectBalance({
    startBalanceMinor,
    events,
    horizonDays,
    nowMs,
  })
  return { result, currency, hasInputs: events.length > 0 }
}

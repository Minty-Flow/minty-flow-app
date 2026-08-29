import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { useSafeToSpendStore } from "~/stores/safe-to-spend.store"
import { TransactionTypeEnum } from "~/types/transactions"
import { occurrencesInWindow } from "~/utils/recurrence"
import {
  computeSafeToSpend,
  currentMonthBounds,
  remainingUnitsInMonth,
  type SafeToSpendResult,
} from "~/utils/safe-to-spend"

import { drizzleDb } from "../db"
import { recurringTransactions } from "../schema"
import { useAccounts } from "./account-read-model"
import {
  parseRecurringRange,
  parseRecurringRules,
  parseRecurringTemplate,
} from "./recurring-read-model"

export interface SafeToSpendBreakdown {
  balanceMinor: number
  upcomingIncomeMinor: number
  upcomingBillsMinor: number
  goalContributionsMinor: number
  remainingUnits: number
}

export interface SafeToSpendCurrencyRow extends SafeToSpendResult {
  currencyCode: string
  breakdown: SafeToSpendBreakdown
}

export interface SafeToSpendData {
  /** At least one included account exists. */
  hasData: boolean
  /**
   * One row per currency that has an included account, sorted by code. The
   * app is multi-currency and does no FX — currencies are never summed; the
   * UI lists them the way the Home income/expense summary does.
   */
  rows: SafeToSpendCurrencyRow[]
  /** Days (or weeks) left in the month — the same divisor for every row. */
  remainingUnits: number
}

export function useSafeToSpend(): SafeToSpendData {
  const cadence = useSafeToSpendStore((s) => s.cadence)
  const includedAccountIds = useSafeToSpendStore((s) => s.includedAccountIds)

  const accounts = useAccounts()
  const rulesResult = useLiveQuery(
    drizzleDb.select().from(recurringTransactions),
  )

  const now = new Date()
  const { end: monthEnd } = currentMonthBounds(now)
  const remainingUnits = remainingUnitsInMonth(now, cadence)

  const included = accounts.filter((a) => {
    if (includedAccountIds.length > 0) return includedAccountIds.includes(a.id)
    return !a.excludeFromBalance && !a.isArchived
  })
  const currencyByAccountId = new Map(
    accounts.map((a) => [a.id, a.currencyCode]),
  )

  const byCurrency = new Map<
    string,
    { balance: number; income: number; bills: number }
  >()
  const bump = (currency: string) => {
    const cur = byCurrency.get(currency) ?? { balance: 0, income: 0, bills: 0 }
    byCurrency.set(currency, cur)
    return cur
  }
  for (const account of included) {
    bump(account.currencyCode).balance += account.balance
  }

  const includedIds = new Set(included.map((a) => a.id))

  // Recurring income / bills still due between now and month end.
  for (const row of rulesResult.data) {
    if (row.disabled) continue
    const template = parseRecurringTemplate(row.jsonTransactionTemplate)
    if (!template || !includedIds.has(template.accountId)) continue
    const range = parseRecurringRange(row.range)
    const rules = parseRecurringRules(row.rules)
    if (!range || rules.length === 0) continue

    const count = occurrencesInWindow(rules[0], now, monthEnd)
    if (count === 0) continue
    const total = template.amount * count
    const currency = currencyByAccountId.get(template.accountId)
    if (!currency) continue

    if (template.type === TransactionTypeEnum.INCOME) {
      bump(currency).income += total
    } else if (template.type === TransactionTypeEnum.EXPENSE) {
      bump(currency).bills += total
    }
  }

  const rows: SafeToSpendCurrencyRow[] = [...byCurrency.entries()]
    .map(([currencyCode, agg]) => {
      const breakdown: SafeToSpendBreakdown = {
        balanceMinor: agg.balance,
        upcomingIncomeMinor: agg.income,
        upcomingBillsMinor: agg.bills,
        goalContributionsMinor: 0,
        remainingUnits,
      }
      return {
        currencyCode,
        breakdown,
        ...computeSafeToSpend({
          balanceMinor: breakdown.balanceMinor,
          upcomingIncomeMinor: breakdown.upcomingIncomeMinor,
          upcomingBillsMinor: breakdown.upcomingBillsMinor,
          goalContributionsMinor: breakdown.goalContributionsMinor,
          remainingUnits,
        }),
      }
    })
    .sort((a, b) => a.currencyCode.localeCompare(b.currencyCode))

  return { hasData: included.length > 0, rows, remainingUnits }
}

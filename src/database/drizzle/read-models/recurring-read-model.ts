import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { TransactionTypeEnum } from "~/types/transactions"
import { nextAbsoluteOccurrence, occurrencesInWindow } from "~/utils/recurrence"

import { drizzleDb } from "../db"
import { recurringTransactions, transactions } from "../schema"
import { useAccounts } from "./account-read-model"
import { useCategories } from "./category-read-model"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

/** One recurring expense, with its cost normalised to month / year. */
export interface Subscription {
  id: string
  title: string
  amountMinor: number
  currencyCode: string
  accountId: string
  accountName: string
  categoryId: string | null
  categoryName: string | null
  nextChargeAt: Date | null
  monthlyMinor: number
  yearlyMinor: number
  /** Template amount is higher than the most recent charged instance. */
  amountIncreased: boolean
  isPaused: boolean
  /** Most recent charged instance, for jumping to an editable transaction. */
  latestInstanceId: string | null
}

interface ParsedTemplate {
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
}

function parseTemplate(json: string): ParsedTemplate | null {
  try {
    const t = JSON.parse(json) as ParsedTemplate
    if (typeof t.amount !== "number" || typeof t.accountId !== "string") {
      return null
    }
    return t
  } catch {
    return null
  }
}

function parseRange(json: string): { from: number; to: number } | null {
  try {
    const r = JSON.parse(json) as { from: number; to: number }
    if (typeof r.from !== "number" || typeof r.to !== "number") return null
    return r
  } catch {
    return null
  }
}

function parseRules(json: string): string[] {
  try {
    const r = JSON.parse(json) as string[]
    return Array.isArray(r) ? r : []
  } catch {
    return []
  }
}

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Every recurring expense as a subscription row. Read-only aggregation over
 * `recurring_transactions` — no schema of its own. Transfers are excluded;
 * disabled rules surface as `isPaused`.
 */
export function useSubscriptionsQuery(): LiveReadModelResult<Subscription[]> {
  const rulesResult = useLiveQuery(
    drizzleDb.select().from(recurringTransactions),
  )
  const instancesResult = useLiveQuery(
    drizzleDb
      .select({
        id: transactions.id,
        recurringId: transactions.recurringId,
        amount: transactions.amount,
        transactionDate: transactions.transactionDate,
      })
      .from(transactions),
  )
  const accounts = useAccounts()
  const categories = useCategories()

  const accountById = new Map(accounts.map((a) => [a.id, a]))
  const categoryById = new Map(categories.map((c) => [c.id, c]))

  // Most recent charged amount per rule, for price-increase detection.
  const latestByRule = new Map<
    string,
    { amount: number; at: number; id: string }
  >()
  for (const row of instancesResult.data) {
    if (!row.recurringId) continue
    const at = new Date(row.transactionDate).getTime()
    const prev = latestByRule.get(row.recurringId)
    if (!prev || at > prev.at) {
      latestByRule.set(row.recurringId, { amount: row.amount, at, id: row.id })
    }
  }

  const now = new Date()
  const windowEnd = new Date(now.getTime() + YEAR_MS)

  const data: Subscription[] = []
  for (const row of rulesResult.data) {
    if (row.transferToAccountId) continue
    const template = parseTemplate(row.jsonTransactionTemplate)
    if (!template || template.type !== TransactionTypeEnum.EXPENSE) continue

    const range = parseRange(row.range)
    const rules = parseRules(row.rules)
    const account = accountById.get(template.accountId)
    const category = template.categoryId
      ? categoryById.get(template.categoryId)
      : undefined

    const perYear =
      range && rules.length > 0
        ? occurrencesInWindow(rules[0], now, windowEnd)
        : 0
    const yearlyMinor = template.amount * perYear
    const monthlyMinor = Math.round(yearlyMinor / 12)

    const latest = latestByRule.get(row.id)

    data.push({
      id: row.id,
      title: template.title?.trim() || account?.name || "—",
      amountMinor: template.amount,
      currencyCode: account?.currencyCode ?? "",
      accountId: template.accountId,
      accountName: account?.name ?? "—",
      categoryId: template.categoryId,
      categoryName: category?.name ?? null,
      nextChargeAt:
        range && rules.length > 0
          ? nextAbsoluteOccurrence(rules, range, now)
          : null,
      monthlyMinor,
      yearlyMinor,
      amountIncreased: latest != null && template.amount > latest.amount,
      isPaused: !!row.disabled,
      latestInstanceId: latest?.id ?? null,
    })
  }

  data.sort((a, b) => {
    if (a.isPaused !== b.isPaused) return a.isPaused ? 1 : -1
    const at = a.nextChargeAt?.getTime() ?? Number.POSITIVE_INFINITY
    const bt = b.nextChargeAt?.getTime() ?? Number.POSITIVE_INFINITY
    return at - bt
  })

  return createLiveReadModelResult(data, [rulesResult, instancesResult])
}

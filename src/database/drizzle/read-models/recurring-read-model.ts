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
export interface RecurringExpense {
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
  /**
   * Template amount is higher than the last *actually charged* instance
   * (past, confirmed, not deleted). Future/pending spawns already carry the
   * new amount, so they are excluded from this baseline.
   */
  amountIncreased: boolean
  isPaused: boolean
  /** Most recent non-deleted instance, for jumping to an editable transaction. */
  latestInstanceId: string | null
}

export interface ParsedRecurringTemplate {
  amount: number
  type: string
  accountId: string
  categoryId: string | null
  title: string | null
}

export function parseRecurringTemplate(
  json: string,
): ParsedRecurringTemplate | null {
  return parseTemplate(json)
}

export function parseRecurringRange(
  json: string,
): { from: number; to: number } | null {
  return parseRange(json)
}

export function parseRecurringRules(json: string): string[] {
  return parseRules(json)
}

type ParsedTemplate = ParsedRecurringTemplate

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
 * Every recurring expense as a normalised row. Read-only aggregation over
 * `recurring_transactions` — no schema of its own. Transfers are excluded;
 * disabled rules surface as `isPaused`.
 *
 * This is a forecast/cost view. The individual spawned instances (including
 * pending ones awaiting confirmation) belong to the Pending Transactions
 * screen — the two are deliberately independent.
 */
export function useRecurringExpensesQuery(): LiveReadModelResult<
  RecurringExpense[]
> {
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
        isPending: transactions.isPending,
        isDeleted: transactions.isDeleted,
      })
      .from(transactions),
  )
  const accounts = useAccounts()
  const categories = useCategories()

  const accountById = new Map(accounts.map((a) => [a.id, a]))
  const categoryById = new Map(categories.map((c) => [c.id, c]))

  const now = new Date()
  const nowMs = now.getTime()

  // Two per-rule cursors:
  //  - lastCharged: latest past, confirmed, non-deleted instance — the
  //    baseline for price-increase detection.
  //  - latestInstance: latest non-deleted instance of any kind — the row's
  //    tap target.
  const lastChargedByRule = new Map<string, { amount: number; at: number }>()
  const latestInstanceByRule = new Map<string, { id: string; at: number }>()
  for (const row of instancesResult.data) {
    if (!row.recurringId || row.isDeleted) continue
    const at = new Date(row.transactionDate).getTime()

    const latest = latestInstanceByRule.get(row.recurringId)
    if (!latest || at > latest.at) {
      latestInstanceByRule.set(row.recurringId, { id: row.id, at })
    }

    if (row.isPending || at > nowMs) continue
    const charged = lastChargedByRule.get(row.recurringId)
    if (!charged || at > charged.at) {
      lastChargedByRule.set(row.recurringId, { amount: row.amount, at })
    }
  }

  const windowEnd = new Date(nowMs + YEAR_MS)

  const data: RecurringExpense[] = []
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

    const lastCharged = lastChargedByRule.get(row.id)

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
      amountIncreased:
        lastCharged != null && template.amount > lastCharged.amount,
      isPaused: !!row.disabled,
      latestInstanceId: latestInstanceByRule.get(row.id)?.id ?? null,
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

import { Q } from "@nozbe/watermelondb"
import { differenceInDays, getDay, startOfMonth, startOfWeek } from "date-fns"

import type {
  AccountBreakdownItem,
  BalanceRawRow,
  BalanceTimelinePoint,
  CategoryBreakdownItem,
  CurrencyPeriodStats,
  CurrencyStats,
  DailyDataPoint,
  DayOfWeekPoint,
  ExpenseBySubtype,
  ForecastSummary,
  IntervalDataPoint,
  PendingSummary,
  StatsDateRange,
  StatsRawRow,
  TopTagItem,
  TopTransactionItem,
  UncategorizedSummary,
} from "~/types/stats"
import { TransactionTypeEnum } from "~/types/transactions"
import {
  formatIntervalLabel,
  generateDateBuckets,
  toDateKey,
} from "~/utils/stats-date-range"
import { formatDateKey, formatMonthKey } from "~/utils/time-utils"

// database is expected to be fully initialized by the time any stats function
// runs (WatermelonDB adapter is set up at app boot before any screen renders).
// If database.get() ever throws here it is a fatal initialization failure and
// should propagate uncaught so the global error boundary can catch it.
import { database } from "../index"
import type AccountModel from "../models/account"
import type CategoryModel from "../models/category"
import type TagModel from "../models/tag"
import type TransactionModel from "../models/transaction"
import type TransactionTagModel from "../models/transaction-tag"

/* ------------------------------------------------------------------ */
/* Day-of-week label helpers                                           */
/* ------------------------------------------------------------------ */

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

/* ------------------------------------------------------------------ */
/* Fetch raw rows                                                      */
/* ------------------------------------------------------------------ */

/**
 * Fetch all non-deleted, non-pending, non-transfer transactions
 * within [fromDate, toDate], hydrating account currency, category info,
 * accountId, accountBalanceBefore, and subtype.
 */
async function fetchStatsTransactions(
  fromDate: Date,
  toDate: Date,
): Promise<StatsRawRow[]> {
  const transactions = await database
    .get<TransactionModel>("transactions")
    .query(
      Q.where("is_deleted", false),
      Q.where("is_pending", false),
      Q.where("is_transfer", false),
      Q.where("transaction_date", Q.gte(fromDate.getTime())),
      Q.where("transaction_date", Q.lte(toDate.getTime())),
    )
    .fetch()

  if (transactions.length === 0) return []

  const accountIds = [...new Set(transactions.map((t) => t.accountId))]
  const categoryIds = [
    ...new Set(transactions.map((t) => t.categoryId).filter(Boolean)),
  ] as string[]

  const accounts = await database
    .get<AccountModel>("accounts")
    .query(Q.where("id", Q.oneOf(accountIds)))
    .fetch()
  const accountMap = new Map(accounts.map((a) => [a.id, a]))

  const categories =
    categoryIds.length > 0
      ? await database
          .get<CategoryModel>("categories")
          .query(Q.where("id", Q.oneOf(categoryIds)))
          .fetch()
      : []
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  return transactions.map((tx) => {
    const account = accountMap.get(tx.accountId)
    const category = tx.categoryId ? categoryMap.get(tx.categoryId) : null

    return {
      transactionId: tx.id,
      type: tx.type,
      amount: tx.amount,
      date: tx.transactionDate,
      currencyCode: account?.currencyCode ?? "USD",
      categoryId: tx.categoryId,
      categoryName: category?.name ?? "Uncategorized",
      categoryIcon: category?.icon ?? null,
      categoryColorSchemeName: category?.colorSchemeName ?? null,
      accountId: tx.accountId,
      accountBalanceBefore: tx.accountBalanceBefore,
      subtype: tx.subtype,
      title: tx.title,
    }
  })
}

/**
 * Fetch all non-deleted, non-pending transactions within range
 * (including transfers) for balance timeline reconstruction.
 */
async function fetchBalanceTimeline(
  fromDate: Date,
  toDate: Date,
): Promise<BalanceRawRow[]> {
  const transactions = await database
    .get<TransactionModel>("transactions")
    .query(
      Q.where("is_deleted", false),
      Q.where("is_pending", false),
      Q.where("transaction_date", Q.gte(fromDate.getTime())),
      Q.where("transaction_date", Q.lte(toDate.getTime())),
    )
    .fetch()

  if (transactions.length === 0) return []

  const accountIds = [...new Set(transactions.map((t) => t.accountId))]
  const accounts = await database
    .get<AccountModel>("accounts")
    .query(Q.where("id", Q.oneOf(accountIds)))
    .fetch()
  const accountMap = new Map(accounts.map((a) => [a.id, a]))

  return transactions.map((tx) => {
    const account = accountMap.get(tx.accountId)
    return {
      date: tx.transactionDate,
      accountId: tx.accountId,
      accountBalanceBefore: tx.accountBalanceBefore,
      amount: tx.amount,
      currencyCode: account?.currencyCode ?? "USD",
    }
  })
}

/**
 * Fetch pending transaction summary (excluded from main stats) for range.
 * Returns map keyed by currencyCode.
 */
async function fetchPendingSummary(
  fromDate: Date,
  toDate: Date,
): Promise<Map<string, PendingSummary>> {
  // 1️⃣ Fetch all pending, non-deleted, non-transfer transactions in date range
  const pending = await database
    .get<TransactionModel>("transactions")
    .query(
      Q.where("is_deleted", false),
      Q.where("is_pending", true),
      Q.where("is_transfer", false),
      Q.where("transaction_date", Q.gte(fromDate.getTime())),
      Q.where("transaction_date", Q.lte(toDate.getTime())),
    )
    .fetch()

  if (pending.length === 0) return new Map()

  // 2️⃣ Only load accounts referenced by pending transactions
  const pendingAccountIds = new Set(pending.map((t) => t.accountId))
  const pendingAccounts = await database
    .get<AccountModel>("accounts")
    .query(Q.where("id", Q.oneOf([...pendingAccountIds])))
    .fetch()

  const accountMap = new Map(pendingAccounts.map((a) => [a.id, a]))

  // 3️⃣ Build the summary
  const result = new Map<string, PendingSummary>()

  for (const tx of pending) {
    const currency = accountMap.get(tx.accountId)?.currencyCode ?? "USD"
    const existing = result.get(currency) ?? {
      count: 0,
      totalExpense: 0,
      totalIncome: 0,
    }

    const absAmount = Math.abs(tx.amount)
    if (tx.type === TransactionTypeEnum.EXPENSE)
      existing.totalExpense += absAmount
    else if (tx.type === TransactionTypeEnum.INCOME)
      existing.totalIncome += absAmount

    existing.count++
    result.set(currency, existing)
  }

  return result
}

/**
 * Fetch uncategorized transaction summary for range.
 * Returns map keyed by currencyCode.
 */
async function fetchUncategorizedSummary(
  fromDate: Date,
  toDate: Date,
): Promise<Map<string, UncategorizedSummary>> {
  const transactions = await database
    .get<TransactionModel>("transactions")
    .query(
      Q.where("is_deleted", false),
      Q.where("is_pending", false),
      Q.where("is_transfer", false),
      Q.where("category_id", null),
      Q.where("transaction_date", Q.gte(fromDate.getTime())),
      Q.where("transaction_date", Q.lte(toDate.getTime())),
    )
    .fetch()

  if (transactions.length === 0) return new Map()

  const accountIds = [...new Set(transactions.map((tx) => tx.accountId))]
  const accounts = await database
    .get<AccountModel>("accounts")
    .query(Q.where("id", Q.oneOf(accountIds)))
    .fetch()
  const accountMap = new Map(accounts.map((a) => [a.id, a]))

  const result = new Map<string, UncategorizedSummary>()

  for (const tx of transactions) {
    const currency = accountMap.get(tx.accountId)?.currencyCode ?? "USD"
    const existing = result.get(currency) ?? { count: 0, totalAmount: 0 }
    existing.count++
    existing.totalAmount += Math.abs(tx.amount)
    result.set(currency, existing)
  }

  return result
}

/* ------------------------------------------------------------------ */
/* Computation helpers                                                 */
/* ------------------------------------------------------------------ */

/**
 * Aggregates total income, expense, net, and average daily figures for a set of
 * raw transaction rows within the given date range.
 *
 * @param rows - Pre-filtered transaction rows for a single currency.
 * @param from - Start of the period (inclusive), used to compute the day span.
 * @param to - End of the period (inclusive).
 * @returns A {@link CurrencyPeriodStats} object with totals and daily averages.
 */
function computePeriodStats(
  rows: StatsRawRow[],
  from: Date,
  to: Date,
): CurrencyPeriodStats {
  let totalExpense = 0
  let totalIncome = 0
  let count = 0

  for (const row of rows) {
    const absAmount = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) {
      totalExpense += absAmount
    } else if (row.type === TransactionTypeEnum.INCOME) {
      totalIncome += absAmount
    }
    count++
  }

  const net = totalIncome - totalExpense
  const daySpan = Math.max(1, differenceInDays(to, from) + 1)

  return {
    totalExpense,
    totalIncome,
    net,
    avgDailyExpense: totalExpense / daySpan,
    avgDailyIncome: totalIncome / daySpan,
    avgDailyNet: net / daySpan,
    transactionCount: count,
  }
}

/**
 * Builds a complete day-by-day series of income, expense, and net values over
 * the given date range, filling in zero for days with no transactions.
 *
 * @param rows - Pre-filtered transaction rows for a single currency.
 * @param from - First day of the series.
 * @param to - Last day of the series.
 * @returns An ordered array of {@link DailyDataPoint} entries, one per calendar day.
 */
function computeDailyData(
  rows: StatsRawRow[],
  from: Date,
  to: Date,
): DailyDataPoint[] {
  const buckets = generateDateBuckets(from, to, "day")
  const map = new Map<string, DailyDataPoint>()

  for (const bucket of buckets) {
    const key = toDateKey(bucket)
    map.set(key, { dateKey: key, date: bucket, expense: 0, income: 0, net: 0 })
  }

  for (const row of rows) {
    const key = toDateKey(row.date)
    const point = map.get(key)
    if (!point) continue

    const absAmount = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) {
      point.expense += absAmount
    } else if (row.type === TransactionTypeEnum.INCOME) {
      point.income += absAmount
    }
    point.net = point.income - point.expense
  }

  return Array.from(map.values())
}

/**
 * Returns a stable string key for the time bucket that contains `date` at the
 * requested granularity (day, ISO week start on Monday, or month start).
 *
 * @param date - The date to bucket.
 * @param interval - Granularity of the bucket.
 */
function getBucketKey(date: Date, interval: "day" | "week" | "month"): string {
  switch (interval) {
    case "day":
      return formatDateKey(date)
    case "week":
      return formatDateKey(startOfWeek(date, { weekStartsOn: 1 }))
    case "month":
      return formatMonthKey(startOfMonth(date))
  }
}

/**
 * Builds a bucketed time series (day / week / month) for the current period,
 * paired with the equivalent prior-period values for comparison charts.
 *
 * @param currentRows - Transaction rows for the active date range.
 * @param previousRows - Transaction rows for the preceding comparison range.
 * @param range - Full stats date range including interval and both period boundaries.
 * @returns An array of {@link IntervalDataPoint} entries aligned with the current-period buckets.
 */
function computeIntervalData(
  currentRows: StatsRawRow[],
  previousRows: StatsRawRow[],
  range: StatsDateRange,
): IntervalDataPoint[] {
  const { interval } = range
  const buckets = generateDateBuckets(range.from, range.to, interval)
  const prevBuckets = generateDateBuckets(
    range.previousFrom,
    range.previousTo,
    interval,
  )

  const currentMap = new Map<string, { expense: number; income: number }>()
  for (const b of buckets) {
    currentMap.set(getBucketKey(b, interval), { expense: 0, income: 0 })
  }
  for (const row of currentRows) {
    const key = getBucketKey(row.date, interval)
    const entry = currentMap.get(key)
    if (!entry) continue
    const abs = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) entry.expense += abs
    else if (row.type === TransactionTypeEnum.INCOME) entry.income += abs
  }

  const prevValues: { expense: number; income: number }[] = []
  const prevMap = new Map<string, { expense: number; income: number }>()
  for (const b of prevBuckets) {
    const entry = { expense: 0, income: 0 }
    prevMap.set(getBucketKey(b, interval), entry)
    prevValues.push(entry)
  }
  for (const row of previousRows) {
    const key = getBucketKey(row.date, interval)
    const entry = prevMap.get(key)
    if (!entry) continue
    const abs = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) entry.expense += abs
    else if (row.type === TransactionTypeEnum.INCOME) entry.income += abs
  }

  return buckets.map((bucket, i) => {
    const key = getBucketKey(bucket, interval)
    const curr = currentMap.get(key) ?? { expense: 0, income: 0 }
    const prev = prevValues[i] ?? { expense: 0, income: 0 }

    return {
      label: formatIntervalLabel(bucket, interval),
      date: bucket,
      expense: curr.expense,
      income: curr.income,
      prevExpense: prev.expense,
      prevIncome: prev.income,
    }
  })
}

/**
 * Groups transactions by category and computes per-category totals, share of
 * total expense, and delta versus the previous period.
 *
 * @param rows - Current-period transaction rows.
 * @param previousRows - Prior-period transaction rows used to compute expense deltas.
 * @returns Categories sorted by total expense descending, each with {@link CategoryBreakdownItem} fields.
 */
function computeCategoryBreakdown(
  rows: StatsRawRow[],
  previousRows: StatsRawRow[],
): CategoryBreakdownItem[] {
  const map = new Map<string | null, CategoryBreakdownItem>()

  for (const row of rows) {
    const key = row.categoryId
    let item = map.get(key)
    if (!item) {
      item = {
        categoryId: row.categoryId,
        categoryName: row.categoryName,
        categoryIcon: row.categoryIcon,
        categoryColorSchemeName: row.categoryColorSchemeName,
        totalExpense: 0,
        totalIncome: 0,
        expensePercent: 0,
        transactionCount: 0,
        prevTotalExpense: 0,
        delta: 0,
        deltaPercent: null,
      }
      map.set(key, item)
    }

    const abs = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) item.totalExpense += abs
    else if (row.type === TransactionTypeEnum.INCOME) item.totalIncome += abs
    item.transactionCount++
  }

  // Compute previous period expense per category
  const prevMap = new Map<string | null, number>()
  for (const row of previousRows) {
    if (row.type !== TransactionTypeEnum.EXPENSE) continue
    const existing = prevMap.get(row.categoryId) ?? 0
    prevMap.set(row.categoryId, existing + Math.abs(row.amount))
  }

  const items = Array.from(map.values())
  const totalExpense = items.reduce((s, it) => s + it.totalExpense, 0)

  for (const item of items) {
    item.expensePercent =
      totalExpense > 0 ? item.totalExpense / totalExpense : 0

    const prev = prevMap.get(item.categoryId) ?? 0
    item.prevTotalExpense = prev
    item.delta = item.totalExpense - prev
    item.deltaPercent =
      prev > 0 ? ((item.totalExpense - prev) / prev) * 100 : null
  }

  return items.sort((a, b) => b.totalExpense - a.totalExpense)
}

/**
 * Reconstructs the day-by-day combined balance across all provided accounts for
 * the given period, using stored `accountBalanceBefore` snapshots and carry-forward
 * for days without transactions.
 *
 * @param balanceRows - Raw balance rows including transfers for the period.
 * @param accounts - Account models whose balances are summed (typically filtered to one currency).
 * @param from - First day of the timeline.
 * @param to - Last day of the timeline.
 * @returns The daily timeline plus scalar opening and closing balances.
 */
function computeBalanceTimeline(
  balanceRows: BalanceRawRow[],
  accounts: AccountModel[],
  from: Date,
  to: Date,
): { timeline: BalanceTimelinePoint[]; opening: number; closing: number } {
  const buckets = generateDateBuckets(from, to, "day")

  if (accounts.length === 0) {
    return { timeline: [], opening: 0, closing: 0 }
  }

  // Group rows by accountId
  const byAccount = new Map<string, BalanceRawRow[]>()
  for (const row of balanceRows) {
    const list = byAccount.get(row.accountId)
    if (list) list.push(row)
    else byAccount.set(row.accountId, [row])
  }

  // For each account, build a per-day balance map using carry-forward.
  // Accounts with no transactions in the period are constant at account.balance.
  const accountDailyMaps: Map<string, number>[] = []
  let openingSum = 0

  for (const account of accounts) {
    const rows = byAccount.get(account.id)
    const dailyMap = new Map<string, number>()

    if (!rows || rows.length === 0) {
      // No transactions in period — balance is constant at the current stored value
      openingSum += account.balance
      for (const bucket of buckets) {
        dailyMap.set(toDateKey(bucket), account.balance)
      }
    } else {
      // Sort transactions by date ASC
      const sorted = rows
        .slice()
        .sort((a, b) => a.date.getTime() - b.date.getTime())
      const accountOpening = sorted[0]?.accountBalanceBefore ?? 0
      openingSum += accountOpening

      let lastBalance = accountOpening
      for (const bucket of buckets) {
        const key = toDateKey(bucket)
        // Apply all transactions that fall on this day
        for (const row of sorted) {
          if (toDateKey(row.date) === key) {
            lastBalance = row.accountBalanceBefore + row.amount
          }
        }
        dailyMap.set(key, lastBalance)
      }
    }

    accountDailyMaps.push(dailyMap)
  }

  // Sum all account balances per day
  const timeline: BalanceTimelinePoint[] = []
  for (const bucket of buckets) {
    const key = toDateKey(bucket)
    let total = 0
    for (const dailyMap of accountDailyMaps) {
      total += dailyMap.get(key) ?? 0
    }
    timeline.push({ date: bucket, balance: total })
  }

  const closing = timeline.at(-1)?.balance ?? openingSum

  return { timeline, opening: openingSum, closing }
}

/**
 * Calculates total and average expense for each day of the week (Mon–Sun)
 * over the given period, normalising by how many times each weekday appears.
 *
 * @param rows - Expense and income rows for the period (non-expense rows are ignored).
 * @param from - Start of the period, used to count weekday occurrences.
 * @param to - End of the period.
 * @returns Seven {@link DayOfWeekPoint} entries ordered Monday through Sunday.
 */
function computeSpendingByDayOfWeek(
  rows: StatsRawRow[],
  from: Date,
  to: Date,
): DayOfWeekPoint[] {
  const totals = new Array(7).fill(0) as number[]

  for (const row of rows) {
    if (row.type !== TransactionTypeEnum.EXPENSE) continue
    totals[getDay(row.date)] += Math.abs(row.amount)
  }

  // Count how many times each weekday appears in the range
  const dayCounts = new Array(7).fill(0) as number[]
  const buckets = generateDateBuckets(from, to, "day")
  for (const bucket of buckets) {
    dayCounts[getDay(bucket)]++
  }

  // Order: Mon(1) Tue(2) Wed(3) Thu(4) Fri(5) Sat(6) Sun(0)
  const order = [1, 2, 3, 4, 5, 6, 0]

  return order.map((day) => {
    const count = dayCounts[day] ?? 1
    const expense = totals[day] ?? 0
    return {
      day,
      dayLabel: DOW_LABELS[day] ?? "",
      expense,
      avgExpense: count > 0 ? expense / count : 0,
    }
  })
}

/**
 * Projects full-period income and expense totals by extrapolating the daily
 * run-rate observed so far. Returns `null` when the range has already ended
 * (no future to forecast).
 *
 * @param rows - Transaction rows accumulated from range start to today.
 * @param range - The stats date range; `range.to` must be in the future for a result.
 * @returns A {@link ForecastSummary} with projected totals, or `null` if the period is complete.
 */
function computeForecast(
  rows: StatsRawRow[],
  range: StatsDateRange,
): ForecastSummary | null {
  const now = new Date()
  if (range.to <= now) return null

  const daysElapsed = Math.max(1, differenceInDays(now, range.from) + 1)
  const daysTotal = Math.max(1, differenceInDays(range.to, range.from) + 1)

  let totalExpense = 0
  let totalIncome = 0

  for (const row of rows) {
    const abs = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) totalExpense += abs
    else if (row.type === TransactionTypeEnum.INCOME) totalIncome += abs
  }

  const expenseRate = totalExpense / daysElapsed
  const incomeRate = totalIncome / daysElapsed
  const forecastedExpense = expenseRate * daysTotal
  const forecastedIncome = incomeRate * daysTotal

  return {
    isActive: true,
    daysElapsed,
    daysTotal,
    forecastedExpense,
    forecastedIncome,
    forecastedNet: forecastedIncome - forecastedExpense,
  }
}

/**
 * Totals expense amounts broken down by transaction subtype
 * (`recurring`, `one-time`, and unclassified).
 *
 * @param rows - Transaction rows for the period; non-expense rows are skipped.
 * @returns An {@link ExpenseBySubtype} object with a total for each subtype bucket.
 */
function computeExpenseBySubtype(rows: StatsRawRow[]): ExpenseBySubtype {
  const result: ExpenseBySubtype = { recurring: 0, oneTime: 0, unclassified: 0 }

  for (const row of rows) {
    if (row.type !== TransactionTypeEnum.EXPENSE) continue
    const abs = Math.abs(row.amount)
    if (row.subtype === "recurring") result.recurring += abs
    else if (row.subtype === "one-time") result.oneTime += abs
    else result.unclassified += abs
  }

  return result
}

/**
 * Resolves the top 5 tags by total expense amount across the given expense rows,
 * joining through `transaction_tags` to hydrate tag names and icons.
 *
 * @param rows - Transaction rows for the period; only expense rows are considered.
 * @returns Up to 5 {@link TopTagItem} entries sorted by total expense descending.
 */
async function computeTopTags(rows: StatsRawRow[]): Promise<TopTagItem[]> {
  const expenseRows = rows.filter((r) => r.type === TransactionTypeEnum.EXPENSE)
  if (expenseRows.length === 0) return []

  const txIds = expenseRows.map((r) => r.transactionId)

  const txTagRows = await database
    .get<TransactionTagModel>("transaction_tags")
    .query(Q.where("transaction_id", Q.oneOf(txIds)))
    .fetch()

  if (txTagRows.length === 0) return []

  const tagIds = [...new Set(txTagRows.map((r) => r.tagId))]
  const tags = await database
    .get<TagModel>("tags")
    .query(Q.where("id", Q.oneOf(tagIds)))
    .fetch()
  const tagMap = new Map(tags.map((t) => [t.id, t]))

  // Map transactionId → amount for quick lookup
  const amountByTx = new Map(
    expenseRows.map((r) => [r.transactionId, Math.abs(r.amount)]),
  )

  const totals = new Map<
    string,
    { tag: TagModel; totalExpense: number; transactionCount: number }
  >()

  for (const row of txTagRows) {
    const tag = tagMap.get(row.tagId)
    if (!tag) continue
    const amount = amountByTx.get(row.transactionId) ?? 0
    const existing = totals.get(row.tagId) ?? {
      tag,
      totalExpense: 0,
      transactionCount: 0,
    }
    existing.totalExpense += amount
    existing.transactionCount++
    totals.set(row.tagId, existing)
  }

  return Array.from(totals.values())
    .sort((a, b) => b.totalExpense - a.totalExpense)
    .slice(0, 5)
    .map(({ tag, totalExpense, transactionCount }) => ({
      tagId: tag.id,
      tagName: tag.name,
      tagIcon: tag.icon,
      totalExpense,
      transactionCount,
    }))
}

/**
 * Groups transactions by account and computes per-account income, expense, and
 * transaction count, sorted by total expense descending.
 *
 * @param rows - Transaction rows for the period.
 * @param accountMap - Pre-fetched account models keyed by account ID.
 * @returns An array of {@link AccountBreakdownItem} sorted by total expense descending.
 */
function computeByAccount(
  rows: StatsRawRow[],
  accountMap: Map<string, AccountModel>,
): AccountBreakdownItem[] {
  const map = new Map<string, AccountBreakdownItem>()

  for (const row of rows) {
    const account = accountMap.get(row.accountId)
    if (!account) continue

    let item = map.get(row.accountId)
    if (!item) {
      item = {
        accountId: row.accountId,
        accountName: account.name,
        accountIcon: account.icon,
        totalExpense: 0,
        totalIncome: 0,
        transactionCount: 0,
        excludeFromBalance: account.excludeFromBalance,
      }
      map.set(row.accountId, item)
    }

    const abs = Math.abs(row.amount)
    if (row.type === TransactionTypeEnum.EXPENSE) item.totalExpense += abs
    else if (row.type === TransactionTypeEnum.INCOME) item.totalIncome += abs
    item.transactionCount++
  }

  return Array.from(map.values()).sort(
    (a, b) => b.totalExpense - a.totalExpense,
  )
}

/**
 * Returns the 5 largest expense transactions by absolute amount.
 *
 * @param rows - Transaction rows for the period; only expense rows are considered.
 * @returns Up to 5 {@link TopTransactionItem} entries sorted by amount descending.
 */
function computeTopTransactions(rows: StatsRawRow[]): TopTransactionItem[] {
  return rows
    .filter((r) => r.type === TransactionTypeEnum.EXPENSE)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 5)
    .map((r) => ({
      transactionId: r.transactionId,
      title: r.title || null,
      amount: Math.abs(r.amount),
      date: r.date,
      categoryName: r.categoryName,
      categoryIcon: r.categoryIcon,
      categoryColorSchemeName: r.categoryColorSchemeName,
      currencyCode: r.currencyCode,
    }))
}

/**
 * Partitions a flat array of stats rows into a map keyed by currency code.
 *
 * @param rows - Raw stats rows from any number of currencies.
 * @returns A `Map` where each entry holds only rows for that currency.
 */
function groupByCurrency(rows: StatsRawRow[]): Map<string, StatsRawRow[]> {
  const map = new Map<string, StatsRawRow[]>()
  for (const row of rows) {
    const list = map.get(row.currencyCode)
    if (list) list.push(row)
    else map.set(row.currencyCode, [row])
  }
  return map
}

/**
 * Partitions a flat array of balance rows into a map keyed by currency code.
 *
 * @param rows - Raw balance rows from any number of currencies.
 * @returns A `Map` where each entry holds only rows for that currency.
 */
function groupBalanceByCurrency(
  rows: BalanceRawRow[],
): Map<string, BalanceRawRow[]> {
  const map = new Map<string, BalanceRawRow[]>()
  for (const row of rows) {
    const list = map.get(row.currencyCode)
    if (list) list.push(row)
    else map.set(row.currencyCode, [row])
  }
  return map
}

/* ------------------------------------------------------------------ */
/* Main export                                                         */
/* ------------------------------------------------------------------ */

/**
 * Main computation function. Takes raw rows + date range and returns
 * one CurrencyStats per currency found.
 */
async function computeCurrencyStats(
  currentRows: StatsRawRow[],
  previousRows: StatsRawRow[],
  balanceRows: BalanceRawRow[],
  pendingMap: Map<string, PendingSummary>,
  uncategorizedMap: Map<string, UncategorizedSummary>,
  range: StatsDateRange,
): Promise<CurrencyStats[]> {
  const accounts = await database.get<AccountModel>("accounts").query().fetch()
  const accountMap = new Map(accounts.map((a) => [a.id, a]))

  const currentByCurrency = groupByCurrency(currentRows)
  const previousByCurrency = groupByCurrency(previousRows)
  const balanceByCurrency = groupBalanceByCurrency(balanceRows)

  const currencies = [
    ...new Set([...currentByCurrency.keys(), ...previousByCurrency.keys()]),
  ]

  const results = await Promise.all(
    currencies.map(async (currency) => {
      const currRows = currentByCurrency.get(currency) ?? []
      const prevRows = previousByCurrency.get(currency) ?? []
      const balRows = balanceByCurrency.get(currency) ?? []

      const current = computePeriodStats(currRows, range.from, range.to)
      const previous =
        prevRows.length > 0
          ? computePeriodStats(prevRows, range.previousFrom, range.previousTo)
          : null

      const dailyData = computeDailyData(currRows, range.from, range.to)
      const previousDailyData = computeDailyData(
        prevRows,
        range.previousFrom,
        range.previousTo,
      )
      const intervalData = computeIntervalData(currRows, prevRows, range)
      const categoryBreakdown = computeCategoryBreakdown(currRows, prevRows)
      const topCategory =
        categoryBreakdown.length > 0 ? (categoryBreakdown[0] ?? null) : null

      const currencyAccounts = accounts.filter(
        (a) => a.currencyCode === currency && !a.excludeFromBalance,
      )
      const { timeline, opening, closing } = computeBalanceTimeline(
        balRows,
        currencyAccounts,
        range.from,
        range.to,
      )

      const spendingByDayOfWeek = computeSpendingByDayOfWeek(
        currRows,
        range.from,
        range.to,
      )
      // Only forecast when we have previous period data to lend credibility
      const forecast =
        prevRows.length > 0 ? computeForecast(currRows, range) : null
      const expenseBySubtype = computeExpenseBySubtype(currRows)
      const topTags = await computeTopTags(currRows)
      const byAccount = computeByAccount(currRows, accountMap)
      const topTransactions = computeTopTransactions(currRows)

      return {
        currency,
        current,
        previous,
        dailyData,
        previousDailyData,
        intervalData,
        categoryBreakdown,
        topCategory,
        balanceTimeline: timeline,
        openingBalance: opening,
        closingBalance: closing,
        balanceDelta: closing - opening,
        spendingByDayOfWeek,
        forecast,
        expenseBySubtype,
        topTags,
        byAccount,
        topTransactions,
        pendingSummary: pendingMap.get(currency) ?? null,
        uncategorizedSummary: uncategorizedMap.get(currency) ?? null,
      } satisfies CurrencyStats
    }),
  )

  return results.sort(
    (a, b) => b.current.transactionCount - a.current.transactionCount,
  )
}

/**
 * Fetches all raw transaction data for both the current and previous periods in
 * parallel, then computes and returns one {@link CurrencyStats} per currency found
 * in the results.
 *
 * @param range - The active stats date range, including prior-period boundaries and
 *   the chart interval granularity.
 * @returns An array of {@link CurrencyStats} objects sorted by transaction count descending.
 */
export async function fetchAllStatsData(range: StatsDateRange) {
  const [currentRows, previousRows, balanceRows, pendingMap, uncategorizedMap] =
    await Promise.all([
      fetchStatsTransactions(range.from, range.to),
      fetchStatsTransactions(range.previousFrom, range.previousTo),
      fetchBalanceTimeline(range.from, range.to),
      fetchPendingSummary(range.from, range.to),
      fetchUncategorizedSummary(range.from, range.to),
    ])

  return computeCurrencyStats(
    currentRows,
    previousRows,
    balanceRows,
    pendingMap,
    uncategorizedMap,
    range,
  )
}

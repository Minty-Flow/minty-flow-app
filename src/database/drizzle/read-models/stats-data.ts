import {
  differenceInDays,
  getDay,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns"
import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import type { RowAccount, RowCategory } from "~/database/types/rows"
import { getBalanceDelta } from "~/database/utils/get-balance-delta"
import { currencyRegistryService } from "~/services/currency-registry"
import type {
  AccountBreakdownItem,
  BalanceRawRow,
  BalanceTimelinePoint,
  CategoryBreakdownItem,
  CurrencyPeriodStats,
  CurrencyStats,
  DailyDataPoint,
  DayOfWeekPoint,
  ForecastSummary,
  IntervalDataPoint,
  PendingSummary,
  StatsDateRange,
  StatsRawRow,
  TopTagItem,
  TopTransactionItem,
  WrappedInsights,
} from "~/types/stats"
import type { TransactionType } from "~/types/transactions"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { getWeekStartsOn } from "~/utils/get-week-start-on"
import { roundToSafeInteger } from "~/utils/money"
import {
  formatIntervalLabel,
  generateDateBuckets,
  toDateKey,
} from "~/utils/stats-date-range"
import {
  formatDateKey,
  formatMonthKey,
  formatShortMonthName,
  startOfAppWeek,
} from "~/utils/time-utils"

/* ------------------------------------------------------------------ */
/* Stats inclusion guards                                              */
/* ------------------------------------------------------------------ */

/**
 * True when the row counts as a real expense for statistics purposes.
 * Loan cash flows (opening entry + repayments) are excluded entirely.
 * Refunds are real expenses — they contribute a negative amount.
 */
function isRealExpense(row: { type: string; loanId: string | null }): boolean {
  if (row.type !== TransactionTypeEnum.EXPENSE) return false
  return row.loanId == null
}

/**
 * True when the row counts as real income for statistics purposes.
 * Loan cash flows (opening entry + repayments) are excluded entirely.
 */
function isRealIncome(row: { type: string; loanId: string | null }): boolean {
  if (row.type !== TransactionTypeEnum.INCOME) return false
  return row.loanId == null
}

/**
 * Signed contribution of a real-expense row to spending totals.
 * Refunds contribute a negative amount (they reduce spending).
 * Normal expenses contribute a positive amount.
 * Non-real-expense rows return 0.
 */
function expenseContribution(row: {
  type: string
  subtype: string | null
  amount: number
  loanId: string | null
}): number {
  if (!isRealExpense(row)) return 0
  const abs = Math.abs(row.amount)
  return row.subtype === TransactionSubTypeEnum.REFUND ? -abs : abs
}

/* ------------------------------------------------------------------ */
/* Fetch raw rows                                                      */
/* ------------------------------------------------------------------ */

async function fetchStatsTransactions(
  fromDate: Date,
  toDate: Date,
): Promise<StatsRawRow[]> {
  const from = fromDate.toISOString()
  const to = toDate.toISOString()

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const rows = drizzleDb.all<{
    id: string
    account_id: string
    category_id: string | null
    amount: number
    type: string
    transaction_date: string
    subtype: string | null
    title: string | null
    loan_id: string | null
  }>(sql`
    SELECT t.id, t.account_id, t.category_id, t.amount, t.type, t.transaction_date,
            t.subtype, t.title, t.loan_id
     FROM transactions t
     WHERE t.is_deleted = 0
       AND t.is_pending = 0
       AND NOT EXISTS (SELECT 1 FROM transfers tr WHERE tr.from_transaction_id = t.id OR tr.to_transaction_id = t.id)
       AND t.transaction_date >= ${from}
       AND t.transaction_date <= ${to}`)

  if (rows.length === 0) return []

  // Whole tables, not `IN (?, ?, ...)`: both are small, and one bound
  // parameter per id breaks past SQLite's variable limit.
  const accountRows = drizzleDb.all<RowAccount>(sql`SELECT * FROM accounts`)
  const categoryRows = drizzleDb.all<RowCategory>(sql`SELECT * FROM categories`)

  const accountMap = new Map(accountRows.map((a) => [a.id, a]))
  const categoryMap = new Map(categoryRows.map((c) => [c.id, c]))

  return rows.map((tx) => {
    const account = accountMap.get(tx.account_id)
    const category = tx.category_id ? categoryMap.get(tx.category_id) : null

    return {
      transactionId: tx.id,
      type: tx.type as TransactionType,
      amount: tx.amount,
      date: new Date(tx.transaction_date),
      currencyCode: account?.currency_code ?? useCode,
      categoryId: tx.category_id ?? null,
      categoryName: category?.name ?? "Uncategorized",
      categoryIcon: category?.icon ?? null,
      categoryColorSchemeName: category?.color_scheme_name ?? null,
      accountId: tx.account_id,
      subtype: tx.subtype,
      loanId: tx.loan_id ?? null,
      title: tx.title,
    } satisfies StatsRawRow
  })
}

/**
 * Every confirmed, non-deleted row dated on or after `fromDate`, with no upper
 * bound: the chart walks back from each account's live balance, so it needs the
 * rows after the range as well as the rows inside it.
 */
async function fetchBalanceTimeline(fromDate: Date): Promise<BalanceRawRow[]> {
  const from = fromDate.toISOString()

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const rows = drizzleDb.all<{
    account_id: string
    amount: number
    type: string
    subtype: string | null
    transaction_date: string
  }>(sql`
    SELECT t.account_id, t.amount, t.type, t.subtype, t.transaction_date
     FROM transactions t
     WHERE t.is_deleted = 0
       AND t.is_pending = 0
       AND t.transaction_date >= ${from}`)

  if (rows.length === 0) return []

  const accountRows = drizzleDb.all<RowAccount>(sql`SELECT * FROM accounts`)
  const accountMap = new Map(accountRows.map((a) => [a.id, a]))

  return rows.map((tx) => ({
    date: new Date(tx.transaction_date),
    accountId: tx.account_id,
    amount: tx.amount,
    type: tx.type as TransactionType,
    subtype: tx.subtype,
    currencyCode: accountMap.get(tx.account_id)?.currency_code ?? useCode,
  }))
}

async function fetchPendingSummary(
  fromDate: Date,
  toDate: Date,
): Promise<Map<string, PendingSummary>> {
  const from = fromDate.toISOString()
  const to = toDate.toISOString()

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const rows = drizzleDb.all<{
    account_id: string
    amount: number
    type: string
    subtype: string | null
    loan_id: string | null
  }>(sql`
    SELECT t.account_id, t.amount, t.type, t.subtype, t.loan_id
     FROM transactions t
     WHERE t.is_deleted = 0
       AND t.is_pending = 1
       AND NOT EXISTS (SELECT 1 FROM transfers tr WHERE tr.from_transaction_id = t.id OR tr.to_transaction_id = t.id)
       AND t.transaction_date >= ${from}
       AND t.transaction_date <= ${to}`)

  if (rows.length === 0) return new Map()

  const accountRows = drizzleDb.all<Pick<RowAccount, "id" | "currency_code">>(
    sql`SELECT id, currency_code FROM accounts`,
  )
  const accountMap = new Map(accountRows.map((a) => [a.id, a.currency_code]))

  const result = new Map<string, PendingSummary>()

  for (const tx of rows) {
    const currency = accountMap.get(tx.account_id) ?? useCode
    const existing = result.get(currency) ?? {
      count: 0,
      totalExpense: 0,
      totalIncome: 0,
    }
    const abs = Math.abs(tx.amount)
    const isLoanFlow = tx.loan_id != null
    if (tx.type === TransactionTypeEnum.EXPENSE) {
      if (!isLoanFlow) {
        if (tx.subtype === TransactionSubTypeEnum.REFUND) {
          // Pending refund reduces pending expense
          existing.totalExpense = Math.max(0, existing.totalExpense - abs)
        } else {
          existing.totalExpense += abs
        }
      }
    } else if (tx.type === TransactionTypeEnum.INCOME) {
      if (!isLoanFlow) {
        existing.totalIncome += abs
      }
    }
    existing.count++
    result.set(currency, existing)
  }

  return result
}

/* ------------------------------------------------------------------ */
/* Computation helpers (pure — no DB deps)                            */
/* ------------------------------------------------------------------ */

function computePeriodStats(
  rows: StatsRawRow[],
  from: Date,
  to: Date,
): CurrencyPeriodStats {
  let totalExpense = 0
  let totalIncome = 0
  let count = 0

  for (const row of rows) {
    totalExpense += expenseContribution(row)
    if (isRealIncome(row)) totalIncome += Math.abs(row.amount)
    count++
  }

  const net = totalIncome - totalExpense
  const daySpan = Math.max(1, differenceInDays(to, from) + 1)

  return {
    totalExpense,
    totalIncome,
    net,
    avgDailyExpense: roundToSafeInteger(totalExpense / daySpan),
    avgDailyIncome: roundToSafeInteger(totalIncome / daySpan),
    avgDailyNet: roundToSafeInteger(net / daySpan),
    transactionCount: count,
  }
}

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
    point.expense += expenseContribution(row)
    if (isRealIncome(row)) point.income += Math.abs(row.amount)
    point.net = point.income - point.expense
  }

  return Array.from(map.values())
}

function getBucketKey(
  date: Date,
  interval: "day" | "week" | "month" | "year",
): string {
  switch (interval) {
    case "day":
      return formatDateKey(date)
    case "week":
      return formatDateKey(startOfAppWeek(date))
    case "month":
      return formatMonthKey(startOfMonth(date))
    case "year":
      return String(startOfYear(date).getFullYear())
  }
}

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
    entry.expense += expenseContribution(row)
    if (isRealIncome(row)) entry.income += Math.abs(row.amount)
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
    entry.expense += expenseContribution(row)
    if (isRealIncome(row)) entry.income += Math.abs(row.amount)
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
    item.totalExpense += expenseContribution(row)
    if (isRealIncome(row)) item.totalIncome += Math.abs(row.amount)
    item.transactionCount++
  }

  const prevMap = new Map<string | null, number>()
  for (const row of previousRows) {
    const contrib = expenseContribution(row)
    if (contrib === 0) continue
    prevMap.set(row.categoryId, (prevMap.get(row.categoryId) ?? 0) + contrib)
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
 * Balance over the days of `[from, to]`, summed across `accounts`.
 *
 * Each account's balance is rebuilt from its live balance, which already holds
 * every confirmed row, by taking back the rows that came later. That stays
 * right after a backdated, edited, deleted or restored transaction, unlike the
 * `account_balance_before` snapshot stored on each row when it was written.
 *
 * `balanceRows` are the confirmed rows dated on or after `from`; rows dated
 * after `to` only move the closing balance.
 */
export function computeBalanceTimeline(
  balanceRows: BalanceRawRow[],
  accounts: RowAccount[],
  from: Date,
  to: Date,
): { timeline: BalanceTimelinePoint[]; opening: number; closing: number } {
  const buckets = generateDateBuckets(from, to, "day")

  if (accounts.length === 0) return { timeline: [], opening: 0, closing: 0 }

  const byAccount = new Map<string, BalanceRawRow[]>()
  for (const row of balanceRows) {
    const list = byAccount.get(row.accountId)
    if (list) list.push(row)
    else byAccount.set(row.accountId, [row])
  }

  const toMs = to.getTime()
  const accountDailyMaps: Map<string, number>[] = []
  let openingSum = 0
  let closingSum = 0

  for (const account of accounts) {
    // End of the range: the live balance minus everything dated after it.
    let closing = account.balance
    const deltaByDay = new Map<string, number>()
    let inRange = 0
    for (const row of byAccount.get(account.id) ?? []) {
      const delta = getBalanceDelta(row.amount, row.type, row.subtype)
      if (row.date.getTime() > toMs) {
        closing -= delta
        continue
      }
      const key = toDateKey(row.date)
      deltaByDay.set(key, (deltaByDay.get(key) ?? 0) + delta)
      inRange += delta
    }

    // Start of the range, then forward day by day.
    const opening = closing - inRange
    const dailyMap = new Map<string, number>()
    let running = opening
    for (const bucket of buckets) {
      const key = toDateKey(bucket)
      running += deltaByDay.get(key) ?? 0
      dailyMap.set(key, running)
    }

    openingSum += opening
    closingSum += closing
    accountDailyMaps.push(dailyMap)
  }

  const timeline: BalanceTimelinePoint[] = []
  for (const bucket of buckets) {
    const key = toDateKey(bucket)
    let total = 0
    for (const dailyMap of accountDailyMaps) total += dailyMap.get(key) ?? 0
    timeline.push({ date: bucket, balance: total })
  }

  return { timeline, opening: openingSum, closing: closingSum }
}

function computeSpendingByDayOfWeek(
  rows: StatsRawRow[],
  from: Date,
  to: Date,
): DayOfWeekPoint[] {
  const totals = new Array(7).fill(0) as number[]
  for (const row of rows) {
    const contrib = expenseContribution(row)
    if (contrib === 0) continue
    totals[getDay(row.date)] += contrib
  }
  const dayCounts = new Array(7).fill(0) as number[]
  for (const bucket of generateDateBuckets(from, to, "day")) {
    dayCounts[getDay(bucket)]++
  }

  const weekStart = getWeekStartsOn()
  const dayOrder = Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7)

  return dayOrder.map((day) => {
    const count = dayCounts[day] ?? 1
    const expense = totals[day] ?? 0
    return {
      day,
      expense,
      avgExpense: count > 0 ? roundToSafeInteger(expense / count) : 0,
    }
  })
}

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
    totalExpense += expenseContribution(row)
    if (isRealIncome(row)) totalIncome += Math.abs(row.amount)
  }

  const expenseRate = totalExpense / daysElapsed
  const incomeRate = totalIncome / daysElapsed

  return {
    isActive: true,
    daysElapsed,
    daysTotal,
    forecastedExpense: roundToSafeInteger(expenseRate * daysTotal),
    forecastedIncome: roundToSafeInteger(incomeRate * daysTotal),
    forecastedNet: roundToSafeInteger((incomeRate - expenseRate) * daysTotal),
  }
}

const TAG_QUERY_CHUNK = 500

interface TxTagRow {
  transaction_id: string
  tag_id: string
  name: string
  icon: string | null
}

async function computeTopTags(rows: StatsRawRow[]): Promise<TopTagItem[]> {
  const expenseRows = rows.filter(isRealExpense)
  if (expenseRows.length === 0) return []

  const txIds = expenseRows.map((r) => r.transactionId)

  // Chunked so a large range never exceeds SQLite's bound-variable limit.
  const txTagRows: TxTagRow[] = []
  for (let i = 0; i < txIds.length; i += TAG_QUERY_CHUNK) {
    const chunk = txIds.slice(i, i + TAG_QUERY_CHUNK)
    txTagRows.push(
      ...drizzleDb.all<TxTagRow>(sql`
    SELECT tt.transaction_id, tt.tag_id, tg.name, tg.icon
     FROM transaction_tags tt
     JOIN tags tg ON tt.tag_id = tg.id
     WHERE tt.transaction_id IN (${sql.join(
       chunk.map((id) => sql`${id}`),
       sql`, `,
     )})`),
    )
  }

  if (txTagRows.length === 0) return []

  const amountByTx = new Map(
    expenseRows.map((r) => [r.transactionId, expenseContribution(r)]),
  )

  const totals = new Map<
    string,
    {
      name: string
      icon: string | null
      totalExpense: number
      transactionCount: number
    }
  >()

  for (const row of txTagRows) {
    const amount = amountByTx.get(row.transaction_id) ?? 0
    const existing = totals.get(row.tag_id) ?? {
      name: row.name,
      icon: row.icon,
      totalExpense: 0,
      transactionCount: 0,
    }
    existing.totalExpense += amount
    existing.transactionCount++
    totals.set(row.tag_id, existing)
  }

  return Array.from(totals.entries())
    .sort((a, b) => b[1].totalExpense - a[1].totalExpense)
    .slice(0, 5)
    .map(([tagId, { name, icon, totalExpense, transactionCount }]) => ({
      tagId,
      tagName: name,
      tagIcon: icon,
      totalExpense,
      transactionCount,
    }))
}

function computeByAccount(
  rows: StatsRawRow[],
  accountMap: Map<string, RowAccount>,
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
        excludeFromBalance: Boolean(account.exclude_from_balance),
      }
      map.set(row.accountId, item)
    }

    item.totalExpense += expenseContribution(row)
    if (isRealIncome(row)) item.totalIncome += Math.abs(row.amount)
    item.transactionCount++
  }

  return Array.from(map.values()).sort(
    (a, b) => b.totalExpense - a.totalExpense,
  )
}

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

function groupByCurrency(rows: StatsRawRow[]): Map<string, StatsRawRow[]> {
  const map = new Map<string, StatsRawRow[]>()
  for (const row of rows) {
    const list = map.get(row.currencyCode)
    if (list) list.push(row)
    else map.set(row.currencyCode, [row])
  }
  return map
}

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

async function computeCurrencyStats(
  currentRows: StatsRawRow[],
  previousRows: StatsRawRow[],
  balanceRows: BalanceRawRow[],
  pendingMap: Map<string, PendingSummary>,
  range: StatsDateRange,
  accounts: RowAccount[],
): Promise<CurrencyStats[]> {
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
      const intervalData = computeIntervalData(currRows, prevRows, range)
      const categoryBreakdown = computeCategoryBreakdown(currRows, prevRows)
      const topCategory =
        categoryBreakdown.length > 0 ? (categoryBreakdown[0] ?? null) : null

      const currencyAccounts = accounts.filter(
        (a) => a.currency_code === currency && !a.exclude_from_balance,
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
      const forecast =
        prevRows.length > 0 ? computeForecast(currRows, range) : null
      const topTags = await computeTopTags(currRows)
      const byAccount = computeByAccount(currRows, accountMap)
      const topTransactions = computeTopTransactions(currRows)

      return {
        currency,
        current,
        previous,
        dailyData,
        intervalData,
        categoryBreakdown,
        topCategory,
        balanceTimeline: timeline,
        openingBalance: opening,
        closingBalance: closing,
        balanceDelta: closing - opening,
        spendingByDayOfWeek,
        forecast,
        topTags,
        byAccount,
        topTransactions,
        pendingSummary: pendingMap.get(currency) ?? null,
      } satisfies CurrencyStats
    }),
  )

  return results.sort(
    (a, b) => b.current.transactionCount - a.current.transactionCount,
  )
}

/* ------------------------------------------------------------------ */
/* Wrapped insights                                                    */
/* ------------------------------------------------------------------ */

function computeMedianPurchase(rows: StatsRawRow[]): number | null {
  const amounts = rows
    .flatMap((r) => (isRealExpense(r) ? [Math.abs(r.amount)] : []))
    .sort((a, b) => a - b)
  if (amounts.length === 0) return null
  const mid = Math.floor(amounts.length / 2)
  const lower = amounts[mid - 1] ?? 0
  const upper = amounts[mid] ?? 0
  return amounts.length % 2 === 0
    ? roundToSafeInteger((lower + upper) / 2)
    : upper
}

function computeMostFrequent(
  rows: StatsRawRow[],
): WrappedInsights["mostFrequent"] {
  const counts = new Map<string, { title: string; count: number }>()
  for (const row of rows) {
    if (!isRealExpense(row)) continue
    const title = row.title?.trim()
    if (!title) continue
    const key = title.toLowerCase()
    const entry = counts.get(key) ?? { title, count: 0 }
    entry.count++
    counts.set(key, entry)
  }
  let best: { title: string; count: number } | null = null
  for (const entry of counts.values()) {
    if (!best || entry.count > best.count) best = entry
  }
  // A single occurrence isn't "frequent"
  return best && best.count > 1 ? best : null
}

/** Widest range span, in days, still comparable to a calendar-month average. */
const MONTHISH_MIN_DAYS = 26
const MONTHISH_MAX_DAYS = 32

function computeTopCategoryTrend(
  inRangeRows: StatsRawRow[],
  historyRows: StatsRawRow[],
  range: StatsDateRange,
): WrappedInsights["topCategoryTrend"] {
  // The trailing baseline is an average of calendar months and the final bar is
  // labelled with a single month name, so the card is only meaningful when the
  // range is itself about one month. Wider ranges (thisYear, allTime) compared a
  // whole-range total against a monthly average; narrower ones (thisWeek) did the
  // inverse. Both read as nonsense, so render nothing instead.
  //
  // Span alone isn't enough: a custom Jan 15 – Feb 14 range is month-length but
  // straddles two, so its bar would be labelled "Jan" while holding half of Feb.
  const spanDays = differenceInDays(range.to, range.from)
  if (spanDays < MONTHISH_MIN_DAYS || spanDays > MONTHISH_MAX_DAYS) return null
  if (range.from.getTime() !== startOfMonth(range.from).getTime()) return null

  // Top expense category within the selected range
  const totals = new Map<string | null, number>()
  for (const row of inRangeRows) {
    const contrib = expenseContribution(row)
    if (contrib === 0) continue
    totals.set(row.categoryId, (totals.get(row.categoryId) ?? 0) + contrib)
  }
  let topId: string | null = null
  let topTotal = 0
  let found = false
  for (const [id, total] of totals) {
    if (!found || total > topTotal) {
      topId = id
      topTotal = total
      found = true
    }
  }
  if (!found || topTotal <= 0) return null

  const sample =
    inRangeRows.find((r) => r.categoryId === topId) ?? inRangeRows[0]
  if (!sample) return null

  // Trailing 3 calendar months before the range start
  const months: { label: string; total: number }[] = []
  let trailingSum = 0
  let monthsWithData = 0
  for (let i = 3; i >= 1; i--) {
    const monthStart = subMonths(startOfMonth(range.from), i)
    const key = formatMonthKey(monthStart)
    let total = 0
    let hasSpend = false
    for (const row of historyRows) {
      if (row.categoryId !== topId) continue
      if (formatMonthKey(startOfMonth(row.date)) !== key) continue
      const contrib = expenseContribution(row)
      // Income rows filed under an expense category contribute 0; counting them
      // as a month of data would drag the baseline down with an empty month.
      if (contrib !== 0) hasSpend = true
      total += contrib
    }
    if (hasSpend) monthsWithData++
    trailingSum += total
    months.push({ label: formatShortMonthName(monthStart), total })
  }
  months.push({ label: formatShortMonthName(range.from), total: topTotal })

  // Averaging over a fixed 3 deflates the baseline for anyone with less than
  // three months of history, which inflates the headline percentage. Only count
  // months the category actually has rows in. Zero such months leaves an avg of
  // 0, which the caller already treats as "don't render".
  return {
    categoryName: sample.categoryName,
    categoryIcon: sample.categoryIcon,
    categoryColorSchemeName: sample.categoryColorSchemeName,
    months,
    trailingAvg:
      monthsWithData > 0 ? roundToSafeInteger(trailingSum / monthsWithData) : 0,
    currentTotal: topTotal,
  }
}

export async function fetchWrappedInsights(
  range: StatsDateRange,
): Promise<WrappedInsights[]> {
  const historyFrom = subMonths(startOfMonth(range.from), 3)
  const rows = await fetchStatsTransactions(historyFrom, range.to)

  const inRange = rows.filter((r) => r.date >= range.from && r.date <= range.to)
  const history = rows.filter((r) => r.date < range.from)

  const byCurrency = groupByCurrency(inRange)
  const historyByCurrency = groupByCurrency(history)

  return [...byCurrency.entries()].map(([currency, currencyRows]) => ({
    currency,
    medianPurchase: computeMedianPurchase(currencyRows),
    mostFrequent: computeMostFrequent(currencyRows),
    topCategoryTrend: computeTopCategoryTrend(
      currencyRows,
      historyByCurrency.get(currency) ?? [],
      range,
    ),
  }))
}

export async function fetchAllStatsData(range: StatsDateRange) {
  // `allTime` has no prior period, so it carries its own range as the previous
  // one. Fetching that would re-read the entire history and then report every
  // metric as unchanged against itself; no rows means "no previous" instead.
  const hasPreviousPeriod = range.previousFrom < range.from

  const [currentRows, previousRows, balanceRows, pendingMap, accounts] =
    await Promise.all([
      fetchStatsTransactions(range.from, range.to),
      hasPreviousPeriod
        ? fetchStatsTransactions(range.previousFrom, range.previousTo)
        : Promise.resolve<StatsRawRow[]>([]),
      fetchBalanceTimeline(range.from),
      fetchPendingSummary(range.from, range.to),
      drizzleDb.all<RowAccount>(sql.raw("SELECT * FROM accounts")),
    ])

  return computeCurrencyStats(
    currentRows,
    previousRows,
    balanceRows,
    pendingMap,
    range,
    accounts,
  )
}

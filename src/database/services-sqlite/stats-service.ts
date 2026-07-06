import {
  differenceInDays,
  getDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"

import { getDb } from "~/database/db"
import type { RowAccount, RowCategory } from "~/database/types/rows"
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
  ExpenseBySubtype,
  ForecastSummary,
  IntervalDataPoint,
  PendingSummary,
  StatsDateRange,
  StatsRawRow,
  TopTagItem,
  TopTransactionItem,
} from "~/types/stats"
import type { TransactionType } from "~/types/transactions"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { getWeekStartsOn } from "~/utils/get-week-start-on"
import {
  formatIntervalLabel,
  generateDateBuckets,
  toDateKey,
} from "~/utils/stats-date-range"
import { formatDateKey, formatMonthKey } from "~/utils/time-utils"

/* ------------------------------------------------------------------ */
/* Day-of-week label helpers                                           */
/* ------------------------------------------------------------------ */

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const

/* ------------------------------------------------------------------ */
/* Stats inclusion guards                                              */
/* ------------------------------------------------------------------ */

const LOAN_EXPENSE_SUBTYPES = new Set<string>([
  TransactionSubTypeEnum.LOAN_REPAYMENT,
  TransactionSubTypeEnum.LOAN_LENT,
])

const LOAN_INCOME_SUBTYPES = new Set<string>([
  TransactionSubTypeEnum.LOAN_BORROWED,
  TransactionSubTypeEnum.LOAN_RECEIVED,
])

/**
 * True when the row counts as a real expense for statistics purposes.
 * Loan expense subtypes (repayment, lent) are excluded entirely.
 * Refunds are real expenses — they contribute a negative amount.
 */
function isRealExpense(row: { type: string; subtype: string | null }): boolean {
  if (row.type !== TransactionTypeEnum.EXPENSE) return false
  return !LOAN_EXPENSE_SUBTYPES.has(row.subtype ?? "")
}

/**
 * True when the row counts as real income for statistics purposes.
 * Loan income subtypes (borrowed, received) are excluded entirely.
 */
function isRealIncome(row: { type: string; subtype: string | null }): boolean {
  if (row.type !== TransactionTypeEnum.INCOME) return false
  return !LOAN_INCOME_SUBTYPES.has(row.subtype ?? "")
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
  const db = getDb()
  const from = fromDate.toISOString()
  const to = toDate.toISOString()

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const rows = await db.getAllAsync<{
    id: string
    account_id: string
    category_id: string | null
    amount: number
    type: string
    transaction_date: string
    account_balance_before: number
    subtype: string | null
    title: string | null
  }>(
    `SELECT t.id, t.account_id, t.category_id, t.amount, t.type, t.transaction_date,
            t.account_balance_before, t.subtype, t.title
     FROM transactions t
     WHERE t.is_deleted = 0
       AND t.is_pending = 0
       AND t.id NOT IN (SELECT from_transaction_id FROM transfers UNION SELECT to_transaction_id FROM transfers)
       AND t.transaction_date >= ?
       AND t.transaction_date <= ?`,
    [from, to],
  )

  if (rows.length === 0) return []

  const accountIds = [...new Set(rows.map((r) => r.account_id))]
  const categoryIds = [
    ...new Set(rows.map((r) => r.category_id).filter(Boolean)),
  ] as string[]

  const placeholders = (n: number) => Array(n).fill("?").join(", ")

  const [accountRows, categoryRows] = await Promise.all([
    db.getAllAsync<RowAccount>(
      `SELECT * FROM accounts WHERE id IN (${placeholders(accountIds.length)})`,
      accountIds,
    ),
    categoryIds.length > 0
      ? db.getAllAsync<RowCategory>(
          `SELECT * FROM categories WHERE id IN (${placeholders(categoryIds.length)})`,
          categoryIds,
        )
      : Promise.resolve([] as RowCategory[]),
  ])

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
      accountBalanceBefore: tx.account_balance_before,
      subtype: tx.subtype,
      title: tx.title,
    } satisfies StatsRawRow
  })
}

async function fetchBalanceTimeline(
  fromDate: Date,
  toDate: Date,
): Promise<BalanceRawRow[]> {
  const db = getDb()
  const from = fromDate.toISOString()
  const to = toDate.toISOString()

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const rows = await db.getAllAsync<{
    account_id: string
    amount: number
    transaction_date: string
    account_balance_before: number
  }>(
    `SELECT t.account_id, t.amount, t.transaction_date, t.account_balance_before
     FROM transactions t
     WHERE t.is_deleted = 0
       AND t.is_pending = 0
       AND t.transaction_date >= ?
       AND t.transaction_date <= ?`,
    [from, to],
  )

  if (rows.length === 0) return []

  const accountIds = [...new Set(rows.map((r) => r.account_id))]
  const placeholders = Array(accountIds.length).fill("?").join(", ")
  const accountRows = await db.getAllAsync<RowAccount>(
    `SELECT * FROM accounts WHERE id IN (${placeholders})`,
    accountIds,
  )
  const accountMap = new Map(accountRows.map((a) => [a.id, a]))

  return rows.map((tx) => ({
    date: new Date(tx.transaction_date),
    accountId: tx.account_id,
    accountBalanceBefore: tx.account_balance_before,
    amount: tx.amount,
    currencyCode: accountMap.get(tx.account_id)?.currency_code ?? useCode,
  }))
}

async function fetchPendingSummary(
  fromDate: Date,
  toDate: Date,
): Promise<Map<string, PendingSummary>> {
  const db = getDb()
  const from = fromDate.toISOString()
  const to = toDate.toISOString()

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const rows = await db.getAllAsync<{
    account_id: string
    amount: number
    type: string
    subtype: string | null
  }>(
    `SELECT t.account_id, t.amount, t.type, t.subtype
     FROM transactions t
     WHERE t.is_deleted = 0
       AND t.is_pending = 1
       AND t.id NOT IN (SELECT from_transaction_id FROM transfers UNION SELECT to_transaction_id FROM transfers)
       AND t.transaction_date >= ?
       AND t.transaction_date <= ?`,
    [from, to],
  )

  if (rows.length === 0) return new Map()

  const accountIds = [...new Set(rows.map((r) => r.account_id))]
  const placeholders = Array(accountIds.length).fill("?").join(", ")
  const accountRows = await db.getAllAsync<
    Pick<RowAccount, "id" | "currency_code">
  >(
    `SELECT id, currency_code FROM accounts WHERE id IN (${placeholders})`,
    accountIds,
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
    if (tx.type === TransactionTypeEnum.EXPENSE) {
      if (!LOAN_EXPENSE_SUBTYPES.has(tx.subtype ?? "")) {
        if (tx.subtype === TransactionSubTypeEnum.REFUND) {
          // Pending refund reduces pending expense
          existing.totalExpense = Math.max(0, existing.totalExpense - abs)
        } else {
          existing.totalExpense += abs
        }
      }
    } else if (tx.type === TransactionTypeEnum.INCOME) {
      if (!LOAN_INCOME_SUBTYPES.has(tx.subtype ?? "")) {
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
    avgDailyExpense: totalExpense / daySpan,
    avgDailyIncome: totalIncome / daySpan,
    avgDailyNet: net / daySpan,
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
      return formatDateKey(startOfWeek(date, { weekStartsOn: 1 }))
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

function computeBalanceTimeline(
  balanceRows: BalanceRawRow[],
  accounts: RowAccount[],
  from: Date,
  to: Date,
  historicalOpenings?: Map<string, number>,
): { timeline: BalanceTimelinePoint[]; opening: number; closing: number } {
  const buckets = generateDateBuckets(from, to, "day")

  if (accounts.length === 0) return { timeline: [], opening: 0, closing: 0 }

  const byAccount = new Map<string, BalanceRawRow[]>()
  for (const row of balanceRows) {
    const list = byAccount.get(row.accountId)
    if (list) list.push(row)
    else byAccount.set(row.accountId, [row])
  }

  const accountDailyMaps: Map<string, number>[] = []
  let openingSum = 0

  for (const account of accounts) {
    const rows = byAccount.get(account.id)
    const dailyMap = new Map<string, number>()

    if (!rows || rows.length === 0) {
      const openingBalance =
        historicalOpenings?.get(account.id) ?? account.balance
      openingSum += openingBalance
      for (const bucket of buckets) {
        dailyMap.set(toDateKey(bucket), openingBalance)
      }
    } else {
      const sorted = rows
        .slice()
        .sort((a, b) => a.date.getTime() - b.date.getTime())
      const accountOpening = sorted[0]?.accountBalanceBefore ?? 0
      openingSum += accountOpening

      const rowsByDay = new Map<string, BalanceRawRow[]>()
      for (const row of sorted) {
        const k = toDateKey(row.date)
        const list = rowsByDay.get(k) ?? []
        list.push(row)
        rowsByDay.set(k, list)
      }

      let lastBalance = accountOpening
      for (const bucket of buckets) {
        const key = toDateKey(bucket)
        const dayRows = rowsByDay.get(key)
        if (dayRows) {
          const last = dayRows[dayRows.length - 1]
          if (last) lastBalance = last.accountBalanceBefore + last.amount
        }
        dailyMap.set(key, lastBalance)
      }
    }

    accountDailyMaps.push(dailyMap)
  }

  const timeline: BalanceTimelinePoint[] = []
  for (const bucket of buckets) {
    const key = toDateKey(bucket)
    let total = 0
    for (const dailyMap of accountDailyMaps) total += dailyMap.get(key) ?? 0
    timeline.push({ date: bucket, balance: total })
  }

  const closing = timeline.at(-1)?.balance ?? openingSum
  return { timeline, opening: openingSum, closing }
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
      dayLabel: DOW_LABELS[day] ?? "",
      expense,
      avgExpense: count > 0 ? expense / count : 0,
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
    forecastedExpense: expenseRate * daysTotal,
    forecastedIncome: incomeRate * daysTotal,
    forecastedNet: (incomeRate - expenseRate) * daysTotal,
  }
}

function computeExpenseBySubtype(rows: StatsRawRow[]): ExpenseBySubtype {
  const result: ExpenseBySubtype = { recurring: 0, oneTime: 0, unclassified: 0 }
  for (const row of rows) {
    const contrib = expenseContribution(row)
    if (contrib === 0) continue
    if (row.subtype === TransactionSubTypeEnum.RECURRING)
      result.recurring += contrib
    else if (row.subtype === TransactionSubTypeEnum.ONE_TIME)
      result.oneTime += contrib
    else result.unclassified += contrib
  }
  return result
}

async function computeTopTags(rows: StatsRawRow[]): Promise<TopTagItem[]> {
  const expenseRows = rows.filter(isRealExpense)
  if (expenseRows.length === 0) return []

  const txIds = expenseRows.map((r) => r.transactionId)
  const db = getDb()
  const placeholders = Array(txIds.length).fill("?").join(", ")

  const txTagRows = await db.getAllAsync<{
    transaction_id: string
    tag_id: string
    name: string
    icon: string | null
  }>(
    `SELECT tt.transaction_id, tt.tag_id, tg.name, tg.icon
     FROM transaction_tags tt
     JOIN tags tg ON tt.tag_id = tg.id
     WHERE tt.transaction_id IN (${placeholders})`,
    txIds,
  )

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
/* Historical opening balance                                          */
/* ------------------------------------------------------------------ */

async function fetchHistoricalOpenings(
  accounts: RowAccount[],
  beforeDate: Date,
): Promise<Map<string, number>> {
  const db = getDb()
  const before = beforeDate.toISOString()

  const entries = await Promise.all(
    accounts.map(async (account) => {
      const lastTx = await db.getFirstAsync<{
        account_balance_before: number
        amount: number
      }>(
        `SELECT account_balance_before, amount
         FROM transactions
         WHERE account_id = ?
           AND is_deleted = 0
           AND is_pending = 0
           AND transaction_date < ?
         ORDER BY transaction_date DESC, created_at DESC
         LIMIT 1`,
        [account.id, before],
      )
      const opening = lastTx
        ? lastTx.account_balance_before + lastTx.amount
        : account.balance
      return [account.id, opening] as const
    }),
  )

  return new Map(entries)
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
        (a) => a.currency_code === currency && !a.exclude_from_balance,
      )

      const activeAccountIds = new Set(balRows.map((r) => r.accountId))
      const zeroActivityAccounts = currencyAccounts.filter(
        (a) => !activeAccountIds.has(a.id),
      )
      const historicalOpenings =
        zeroActivityAccounts.length > 0
          ? await fetchHistoricalOpenings(zeroActivityAccounts, range.from)
          : undefined

      const { timeline, opening, closing } = computeBalanceTimeline(
        balRows,
        currencyAccounts,
        range.from,
        range.to,
        historicalOpenings,
      )

      const spendingByDayOfWeek = computeSpendingByDayOfWeek(
        currRows,
        range.from,
        range.to,
      )
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
      } satisfies CurrencyStats
    }),
  )

  return results.sort(
    (a, b) => b.current.transactionCount - a.current.transactionCount,
  )
}

export async function fetchAllStatsData(range: StatsDateRange) {
  const db = getDb()

  const [currentRows, previousRows, balanceRows, pendingMap, accounts] =
    await Promise.all([
      fetchStatsTransactions(range.from, range.to),
      fetchStatsTransactions(range.previousFrom, range.previousTo),
      fetchBalanceTimeline(range.from, range.to),
      fetchPendingSummary(range.from, range.to),
      db.getAllAsync<RowAccount>(`SELECT * FROM accounts`),
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

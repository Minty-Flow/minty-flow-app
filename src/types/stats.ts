import type { TransactionType } from "./transactions"

export type StatsDateRangePreset =
  | "thisWeek"
  | "thisMonth"
  | "last30"
  | "thisYear"
  | "custom"

export interface StatsDateRange {
  preset: StatsDateRangePreset
  from: Date
  to: Date
  /** Equivalent range one period prior (for delta calculations) */
  previousFrom: Date
  previousTo: Date
  /** Optimal grouping granularity for charts */
  interval: "day" | "week" | "month"
}

export interface DailyDataPoint {
  /** 'yyyy-MM-dd' key */
  dateKey: string
  date: Date
  expense: number
  income: number
  net: number
}

export interface IntervalDataPoint {
  /** Chart x-axis label */
  label: string
  /** Date representing the start of this interval */
  date: Date
  expense: number
  income: number
  /** Previous period expense for comparison bar */
  prevExpense: number
  /** Previous period income for comparison */
  prevIncome: number
}

export interface CategoryBreakdownItem {
  categoryId: string | null
  categoryName: string
  categoryIcon: string | null
  /** Color scheme name from theme registry (not raw hex) */
  categoryColorSchemeName: string | null
  totalExpense: number
  totalIncome: number
  /** Percentage of total expense (0–1) */
  expensePercent: number
  transactionCount: number
  /** Previous period expense for this category (for delta calculations) */
  prevTotalExpense: number
  /** Current - previous (positive = increased spending) */
  delta: number
  /** delta / previous * 100; null when no previous data */
  deltaPercent: number | null
}

export interface CurrencyPeriodStats {
  totalExpense: number
  totalIncome: number
  net: number
  avgDailyExpense: number
  avgDailyIncome: number
  avgDailyNet: number
  transactionCount: number
}

export interface BalanceTimelinePoint {
  date: Date
  balance: number
}

export interface DayOfWeekPoint {
  /** 0 = Sunday … 6 = Saturday */
  day: number
  /** Short label e.g. "Mon" */
  dayLabel: string
  expense: number
  /** Normalized by count of that weekday in range */
  avgExpense: number
}

export interface ForecastSummary {
  isActive: boolean
  daysElapsed: number
  daysTotal: number
  forecastedExpense: number
  forecastedIncome: number
  forecastedNet: number
}

export interface ExpenseBySubtype {
  recurring: number
  oneTime: number
  unclassified: number
}

export interface TopTagItem {
  tagId: string
  tagName: string
  tagIcon: string | null
  totalExpense: number
  transactionCount: number
}

export interface AccountBreakdownItem {
  accountId: string
  accountName: string
  accountIcon: string | null
  totalExpense: number
  totalIncome: number
  transactionCount: number
  excludeFromBalance: boolean
}

export interface PendingSummary {
  count: number
  totalExpense: number
  totalIncome: number
}

export interface UncategorizedSummary {
  count: number
  totalAmount: number
}

export interface TopTransactionItem {
  transactionId: string
  title: string | null
  amount: number
  date: Date
  categoryName: string
  categoryIcon: string | null
  categoryColorSchemeName: string | null
  currencyCode: string
}

export interface CurrencyStats {
  currency: string
  /** Current period */
  current: CurrencyPeriodStats
  /** Same period last cycle (for delta badges) */
  previous: CurrencyPeriodStats | null
  /** Day-by-day breakdown for line chart */
  dailyData: DailyDataPoint[]
  /** Day-by-day breakdown for previous period (comparison line) */
  previousDailyData: DailyDataPoint[]
  /** Interval breakdown for bar chart (day/week/month depending on range) */
  intervalData: IntervalDataPoint[]
  /** Spending by category, sorted by expense desc */
  categoryBreakdown: CategoryBreakdownItem[]
  /** Highest spending category (convenience) */
  topCategory: CategoryBreakdownItem | null
  /** Balance over time for the selected period */
  balanceTimeline: BalanceTimelinePoint[]
  /** Balance at start of period */
  openingBalance: number
  /** Balance at end of period */
  closingBalance: number
  /** closingBalance - openingBalance */
  balanceDelta: number
  /** Expense aggregated by day of week */
  spendingByDayOfWeek: DayOfWeekPoint[]
  /** Forecast for in-progress ranges; null for historical ranges */
  forecast: ForecastSummary | null
  /** Expense split by transaction subtype */
  expenseBySubtype: ExpenseBySubtype
  /** Top tags by expense */
  topTags: TopTagItem[]
  /** Per-account breakdown */
  byAccount: AccountBreakdownItem[]
  /** Pending transactions summary (excluded from main stats) */
  pendingSummary: PendingSummary | null
  /** Uncategorized transactions summary */
  uncategorizedSummary: UncategorizedSummary | null
  /** Top 5 expense transactions by amount */
  topTransactions: TopTransactionItem[]
}

/** Supplement data fetched independently of the date range */
export interface StatsSupplement {
  currency: string
  /** Sum of account.balance for this currency (excluding excludeFromBalance accounts) */
  currentNetBalance: number
  accountBalanceSummary: Array<{
    accountId: string
    accountName: string
    balance: number
    excludeFromBalance: boolean
    icon: string | null
    colorSchemeName: string | null
  }>
}

/** Raw row shape returned by fetchStatsTransactions before aggregation */
export interface StatsRawRow {
  transactionId: string
  type: TransactionType
  amount: number
  date: Date
  currencyCode: string
  categoryId: string | null
  categoryName: string
  categoryIcon: string | null
  categoryColorSchemeName: string | null
  /** Account that owns this transaction */
  accountId: string
  /** Balance snapshot before this transaction was applied */
  accountBalanceBefore: number
  /** Transaction subtype: 'recurring' | 'one-time' | null */
  subtype: string | null
  /** Transaction title/description */
  title: string | null | undefined
}

/** Raw row for balance timeline (includes transfers) */
export interface BalanceRawRow {
  date: Date
  accountId: string
  accountBalanceBefore: number
  amount: number
  currencyCode: string
}

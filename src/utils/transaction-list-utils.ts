/**
 * Shared utilities for filtering, searching, and grouping transaction lists.
 * Used by both the home screen and account detail screen.
 */

import { addDays, endOfMonth, startOfMonth, startOfWeek } from "date-fns"

import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
import {
  TransferLayoutEnum,
  type TransferLayoutType,
} from "~/stores/transfers-preferences.store"
import type {
  GroupByOption,
  SearchMatchType,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import {
  AttachmentsOptionsEnum,
  PendingOptionsEnum,
} from "~/types/transaction-filters"
import type { TransactionType } from "~/types/transactions"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"

/** Mirror of the service-layer attachment check, for in-memory (post-query) filtering. */
function transactionHasAttachments(
  extra: Record<string, string> | null,
): boolean {
  if (!extra?.attachments) return false
  try {
    const parsed = JSON.parse(extra.attachments) as unknown
    if (Array.isArray(parsed)) return parsed.length > 0
    if (typeof parsed === "object" && parsed !== null)
      return Object.keys(parsed).length > 0
    return false
  } catch {
    return extra.attachments.length > 0
  }
}

/**
 * Apply the UI filter state to an already-loaded transaction list (in memory).
 * The DB query only narrows by date range, so every structural filter
 * (account / category / tag / type / currency / attachment) is enforced here.
 * `groupBy` and `pendingFilter` are handled by the caller, not this function.
 */
export function applyTransactionFilters(
  list: TransactionWithRelations[],
  filterState: TransactionListFilterState,
): TransactionWithRelations[] {
  let out = list

  if (filterState.accountIds.length > 0) {
    const set = new Set(filterState.accountIds)
    out = out.filter((r) => set.has(r.accountId))
  }
  if (filterState.categoryIds.length > 0) {
    const set = new Set(filterState.categoryIds)
    out = out.filter((r) => r.categoryId != null && set.has(r.categoryId))
  }
  if (filterState.tagIds.length > 0) {
    const set = new Set(filterState.tagIds)
    out = out.filter((r) => r.tagIds.some((id) => set.has(id)))
  }
  if (filterState.typeFilters.length > 0) {
    const set = new Set(filterState.typeFilters)
    out = out.filter((r) => set.has(r.type))
  }
  if (filterState.currencyIds.length > 0) {
    const set = new Set(filterState.currencyIds)
    out = out.filter(
      (r) => r.account != null && set.has(r.account.currencyCode),
    )
  }
  if (filterState.attachmentFilter !== AttachmentsOptionsEnum.ALL) {
    const wantHas = filterState.attachmentFilter === AttachmentsOptionsEnum.HAS
    out = out.filter((r) => transactionHasAttachments(r.extra) === wantHas)
  }

  return out
}

/** Apply the pending filter; "all"/"notPending" keep only confirmed rows, "pending" keeps only pending rows. */
export function applyPendingFilter(
  list: TransactionWithRelations[],
  pendingFilter: TransactionListFilterState["pendingFilter"],
): TransactionWithRelations[] {
  return pendingFilter === PendingOptionsEnum.PENDING
    ? list.filter((r) => r.isPending)
    : list.filter((r) => !r.isPending)
}

/**
 * Apply transfer layout preference: when "combine", show one row per transfer.
 * Prefer the source/debit row, but if an upstream filter removed it (e.g. the
 * list is scoped to the destination account), keep the surviving side so the
 * transfer never disappears entirely. When "separate", show both rows.
 */
export function applyTransferLayout(
  list: TransactionWithRelations[],
  layout: TransferLayoutType,
): TransactionWithRelations[] {
  if (layout === TransferLayoutEnum.SEPARATE) return list

  const debitGroupIds = new Set<string>()
  for (const row of list) {
    if (row.isTransfer && row.transferGroupId && row.amount < 0) {
      debitGroupIds.add(row.transferGroupId)
    }
  }

  const keptGroupIds = new Set<string>()
  return list.filter((row) => {
    if (!row.isTransfer || !row.transferGroupId) return true
    if (debitGroupIds.has(row.transferGroupId)) return row.amount < 0
    if (keptGroupIds.has(row.transferGroupId)) return false
    keptGroupIds.add(row.transferGroupId)
    return true
  })
}

import {
  formatDateKey,
  formatHourKey,
  formatHourTitle,
  formatMonthKey,
  formatMonthTitle,
  formatSectionDateTitle,
  formatWeekKey,
  formatWeekTitle,
  formatYear,
} from "~/utils/time-utils"

/** Signed contribution for aggregation: income adds, expense subtracts, refund adds back, transfer is neutral. */
function transactionContribution(
  type: TransactionType,
  amount: number,
  subtype?: string | null,
): number {
  if (type === TransactionTypeEnum.INCOME) return amount
  if (type === TransactionTypeEnum.EXPENSE) {
    // Refunds are stored as expenses but add back to the balance/net
    if (subtype === TransactionSubTypeEnum.REFUND) return amount
    return -amount
  }
  return 0
}

/** Default date range: current month extended by timeframeDays so upcoming (e.g. recurring) can show. */
function getDefaultDateRange(timeframeDays: number) {
  const now = new Date()
  const from = startOfMonth(now)
  const endOfMonthDate = endOfMonth(now)
  const extendedEnd = addDays(now, timeframeDays)
  return {
    fromDate: from.getTime(),
    toDate: Math.max(endOfMonthDate.getTime(), extendedEnd.getTime()),
  }
}

/** Build query filters for the DB: only date range. */
export function buildQueryFilters(
  selectedRange: { start: Date; end: Date } | null,
  homeTimeframe: number,
) {
  return selectedRange
    ? {
        fromDate: selectedRange.start.getTime(),
        toDate: selectedRange.end.getTime(),
      }
    : getDefaultDateRange(homeTimeframe)
}

/**
 * Search over title (and notes when included), honouring the match type:
 * - `untitled` keeps rows with no title, ignoring the query.
 * - `exact` matches the full field; `smart`/`partial` match a substring.
 * An empty query is a no-op for every type except `untitled`.
 */
export function applySearch(
  list: TransactionWithRelations[],
  searchState: {
    query: string
    matchType: SearchMatchType
    includeNotes: boolean
  },
): TransactionWithRelations[] {
  if (searchState.matchType === "untitled") {
    return list.filter((r) => !r.title || r.title.trim().length === 0)
  }

  const q = searchState.query.trim().toLowerCase()
  if (!q) return list

  const fieldMatches = (field: string | null | undefined): boolean => {
    if (!field) return false
    const value = field.toLowerCase()
    return searchState.matchType === "exact" ? value === q : value.includes(q)
  }

  return list.filter(
    (r) =>
      fieldMatches(r.title) ||
      (searchState.includeNotes && fieldMatches(r.description)),
  )
}

function getSectionKeyAndTitle(
  date: Date,
  groupBy: GroupByOption,
  allTimeLabel: string,
): { key: string; title: string } {
  switch (groupBy) {
    case "hour":
      return {
        key: formatHourKey(date),
        title: formatHourTitle(date),
      }
    case "day":
      return {
        key: formatDateKey(date),
        title: formatSectionDateTitle(date),
      }
    case "week": {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 })
      return {
        key: formatWeekKey(weekStart),
        title: formatWeekTitle(weekStart),
      }
    }
    case "month":
      return {
        key: formatMonthKey(date),
        title: formatMonthTitle(date),
      }
    case "year":
      return {
        key: formatYear(date),
        title: formatYear(date),
      }
    case "allTime":
      return { key: "all", title: allTimeLabel }
    default:
      return {
        key: formatDateKey(date),
        title: formatSectionDateTitle(date),
      }
  }
}

interface TransactionSection {
  title: string
  data: TransactionWithRelations[]
  totals: Record<string, number>
}

/** Group a sorted & filtered transaction list into sections by the chosen groupBy option. */
export function buildTransactionSections(
  list: TransactionWithRelations[],
  groupBy: GroupByOption,
  allTimeLabel: string,
): TransactionSection[] {
  if (list.length === 0) {
    return []
  }

  const sortedList = [...list].sort((a, b) => {
    const timeA =
      a.transactionDate instanceof Date
        ? a.transactionDate.getTime()
        : a.transactionDate
    const timeB =
      b.transactionDate instanceof Date
        ? b.transactionDate.getTime()
        : b.transactionDate
    if (timeB !== timeA) return timeB - timeA
    const createdA =
      a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt
    const createdB =
      b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt
    return (createdB ?? 0) - (createdA ?? 0)
  })

  const grouped: Record<string, TransactionSection> = {}

  if (groupBy === "allTime") {
    const key = "all"
    grouped[key] = { title: allTimeLabel, data: [], totals: {} }
    for (const row of sortedList) {
      grouped[key].data.push(row)
      const currency = row.account?.currencyCode ?? ""
      const contribution = transactionContribution(
        row.type,
        row.amount,
        row.subtype,
      )
      grouped[key].totals[currency] =
        (grouped[key].totals[currency] || 0) + contribution
    }
  } else {
    for (const row of sortedList) {
      const d =
        row.transactionDate instanceof Date
          ? row.transactionDate
          : new Date(row.transactionDate)
      const { key: dateKey, title: headerTitle } = getSectionKeyAndTitle(
        d,
        groupBy,
        allTimeLabel,
      )

      if (!grouped[dateKey]) {
        grouped[dateKey] = { title: headerTitle, data: [], totals: {} }
      }

      grouped[dateKey].data.push(row)
      const currency = row.account?.currencyCode ?? ""
      const contribution = transactionContribution(
        row.type,
        row.amount,
        row.subtype,
      )
      grouped[dateKey].totals[currency] =
        (grouped[dateKey].totals[currency] || 0) + contribution
    }
  }

  return Object.values(grouped).sort((a, b) => {
    if (a.data.length === 0 || b.data.length === 0) return 0
    return (
      b.data[0].transactionDate.getTime() - a.data[0].transactionDate.getTime()
    )
  })
}

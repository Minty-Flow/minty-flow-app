import type { TransactionType } from "./transactions"

export const PendingOptionsEnum = {
  ALL: "all",
  PENDING: "pending",
  NOT_PENDING: "notPending",
} as const

export type PendingOptionsType =
  (typeof PendingOptionsEnum)[keyof typeof PendingOptionsEnum]

/** How search text is matched: smart/partial = substring, exact = full string, untitled = no title. */
export type SearchMatchType = "smart" | "partial" | "exact" | "untitled"

/** Search panel state: query + match type + whether to include notes. */
export interface SearchState {
  query: string
  matchType: SearchMatchType
  includeNotes: boolean
}

export const DEFAULT_SEARCH_STATE: SearchState = {
  query: "",
  matchType: "smart",
  includeNotes: true,
}

/** UI filter state for the transaction list header. */
export interface TransactionListFilterState {
  /** Selected account IDs; empty = all accounts. */
  accountIds: string[]
  /** Selected category IDs; empty = all categories. */
  categoryIds: string[]
  /** Selected tag IDs; empty = all tags. */
  tagIds: string[]
  /** Pending filter: all, only pending, or only not pending. */
  pendingFilter: PendingOptionsType
  /** Selected transaction types; empty = all types. */
  typeFilters: TransactionType[]
  /** How to group sections in the list. */
  groupBy: GroupByOption
  /** Attachment filter: all, has attachments, or has no attachments. */
  attachmentFilter: AttachmentsOptionsType
  /** Selected currency codes; empty = all currencies. */
  currencyIds: string[]
}

export type GroupByOption =
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year"
  | "allTime"

export const AttachmentsOptionsEnum = {
  ALL: "all",
  HAS: "has",
  NONE: "none",
} as const

export type AttachmentsOptionsType =
  (typeof AttachmentsOptionsEnum)[keyof typeof AttachmentsOptionsEnum]

export const DEFAULT_TRANSACTION_LIST_FILTER_STATE: TransactionListFilterState =
  {
    accountIds: [],
    categoryIds: [],
    tagIds: [],
    pendingFilter: PendingOptionsEnum.ALL,
    typeFilters: [],
    groupBy: "day",
    attachmentFilter: AttachmentsOptionsEnum.ALL,
    currencyIds: [],
  }

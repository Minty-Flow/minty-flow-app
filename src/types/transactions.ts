export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly"
  | null

/** How a recurring transaction ends: never, on a specific date, or after N occurrences */
export type RecurringEndType = "never" | "date" | "occurrences"

/** Attachment metadata for transaction extra (e.g. file attachments) */
export interface TransactionAttachment {
  uri: string
  name: string
  size: number
  addedAt: Date
  ext: string
}

/**
 * Transaction type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */
export const TransactionTypeEnum = {
  EXPENSE: "expense",
  INCOME: "income",
  TRANSFER: "transfer",
} as const

export type TransactionType =
  (typeof TransactionTypeEnum)[keyof typeof TransactionTypeEnum]

export interface TransactionLocation {
  latitude: number
  longitude: number
  address: string | null
}

/**
 * Transaction domain type for UI/API usage.
 *
 * This is the single source of truth for the Transaction shape.
 * The WatermelonDB model implements this interface, ensuring
 * the persistence layer conforms to the domain model.
 */
/**
 * Transaction domain type. Currency is not stored here; it is always derived
 * from the account (accountId). Type explains meaning; amount is the numeric value.
 */
export interface Transaction {
  id: string
  type: TransactionType // "expense" | "income" | "transfer"
  transactionDate: Date
  isDeleted: boolean
  deletedAt: Date | null
  title: string | null
  description: string | null
  amount: number
  isPending: boolean
  requiresManualConfirmation: boolean | null

  subtype: string | null // More specific classification
  extra: Record<string, string> | null // Custom metadata object (stored as JSON)

  /** True on both debit and credit rows of a transfer. */
  isTransfer: boolean
  /** Shared UUID linking the two halves of a transfer. */
  transferId: string | null
  /** The other account in the transfer. */
  relatedAccountId: string | null
  /** Balance of account before this transaction was applied (snapshot at creation). */
  accountBalanceBefore: number

  categoryId: string | null
  accountId: string
  goalId: string | null
  budgetId: string | null
  loanId: string | null
  location: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Filters for transaction list queries (service layer).
 * All structural filters: database returns exactly the rows that exist.
 * Dates are Unix timestamps for WatermelonDB Q.gte / Q.lte.
 */
export interface TransactionListFilters {
  accountId?: string
  /** When set and non-empty, filter to these account IDs only. */
  accountIds?: string[]
  categoryId?: string
  /** When set and non-empty, filter to these category IDs only. */
  categoryIds?: string[]
  type?: TransactionType
  /** When set and non-empty, filter to these types only (income/expense/transfer). */
  typeFilters?: TransactionType[]
  isPending?: boolean
  includeDeleted?: boolean
  /** When true, return only soft-deleted transactions (for trash). */
  deletedOnly?: boolean
  /** Start of range (inclusive), Unix timestamp. */
  fromDate?: number
  /** End of range (inclusive), Unix timestamp. */
  toDate?: number
  /** Search in title (and optionally description). */
  search?: string
  /** How to match: smart/partial = substring, exact = full string, untitled = empty title. */
  searchMatchType?: "smart" | "partial" | "exact" | "untitled"
  /** When true, search also in notes (description); when false, title only. */
  searchIncludeNotes?: boolean
  /** Min amount (inclusive). */
  minAmount?: number
  /** Max amount (inclusive). */
  maxAmount?: number
  /** When set and non-empty, only transactions that have at least one of these tags (DB join). */
  tagIds?: string[]
  /** When set, filter to transactions linked to this goal. */
  goalId?: string
  /** When set, filter to transactions linked to this budget. */
  budgetId?: string
  /** When set, filter to transactions linked to this loan. */
  loanId?: string
  /** Filter by attachment presence (DB column has_attachments). */
  attachmentFilter?: "all" | "has" | "none"
}

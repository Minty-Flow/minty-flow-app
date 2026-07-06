export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly"
  | null

export const RecurringEndEnum = {
  NEVER: "never",
  DATE: "date",
  OCCURRENCES: "occurrences",
}

/** How a recurring transaction ends: never, on a specific date, or after N occurrences */
export type RecurringEndType =
  (typeof RecurringEndEnum)[keyof typeof RecurringEndEnum]

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
 */
export const TransactionTypeEnum = {
  EXPENSE: "expense",
  INCOME: "income",
  TRANSFER: "transfer",
} as const

export type TransactionType =
  (typeof TransactionTypeEnum)[keyof typeof TransactionTypeEnum]

export const TransactionSubTypeEnum = {
  RECURRING: "recurring",
  ONE_TIME: "one-time",
  REFUND: "refund",
  LOAN_BORROWED: "loan_borrowed",
  LOAN_REPAYMENT: "loan_repayment",
  LOAN_LENT: "loan_lent",
  LOAN_RECEIVED: "loan_received",
} as const

export type TransactionSubType =
  (typeof TransactionSubTypeEnum)[keyof typeof TransactionSubTypeEnum]

export interface TransactionLocation {
  latitude: number
  longitude: number
  address: string | null
}

/**
 * Transaction domain type. Currency is not stored here; it is always derived
 * from the account (accountId). Type explains meaning; amount is the numeric
 * value in minor currency units (e.g. cents).
 *
 * Transfer legs are identified by the presence of a matching row in the
 * `transfers` join table — the `transactions` table no longer carries
 * `is_transfer`, `transfer_id`, or `related_account_id` columns.
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
  requiresManualConfirmation: boolean

  subtype: TransactionSubType | null // More specific classification
  extra: Record<string, string> | null // Custom metadata object (stored as JSON)

  /** Balance of account before this transaction was applied (snapshot at creation). */
  accountBalanceBefore: number

  categoryId: string | null
  accountId: string
  goalId: string | null
  budgetId: string | null
  loanId: string | null
  location: string | null
  recurringId: string | null
  createdAt: Date
  updatedAt: Date
}

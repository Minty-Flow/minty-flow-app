/**
 * Loan type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

export const LoanTypeEnum = {
  BORROWED: "borrowed",
  LENT: "lent",
} as const

export type LoanType = (typeof LoanTypeEnum)[keyof typeof LoanTypeEnum]

export const LoanTermEnum = {
  /** Lent/borrowed lump created and closed from the transaction form. */
  ONE_TIME: "one_time",
  /** Progress-tracked loan (the pre-Slice-4 behaviour). */
  LONG_TERM: "long_term",
} as const

export type LoanTerm = (typeof LoanTermEnum)[keyof typeof LoanTermEnum]

/**
 * Loan domain type for UI/API usage.
 *
 * Loan domain type. Single source of truth for the Loan shape.
 */
export interface Loan {
  id: string
  name: string
  description: string | null
  principalAmount: number
  loanType: LoanType
  term: LoanTerm
  dueDate: Date | null
  accountId: string
  categoryId: string
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  isOverdue: boolean // Computed: dueDate != null && now > dueDate; always pair with !isClosed guard in UI
  // Computed in the loan read-model from non-deleted, non-pending transactions
  // where loan_id = id AND type = getRepaymentTypeForLoan(loanType) (LP).
  repaidAmount: number
  remainingAmount: number // max(0, principalAmount - repaidAmount)
  progress: number // clamp(repaidAmount / principalAmount, 0, 1); 1 when principal is 0
  isClosed: boolean // progress >= 1
  createdAt: Date
  updatedAt: Date
}

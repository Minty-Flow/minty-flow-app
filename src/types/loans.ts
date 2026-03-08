/**
 * Loan type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */

export type LoanType = "borrowed" | "lent"

/**
 * Loan domain type for UI/API usage.
 *
 * This is the single source of truth for the Loan shape.
 * The WatermelonDB model implements this interface, ensuring
 * the persistence layer conforms to the domain model.
 */
export interface Loan {
  id: string
  name: string
  description: string | null
  principalAmount: number
  remainingAmount: number
  interestRate: number | null // As percentage
  currencyCode: string
  loanType: LoanType
  contactName: string | null
  contactPhone: string | null
  dueDate: Date | null
  accountId: string | null
  isPaid: boolean
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
  // Computed properties (from model getters)
  paidAmount: number
  progressPercentage: number
  isOverdue: boolean
  totalAmountWithInterest: number
}

export interface LoanFormData {
  name: string
  description?: string
  principalAmount: number
  interestRate?: number
  currencyCode: string
  loanType: LoanType
  contactName?: string
  contactPhone?: string
  dueDate?: Date
  accountId?: string
}

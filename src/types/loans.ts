/**
 * Loan type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */

import type { MintyColorScheme } from "~/styles/theme/types"

export const LoanTypeEnum = {
  BORROWED: "borrowed",
  LENT: "lent",
} as const

export type LoanType = (typeof LoanTypeEnum)[keyof typeof LoanTypeEnum]

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
  loanType: LoanType
  dueDate: Date | null
  accountId: string
  categoryId: string
  icon: string | null
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  isOverdue: boolean // Computed: dueDate != null && now > dueDate; always pair with !isPaid guard in UI
  createdAt: Date
  updatedAt: Date
}

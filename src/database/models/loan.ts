import { Model } from "@nozbe/watermelondb"
import { date, field, relation } from "@nozbe/watermelondb/decorators"

import type {
  Loan as LoanType,
  LoanType as LoanTypeEnum,
} from "../../types/loans"
import type AccountModel from "./account"

/**
 * Loan model representing borrowed and lent money.
 *
 * Implements the Loan domain type, ensuring the persistence layer
 * conforms to the business logic contract.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 * - Relations use _id suffix for foreign keys
 */
export default class LoanModel extends Model implements LoanType {
  static table = "loans"

  @field("name") name!: string
  @field("description") description!: string | null
  @field("principal_amount") principalAmount!: number
  @field("remaining_amount") remainingAmount!: number
  @field("interest_rate") interestRate!: number | null
  @field("currency_code") currencyCode!: string
  @field("loan_type") loanType!: LoanTypeEnum
  @field("contact_name") contactName!: string | null
  @field("contact_phone") contactPhone!: string | null
  @date("due_date") dueDate!: Date | null
  @field("account_id") accountId!: string | null
  @relation("accounts", "account_id") account!: AccountModel | null
  @field("is_paid") isPaid!: boolean
  @field("is_archived") isArchived!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the paid amount.
   * This computed property satisfies the domain type's paidAmount requirement.
   */
  get paidAmount(): number {
    return this.principalAmount - this.remainingAmount
  }

  /**
   * Gets the progress percentage (0-100).
   * This computed property satisfies the domain type's progressPercentage requirement.
   */
  get progressPercentage(): number {
    if (this.principalAmount === 0) return 0
    return Math.min(100, (this.paidAmount / this.principalAmount) * 100)
  }

  /**
   * Checks if the loan is overdue.
   * This computed property satisfies the domain type's isOverdue requirement.
   */
  get isOverdue(): boolean {
    if (this.isPaid || !this.dueDate) return false
    return new Date() > this.dueDate
  }

  /**
   * Gets the total amount with interest.
   * This computed property satisfies the domain type's totalAmountWithInterest requirement.
   */
  get totalAmountWithInterest(): number {
    if (!this.interestRate) return this.principalAmount
    return this.principalAmount * (1 + this.interestRate / 100)
  }
}

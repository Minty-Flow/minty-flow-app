import { Model } from "@nozbe/watermelondb"
import { date, field } from "@nozbe/watermelondb/decorators"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan, LoanType } from "~/types/loans"

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
export default class LoanModel extends Model implements Loan {
  static table = "loans"

  @field("name") name!: string
  @field("description") description!: string | null
  @field("principal_amount") principalAmount!: number
  @field("loan_type") loanType!: LoanType
  @date("due_date") dueDate!: Date | null
  @field("account_id") accountId!: string
  @field("category_id") categoryId!: string
  @field("icon") icon!: string | null
  @field("color_scheme_name") colorSchemeName!: string | null
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the color scheme object from the theme registry.
   */
  get colorScheme() {
    return getThemeStrict(this.colorSchemeName)
  }

  /**
   * Checks if the loan is overdue.
   * True when a due date is set and today is past it.
   */
  get isOverdue(): boolean {
    if (!this.dueDate) return false
    return new Date() > this.dueDate
  }
}

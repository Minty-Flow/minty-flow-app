import type { Loan } from "~/types/loans"

import type LoanModel from "../models/loan"

/**
 * Convert LoanModel to Loan domain type.
 *
 * Unlike goals/budgets, loans use direct foreign keys (account_id, category_id)
 * rather than join tables, so no extra parameters are needed.
 */
export const modelToLoan = (model: LoanModel): Loan => {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    principalAmount: model.principalAmount,
    loanType: model.loanType,
    dueDate: model.dueDate,
    accountId: model.accountId,
    categoryId: model.categoryId,
    icon: model.icon,
    colorSchemeName: model.colorSchemeName,
    colorScheme: model.colorScheme,
    isOverdue: model.isOverdue,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  }
}

import { getThemeStrict } from "~/styles/theme/registry"
import type { Loan, LoanType } from "~/types/loans"

import type { RowLoan } from "../types/rows"

export function mapLoan(row: RowLoan): Loan {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    principalAmount: row.principal_amount,
    loanType: row.loan_type as LoanType,
    dueDate: row.due_date != null ? new Date(row.due_date) : null,
    accountId: row.account_id,
    categoryId: row.category_id,
    icon: row.icon,
    colorSchemeName: row.color_scheme_name,
    colorScheme: getThemeStrict(row.color_scheme_name),
    isOverdue: row.due_date != null && new Date() > new Date(row.due_date),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

import type { Account } from "~/types/accounts"
import type { Budget } from "~/types/budgets"
import type { Category } from "~/types/categories"

export interface BudgetModifyContentProps {
  budgetModifyId: string
  budget?: Budget
  accounts: Account[]
  categories: Category[]
}

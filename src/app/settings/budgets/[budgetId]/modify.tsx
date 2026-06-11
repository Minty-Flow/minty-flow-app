import { useLocalSearchParams } from "expo-router"

import { BudgetModifyContent } from "~/components/budgets/budget-modify/budget-modify-content"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useBudget } from "~/stores/db/budget.store"
import { useCategoriesByType } from "~/stores/db/category.store"
import { NewEnum } from "~/types/new"
import { TransactionTypeEnum } from "~/types/transactions"

export default function ModifyBudgetScreen() {
  const params = useLocalSearchParams<{ budgetId: string }>()
  const budgetId = params.budgetId

  const isAddMode = budgetId === NewEnum.NEW || !budgetId
  const budget = useBudget(budgetId ?? "")
  const accounts = useActiveAccounts()
  const categories = useCategoriesByType(TransactionTypeEnum.EXPENSE)

  if (isAddMode) {
    return (
      <BudgetModifyContent
        budgetModifyId={NewEnum.NEW}
        accounts={accounts}
        categories={categories}
      />
    )
  }

  return (
    <BudgetModifyContent
      key={budgetId}
      budgetModifyId={budgetId}
      budget={budget}
      accounts={accounts}
      categories={categories}
    />
  )
}

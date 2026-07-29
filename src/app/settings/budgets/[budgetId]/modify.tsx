import { useLocalSearchParams } from "expo-router"

import { BudgetModifyContent } from "~/components/budgets/budget-modify/budget-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useBudgetsQuery } from "~/database/drizzle/hooks/use-budgets-query"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useCategoriesByType } from "~/stores/db/category.store"
import { NewEnum } from "~/types/new"
import { TransactionTypeEnum } from "~/types/transactions"

export default function ModifyBudgetScreen() {
  const params = useLocalSearchParams<{ budgetId: string }>()
  const budgetId = params.budgetId

  const isAddMode = budgetId === NewEnum.NEW || !budgetId
  const budgetsQuery = useBudgetsQuery()
  const budget = budgetsQuery.data.find((item) => item.id === budgetId)
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

  if (budgetsQuery.updatedAt === undefined) return <RouteLoadingState />
  if (!budget) return <RouteNotFoundState message="Budget not found." />

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

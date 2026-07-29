import { useLocalSearchParams } from "expo-router"

import { BudgetModifyContent } from "~/components/budgets/budget-modify/budget-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useBudgetsQuery } from "~/database/drizzle/read-models/budget-read-model"
import { useCategoriesByType } from "~/database/drizzle/read-models/category-read-model"
import { useModifyRouteLoader } from "~/hooks/use-modify-route-loader"
import { NewEnum } from "~/types/new"
import { TransactionTypeEnum } from "~/types/transactions"

export default function ModifyBudgetScreen() {
  const params = useLocalSearchParams<{ budgetId: string }>()
  const budgetId = params.budgetId

  const budgetsQuery = useBudgetsQuery()
  const loadState = useModifyRouteLoader({
    id: budgetId,
    data: budgetsQuery.data,
    updatedAt: budgetsQuery.updatedAt,
    find: (item, id) => item.id === id,
    notFoundMessage: "Budget not found.",
  })
  const accounts = useActiveAccounts()
  const categories = useCategoriesByType(TransactionTypeEnum.EXPENSE)

  if (loadState.mode === "new") {
    return (
      <BudgetModifyContent
        budgetModifyId={NewEnum.NEW}
        accounts={accounts}
        categories={categories}
      />
    )
  }

  if (loadState.mode === "loading") return <RouteLoadingState />
  if (loadState.mode === "not-found") {
    return <RouteNotFoundState message={loadState.message} />
  }

  return (
    <BudgetModifyContent
      key={budgetId}
      budgetModifyId={budgetId}
      budget={loadState.entity}
      accounts={accounts}
      categories={categories}
    />
  )
}

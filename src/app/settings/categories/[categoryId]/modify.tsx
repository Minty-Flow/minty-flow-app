import { useLocalSearchParams } from "expo-router"

import { CategoryModifyContent } from "~/components/categories/category-modify/category-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useCategoriesQuery } from "~/database/drizzle/hooks/use-categories-query"
import { NewEnum } from "~/types/new"
import type { TransactionType } from "~/types/transactions"

export default function EditCategoryScreen() {
  const params = useLocalSearchParams<{
    categoryId: string
    initialType: TransactionType
  }>()

  const isAddMode = params.categoryId === NewEnum.NEW || !params.categoryId
  const categoriesQuery = useCategoriesQuery()
  const category = categoriesQuery.data.find(
    (item) => item.id === params.categoryId,
  )

  if (isAddMode) {
    return (
      <CategoryModifyContent
        categoryModifyId={params.categoryId || NewEnum.NEW}
        initialType={params.initialType}
      />
    )
  }

  if (categoriesQuery.updatedAt === undefined) return <RouteLoadingState />
  if (!category) return <RouteNotFoundState message="Category not found." />

  return (
    <CategoryModifyContent
      key={params.categoryId}
      categoryModifyId={params.categoryId}
      category={category}
    />
  )
}

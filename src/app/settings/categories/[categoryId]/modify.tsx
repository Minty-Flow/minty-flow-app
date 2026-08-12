import { useLocalSearchParams } from "expo-router"

import { CategoryModifyContent } from "~/components/categories/category-modify/category-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useCategoriesQuery } from "~/database/drizzle/read-models/category-read-model"
import { useModifyRouteLoader } from "~/hooks/use-modify-route-loader"
import type { CategoryType } from "~/types/categories"
import { NewEnum } from "~/types/new"

export default function EditCategoryScreen() {
  const params = useLocalSearchParams<{
    categoryId: string
    initialType: CategoryType
  }>()

  const categoriesQuery = useCategoriesQuery()
  const loadState = useModifyRouteLoader({
    id: params.categoryId,
    data: categoriesQuery.data,
    updatedAt: categoriesQuery.updatedAt,
    find: (item, id) => item.id === id,
    notFoundMessage: "Category not found.",
  })

  if (loadState.mode === "new") {
    return (
      <CategoryModifyContent
        categoryModifyId={params.categoryId || NewEnum.NEW}
        initialType={params.initialType}
      />
    )
  }

  if (loadState.mode === "loading") return <RouteLoadingState />
  if (loadState.mode === "not-found") {
    return <RouteNotFoundState message={loadState.message} />
  }

  return (
    <CategoryModifyContent
      key={params.categoryId}
      categoryModifyId={params.categoryId}
      category={loadState.entity}
    />
  )
}

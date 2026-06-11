import { useLocalSearchParams } from "expo-router"

import { CategoryModifyContent } from "~/components/categories/category-modify/category-modify-content"
import { useCategory } from "~/stores/db/category.store"
import { NewEnum } from "~/types/new"
import type { TransactionType } from "~/types/transactions"

export default function EditCategoryScreen() {
  const params = useLocalSearchParams<{
    categoryId: string
    initialType: TransactionType
  }>()

  const isAddMode = params.categoryId === NewEnum.NEW || !params.categoryId
  const category = useCategory(params.categoryId ?? "")

  if (isAddMode) {
    return (
      <CategoryModifyContent
        categoryModifyId={params.categoryId || NewEnum.NEW}
        initialType={params.initialType}
      />
    )
  }

  return (
    <CategoryModifyContent
      key={params.categoryId}
      categoryModifyId={params.categoryId}
      category={category}
    />
  )
}

import { useLocalSearchParams } from "expo-router"

import { AddCategoryContent } from "~/components/categories/add-category-content"
import { type CategoryType, CategoryTypeEnum } from "~/types/categories"

export default function AddCategoryScreen() {
  const params = useLocalSearchParams<{ type: CategoryType }>()
  return <AddCategoryContent type={params.type || CategoryTypeEnum.EXPENSE} />
}

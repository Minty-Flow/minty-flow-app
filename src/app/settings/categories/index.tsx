import { useLocalSearchParams } from "expo-router"

import type { TransactionType } from "~/types/transactions"

import { CategoryScreenContent } from "../../../components/categories/category-screen-content"

export default function CategoriesIndexScreen() {
  const params = useLocalSearchParams<{
    createdCategory?: string
    updatedCategory?: string
    deletedCategory?: string
    type?: TransactionType
  }>()

  // Assuming activeTab and searchQuery would be defined elsewhere if needed for CategoryList
  // For now, let's pass params.type as the type prop and an empty string for searchQuery
  // and directly pass the extraListProps as individual props to CategoryList
  return (
    <CategoryScreenContent
      initialType={params.type}
      extraListProps={{
        createdCategory: params.createdCategory,
        updatedCategory: params.updatedCategory,
        deletedCategory: params.deletedCategory,
      }}
    />
  )
}

import { useCategoriesQuery } from "~/database/drizzle/hooks/use-categories-query"
import type { Category } from "~/types/categories"

export function useCategories(): Category[] {
  return useCategoriesQuery().data
}

export function useCategoriesByType(type: string): Category[] {
  return useCategories().filter((category) => category.type === type)
}

export function useCategory(id: string): Category | undefined {
  return useCategories().find((category) => category.id === id)
}

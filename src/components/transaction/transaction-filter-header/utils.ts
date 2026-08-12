import type { Category } from "~/types/categories"
import { type CategoryType, CategoryTypeEnum } from "~/types/categories"
import type { TransactionType } from "~/types/transactions"

export function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

/** Infer which category type to show first when panel opens, from current selection. */
export function inferInitialCategoryType(
  selectedIds: string[],
  categoriesByType: Record<TransactionType, Category[]>,
): CategoryType | null {
  if (selectedIds.length === 0) return null
  const selectedIdSet = new Set(selectedIds)
  const types: CategoryType[] = [
    CategoryTypeEnum.EXPENSE,
    CategoryTypeEnum.INCOME,
  ]
  for (const type of types) {
    const cats = categoriesByType[type] ?? []
    if (cats.some((c) => selectedIdSet.has(c.id))) return type
  }
  return null
}

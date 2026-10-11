import { count, sql } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Category, CategoryType } from "~/types/categories"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

import { drizzleDb } from "../db"
import { categories, transactions } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

/**
 * `withCounts` fills `transactionCount`. It defaults to off because the count
 * query re-runs on every transaction write; leave it off unless the screen
 * shows or checks the count (category list, edit/delete warnings). Without it
 * `transactionCount` is 0.
 */
export function useCategoriesQuery(
  withCounts = false,
): LiveReadModelResult<Category[]> {
  const categoriesResult = useLiveQuery(
    drizzleDb.select().from(categories).orderBy(categories.name),
  )
  const countsResult = useLiveQuery(
    drizzleDb
      .select({
        categoryId: transactions.categoryId,
        count: count(),
      })
      .from(transactions)
      .where(
        withCounts
          ? sql`${transactions.categoryId} IS NOT NULL AND ${transactions.isDeleted} = 0`
          : sql`1 = 0`,
      )
      .groupBy(transactions.categoryId),
    [withCounts],
  )
  const counts = new Map(
    countsResult.data.map((row) => [row.categoryId, row.count]),
  )

  const data = categoriesResult.data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type as CategoryType,
    icon: row.icon,
    colorSchemeName: row.colorSchemeName,
    colorScheme: getThemeStrict(row.colorSchemeName),
    transactionCount: counts.get(row.id) ?? 0,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  }))

  return createLiveReadModelResult(data, [categoriesResult, countsResult])
}

export function useCategories(): Category[] {
  return useCategoriesQuery().data
}

export function useCategoriesByType(type: string): Category[] {
  return useCategories().filter((category) => category.type === type)
}

/** Categories split by transaction type, from a single query. */
export function useCategoriesByTypeMap(): Record<TransactionType, Category[]> {
  const categories = useCategories()
  return {
    expense: categories.filter((c) => c.type === TransactionTypeEnum.EXPENSE),
    income: categories.filter((c) => c.type === TransactionTypeEnum.INCOME),
    transfer: categories.filter(
      (c) => (c.type as string) === TransactionTypeEnum.TRANSFER,
    ),
  }
}

export function useCategoriesByTypeQuery(
  type: string,
  withCounts = false,
): LiveReadModelResult<Category[]> {
  const result = useCategoriesQuery(withCounts)
  return {
    ...result,
    data: result.data.filter((category) => category.type === type),
  }
}

export function useCategory(
  id: string,
  withCounts = false,
): Category | undefined {
  return useCategoriesQuery(withCounts).data.find(
    (category) => category.id === id,
  )
}

import { count, sql } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Category } from "~/types/categories"
import type { TransactionType } from "~/types/transactions"

import { drizzleDb } from "../db"
import { categories, transactions } from "../schema"
import {
  createLiveReadModelResult,
  type LiveReadModelResult,
} from "./entity-read-model"

export function useCategoriesQuery(): LiveReadModelResult<Category[]> {
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
        sql`${transactions.categoryId} IS NOT NULL AND ${transactions.isDeleted} = 0`,
      )
      .groupBy(transactions.categoryId),
  )
  const counts = new Map(
    countsResult.data.map((row) => [row.categoryId, row.count]),
  )

  const data = categoriesResult.data.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type as TransactionType,
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

export function useCategory(id: string): Category | undefined {
  return useCategories().find((category) => category.id === id)
}

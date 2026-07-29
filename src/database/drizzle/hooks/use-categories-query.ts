import { count, sql } from "drizzle-orm"
import { useLiveQuery } from "drizzle-orm/expo-sqlite"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Category } from "~/types/categories"
import type { TransactionType } from "~/types/transactions"

import { drizzleDb } from "../db"
import { categories, transactions } from "../schema"

export function useCategoriesQuery(): {
  data: Category[]
  error: Error | undefined
  updatedAt: Date | undefined
} {
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

  return {
    data: categoriesResult.data.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type as TransactionType,
      icon: row.icon,
      colorSchemeName: row.colorSchemeName,
      colorScheme: getThemeStrict(row.colorSchemeName),
      transactionCount: counts.get(row.id) ?? 0,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })),
    error: categoriesResult.error ?? countsResult.error,
    updatedAt: categoriesResult.updatedAt ?? countsResult.updatedAt,
  }
}

import { count, sql } from "drizzle-orm"

import { drizzleDb } from "../db"
import { transactions } from "../schema"

/**
 * Live transactions per category, or no rows at all without `withCounts`.
 *
 * The unary + keeps the planner off the deleted-flag index: the category index
 * covers this query and returns it already grouped.
 */
export function categoryCountsQuery(withCounts: boolean) {
  return drizzleDb
    .select({
      categoryId: transactions.categoryId,
      count: count(),
    })
    .from(transactions)
    .where(
      withCounts
        ? sql`${transactions.categoryId} IS NOT NULL AND +${transactions.isDeleted} = 0`
        : sql`1 = 0`,
    )
    .groupBy(transactions.categoryId)
}

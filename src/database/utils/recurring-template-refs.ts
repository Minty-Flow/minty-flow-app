import { or, type SQL, sql } from "drizzle-orm"

import { recurringTransactions } from "~/database/drizzle/schema"
import type { DbTransaction } from "~/database/transaction"

/**
 * A recurring rule keeps its category and account inside a JSON template, so
 * the database cannot enforce those references. These helpers keep the
 * template valid when the row it points at is deleted.
 *
 * `json_valid` guards every read: a malformed template must not abort the
 * whole delete (the sync already tolerates one via `parseTemplate`).
 */
const templateField = (field: "categoryId" | "accountId"): SQL =>
  sql`CASE WHEN json_valid(${recurringTransactions.jsonTransactionTemplate})
    THEN json_extract(${recurringTransactions.jsonTransactionTemplate}, ${`$.${field}`})
  END`

/** Drop a deleted category from every recurring template that uses it. */
export function clearCategoryFromRecurringTemplates(
  db: DbTransaction,
  categoryId: string,
): void {
  db.update(recurringTransactions)
    .set({
      jsonTransactionTemplate: sql`json_set(${recurringTransactions.jsonTransactionTemplate}, '$.categoryId', NULL)`,
    })
    .where(sql`${templateField("categoryId")} = ${categoryId}`)
    .run()
}

/** Point every recurring template that uses `fromId` at `toId` instead. */
export function moveCategoryInRecurringTemplates(
  db: DbTransaction,
  fromId: string,
  toId: string,
): void {
  db.update(recurringTransactions)
    .set({
      jsonTransactionTemplate: sql`json_set(${recurringTransactions.jsonTransactionTemplate}, '$.categoryId', ${toId})`,
    })
    .where(sql`${templateField("categoryId")} = ${fromId}`)
    .run()
}

/** How many recurring rules have a template that uses `categoryId`. */
export function countRecurringTemplatesUsingCategory(
  db: Pick<DbTransaction, "select">,
  categoryId: string,
): number {
  return (
    db
      .select({ count: sql<number>`count(*)` })
      .from(recurringTransactions)
      .where(sql`${templateField("categoryId")} = ${categoryId}`)
      .get()?.count ?? 0
  )
}

/**
 * Disable every recurring rule that generates into, or transfers to, an
 * account that is about to be destroyed. Call it before the account row goes:
 * the transfer destination is set to NULL by a foreign key at that point, and
 * a transfer rule without a destination would generate plain expenses.
 */
export function disableRecurringRulesForAccount(
  db: DbTransaction,
  accountId: string,
): void {
  db.update(recurringTransactions)
    .set({ disabled: 1 })
    .where(
      or(
        sql`${templateField("accountId")} = ${accountId}`,
        sql`${recurringTransactions.transferToAccountId} = ${accountId}`,
      ),
    )
    .run()
}

import { type SQLWrapper, sql } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})
vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/use-live-query", () => ({ useLiveQuery: vi.fn() }))
vi.mock("~/styles/theme/registry", () => ({ getThemeStrict: () => null }))

import { drizzleDb } from "~/database/drizzle/db"
import { categoryCountsQuery } from "~/database/drizzle/read-models/category-counts-query"
import { repaidByLoanQuery } from "~/database/drizzle/read-models/loan-read-model"
import { buildTransactionQueries } from "~/database/drizzle/read-models/transaction-read-model"
import { accounts, categories, transactions } from "~/database/drizzle/schema"
import { latestRuleSlotQuery } from "~/database/services/recurring-transaction-service"

const now = "2026-01-01T00:00:00.000Z"

// Rows below point at rules that these queries never read.
drizzleDb.run(sql`PRAGMA foreign_keys=OFF`)

const planOf = (query: { getSQL(): ReturnType<SQLWrapper["getSQL"]> }) =>
  JSON.stringify(drizzleDb.all(sql`EXPLAIN QUERY PLAN ${query.getSQL()}`))

drizzleDb
  .insert(accounts)
  .values({
    id: "a",
    name: "a",
    type: "checking",
    balance: 0,
    currencyCode: "USD",
    createdAt: now,
    updatedAt: now,
  })
  .run()
drizzleDb
  .insert(categories)
  .values({
    id: "food",
    name: "food",
    type: "expense",
    createdAt: now,
    updatedAt: now,
  })
  .run()

const add = (
  id: string,
  day: number,
  more: Partial<typeof transactions.$inferInsert> = {},
) =>
  drizzleDb
    .insert(transactions)
    .values({
      id,
      accountId: "a",
      type: "expense",
      amount: 1,
      transactionDate: `2026-01-0${day}T00:00:00.000Z`,
      createdAt: now,
      updatedAt: now,
      ...more,
    })
    .run()

add("live", 1, { recurringId: "rule", categoryId: "food" })
add("trashed", 3, { recurringId: "rule", categoryId: "food", isDeleted: 1 })
add("moved", 2, {
  recurringId: "rule",
  extra: JSON.stringify({
    recurringInitialDate: Date.parse("2026-01-04T00:00:00.000Z"),
  }),
})
add("other-rule", 9, { recurringId: "other" })

describe("recurrence guard", () => {
  it("reads the rule's own instances", () => {
    expect(planOf(latestRuleSlotQuery("rule"))).toContain("idx_tx_recurring")
  })

  it("finds the latest slot among the rule's live instances", () => {
    expect(latestRuleSlotQuery("rule").get()?.max).toBe(
      Date.parse("2026-01-04T00:00:00.000Z"),
    )
  })
})

describe("category counts", () => {
  it("reads the category index", () => {
    expect(planOf(categoryCountsQuery(true))).toContain(
      "COVERING INDEX idx_tx_category_deleted",
    )
  })

  it("counts live categorised transactions", () => {
    expect(categoryCountsQuery(true).all()).toEqual([
      { categoryId: "food", count: 1 },
    ])
    expect(categoryCountsQuery(false).all()).toEqual([])
  })
})

describe("pending, loan and goal reads", () => {
  it.each([
    [{ isPending: true }, "idx_tx_pending_date"],
    [{ loanId: "loan" }, "idx_tx_loan_deleted_date"],
    [{ goalId: "goal" }, "idx_tx_goal_deleted_date"],
  ])("lists %o through its index", (filters, index) => {
    const plan = planOf(buildTransactionQueries(filters).rows)
    expect(plan).toContain(index)
    // The index also provides the order.
    expect(plan).not.toContain("TEMP B-TREE")
  })

  it("sums repayments over the loan-linked rows only", () => {
    expect(planOf(repaidByLoanQuery())).toContain("idx_tx_loan_deleted_date")
  })
})

import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import {
  budgetSpentQuery,
  budgetsSpentQuery,
} from "~/database/drizzle/read-models/budget-spend-query"
import {
  accounts,
  categories,
  transactions,
  transfers,
} from "~/database/drizzle/schema"
import type { Budget } from "~/types/budgets"

const now = "2026-03-01T00:00:00.000Z"
const march = new Date("2026-03-01T00:00:00.000Z")
const marchEnd = new Date("2026-03-31T23:59:59.999Z")
const year = new Date("2026-01-01T00:00:00.000Z")

for (const [id, currencyCode] of [
  ["in", "USD"],
  ["outside", "USD"],
  ["euro", "EUR"],
]) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 0,
      currencyCode,
      createdAt: now,
      updatedAt: now,
    })
    .run()
}
for (const id of ["food", "rent"]) {
  drizzleDb
    .insert(categories)
    .values({ id, name: id, type: "expense", createdAt: now, updatedAt: now })
    .run()
}

type Row = Partial<typeof transactions.$inferInsert> & {
  id: string
  amount: number
}

function add(row: Row) {
  drizzleDb
    .insert(transactions)
    .values({
      accountId: "in",
      categoryId: "food",
      type: "expense",
      transactionDate: "2026-03-10T00:00:00.000Z",
      createdAt: now,
      updatedAt: now,
      ...row,
    })
    .run()
}

// Counted. Each later row has its own power of two, so a wrong total names it.
add({ id: "plain", amount: 1_000_000 })
add({ id: "refund", amount: 100_000, subtype: "refund" })
add({ id: "rent", amount: 500_000, categoryId: "rent" })
add({
  id: "february",
  amount: 7_000_000,
  transactionDate: "2026-02-10T00:00:00.000Z",
})
// Never counted.
add({ id: "pending", amount: 1, isPending: 1 })
add({ id: "trashed", amount: 2, isDeleted: 1 })
add({ id: "income", amount: 4, type: "income" })
add({ id: "lent", amount: 8, kind: "lent" })
add({ id: "borrowed", amount: 16, kind: "borrowed" })
add({ id: "outside", amount: 32, accountId: "outside" })
add({ id: "euro", amount: 64, accountId: "euro" })
add({ id: "uncategorised", amount: 128, categoryId: null })
add({ id: "leg", amount: 256 })
add({ id: "other-leg", amount: 512, accountId: "outside", type: "income" })
drizzleDb
  .insert(transfers)
  .values({
    id: "t1",
    fromTransactionId: "leg",
    toTransactionId: "other-leg",
    fromAccountId: "in",
    toAccountId: "outside",
    createdAt: now,
    updatedAt: now,
  })
  .run()

function budget(id: string, categoryIds: string[]): Budget {
  return {
    id,
    currencyCode: "USD",
    accountIds: ["in", "euro"],
    categoryIds,
  } as Budget
}

describe("budget spending", () => {
  it("counts only the rows a budget covers", () => {
    expect(
      budgetSpentQuery(budget("a", ["food"]), march, marchEnd).get()?.total,
    ).toBe(900_000)
  })

  it("gives each budget in the shared query the budget card's figure", () => {
    const windows = [
      { key: "food", budget: budget("a", ["food"]), from: march },
      { key: "all", budget: budget("b", ["food", "rent"]), from: march },
      { key: "yearly", budget: budget("c", ["food"]), from: year },
      { key: "empty", budget: budget("d", []), from: march },
    ].map((window) => ({ ...window, to: marchEnd }))

    const together = budgetsSpentQuery(windows).get()

    expect(together).toEqual({
      food: 900_000,
      all: 1_400_000,
      yearly: 7_900_000,
      empty: 0,
    })
    for (const { key, budget: b, from, to } of windows) {
      expect(together?.[key]).toBe(budgetSpentQuery(b, from, to).get()?.total)
    }
  })
})

import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, budgets, categories } from "~/database/drizzle/schema"
import { createBudget } from "~/database/services/budget-service"

const now = "2026-01-01T00:00:00.000Z"

describe("createBudget, custom period bounds", () => {
  drizzleDb
    .insert(accounts)
    .values({
      id: "acc-1",
      name: "Wallet",
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
      id: "cat-1",
      name: "Food",
      type: "expense",
      createdAt: now,
      updatedAt: now,
    })
    .run()

  it("covers the whole first and last day", async () => {
    const start = new Date(2026, 2, 1, 14, 30)
    const end = new Date(2026, 2, 31, 9, 15)
    const id = await createBudget({
      name: "March",
      currencyCode: "USD",
      accountIds: ["acc-1"],
      amount: 10_000,
      period: "custom",
      startDate: start.getTime(),
      endDate: end.getTime(),
      categoryIds: ["cat-1"],
      isActive: true,
    })

    const row = drizzleDb.select().from(budgets).where(eq(budgets.id, id)).get()

    expect(row?.startDate).toBe(new Date(2026, 2, 1).toISOString())
    expect(row?.endDate).toBe(
      new Date(2026, 2, 31, 23, 59, 59, 999).toISOString(),
    )
  })
})

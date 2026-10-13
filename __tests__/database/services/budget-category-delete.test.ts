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
import {
  budgetCategories,
  budgets,
  categories,
} from "~/database/drizzle/schema"
import {
  deleteCategoryById,
  getBudgetsLosingLastCategory,
} from "~/database/services/category-service"

const created = "2026-01-01T00:00:00.000Z"

function seedCategory(id: string) {
  drizzleDb
    .insert(categories)
    .values({
      id,
      name: id,
      type: "expense",
      createdAt: created,
      updatedAt: created,
    })
    .run()
}

function seedBudget(id: string, categoryIds: string[], isActive: 0 | 1 = 1) {
  drizzleDb
    .insert(budgets)
    .values({
      id,
      name: id,
      amount: 10_000,
      currencyCode: "USD",
      period: "monthly",
      startDate: created,
      isActive,
      createdAt: created,
      updatedAt: created,
    })
    .run()
  for (const categoryId of categoryIds) {
    drizzleDb
      .insert(budgetCategories)
      .values({ budgetId: id, categoryId, createdAt: created })
      .run()
  }
}

const budgetRow = (id: string) =>
  drizzleDb.select().from(budgets).where(eq(budgets.id, id)).get()

const linkedCategories = (id: string) =>
  drizzleDb
    .select()
    .from(budgetCategories)
    .where(eq(budgetCategories.budgetId, id))
    .all()
    .map((row) => row.categoryId)

describe("deleting a category that a budget uses", () => {
  it("switches off a budget whose only category was deleted", async () => {
    seedCategory("only-food")
    seedBudget("only-budget", ["only-food"])

    await deleteCategoryById("only-food")

    expect(linkedCategories("only-budget")).toEqual([])
    expect(budgetRow("only-budget")?.isActive).toBe(0)
    expect(budgetRow("only-budget")?.updatedAt).not.toBe(created)
  })

  it("keeps a budget that still has another category active", async () => {
    seedCategory("shared-food")
    seedCategory("shared-rent")
    seedBudget("shared-budget", ["shared-food", "shared-rent"])

    await deleteCategoryById("shared-food")

    expect(linkedCategories("shared-budget")).toEqual(["shared-rent"])
    expect(budgetRow("shared-budget")?.isActive).toBe(1)
    expect(budgetRow("shared-budget")?.updatedAt).toBe(created)
  })

  it("leaves budgets that do not use the category alone", async () => {
    seedCategory("other-food")
    seedCategory("other-fun")
    seedBudget("other-budget", ["other-fun"])

    await deleteCategoryById("other-food")

    expect(linkedCategories("other-budget")).toEqual(["other-fun"])
    expect(budgetRow("other-budget")?.isActive).toBe(1)
  })

  it("keeps an already inactive budget inactive", async () => {
    seedCategory("off-food")
    seedBudget("off-budget", ["off-food"], 0)

    await deleteCategoryById("off-food")

    expect(budgetRow("off-budget")?.isActive).toBe(0)
  })
})

describe("getBudgetsLosingLastCategory", () => {
  it("lists active budgets whose only category it is, by name", async () => {
    seedCategory("warn-food")
    seedCategory("warn-rent")
    seedBudget("warn-b", ["warn-food"])
    seedBudget("warn-a", ["warn-food"])
    seedBudget("warn-shared", ["warn-food", "warn-rent"])
    seedBudget("warn-off", ["warn-food"], 0)
    seedBudget("warn-rent-only", ["warn-rent"])

    expect(await getBudgetsLosingLastCategory("warn-food")).toEqual([
      { id: "warn-a", name: "warn-a" },
      { id: "warn-b", name: "warn-b" },
    ])
  })

  it("is empty for a category no budget depends on", async () => {
    seedCategory("free-food")
    seedCategory("free-rent")
    seedBudget("free-budget", ["free-rent"])

    expect(await getBudgetsLosingLastCategory("free-food")).toEqual([])
  })

  it("changes nothing until the category is deleted", async () => {
    seedCategory("ask-food")
    seedBudget("ask-budget", ["ask-food"])

    await getBudgetsLosingLastCategory("ask-food")

    expect(budgetRow("ask-budget")?.isActive).toBe(1)
    expect(linkedCategories("ask-budget")).toEqual(["ask-food"])
  })

  it("names exactly the budgets that the delete then switches off", async () => {
    seedCategory("same-food")
    seedCategory("same-rent")
    seedBudget("same-only", ["same-food"])
    seedBudget("same-shared", ["same-food", "same-rent"])

    const warned = await getBudgetsLosingLastCategory("same-food")
    await deleteCategoryById("same-food")

    expect(warned.map((b) => b.id)).toEqual(["same-only"])
    expect(budgetRow("same-only")?.isActive).toBe(0)
    expect(budgetRow("same-shared")?.isActive).toBe(1)
  })
})

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
  accounts,
  budgets,
  categories,
  goals,
  tags,
} from "~/database/drizzle/schema"
import {
  createAccount,
  updateAccount,
} from "~/database/services/account-service"
import {
  createBudget,
  updateBudgetById,
} from "~/database/services/budget-service"
import {
  createCategory,
  updateCategoryById,
} from "~/database/services/category-service"
import { createGoal, updateGoalById } from "~/database/services/goal-service"
import { createTag, updateTagById } from "~/database/services/tag-service"
import { addBudgetSchema } from "~/schemas/budgets.schema"
import { addGoalSchema } from "~/schemas/goals.schema"

const now = "2026-01-01T00:00:00.000Z"

async function seedAccount(id: string) {
  return createAccount({
    name: id,
    type: "checking",
    balance: 0,
    currencyCode: "USD",
    icon: null,
    colorSchemeName: "mint",
    isPrimary: false,
    excludeFromBalance: false,
  })
}

describe("clearing a colour persists as null (forms send null)", () => {
  it("account", async () => {
    const id = await seedAccount("clr-acc")
    await updateAccount(id, {
      name: "clr-acc",
      type: "checking",
      currencyCode: "USD",
      icon: null,
      colorSchemeName: null,
      isPrimary: false,
      excludeFromBalance: false,
    })
    expect(
      drizzleDb
        .select({ c: accounts.colorSchemeName })
        .from(accounts)
        .where(eq(accounts.id, id))
        .get()?.c,
    ).toBeNull()
  })

  it("category", async () => {
    const id = await createCategory({
      name: "clr-cat",
      type: "expense",
      icon: null,
      colorSchemeName: "mint",
    })
    await updateCategoryById(id, {
      name: "clr-cat",
      icon: null,
      colorSchemeName: null,
    })
    expect(
      drizzleDb
        .select({ c: categories.colorSchemeName })
        .from(categories)
        .where(eq(categories.id, id))
        .get()?.c,
    ).toBeNull()
  })

  it("goal", async () => {
    const accId = await seedAccount("clr-goal-acc")
    const base = {
      goalType: "savings" as const,
      name: "clr-goal",
      description: null,
      icon: null,
      currencyCode: "USD",
      accountIds: [accId],
      targetAmount: 100,
      targetDate: null,
      colorSchemeName: "mint",
    }
    const id = await createGoal(addGoalSchema.parse(base))
    await updateGoalById(
      id,
      addGoalSchema.parse({ ...base, colorSchemeName: null }),
    )
    expect(
      drizzleDb
        .select({ c: goals.colorSchemeName })
        .from(goals)
        .where(eq(goals.id, id))
        .get()?.c,
    ).toBeNull()
  })

  it("budget", async () => {
    const accId = await seedAccount("clr-budget-acc")
    const catId = await createCategory({
      name: "clr-budget-cat",
      type: "expense",
      icon: null,
      colorSchemeName: null,
    })
    const base = {
      name: "clr-budget",
      icon: null,
      currencyCode: "USD",
      accountIds: [accId],
      amount: 100,
      period: "monthly" as const,
      startDate: Date.now(),
      endDate: null,
      categoryIds: [catId],
      alertThreshold: null,
      isActive: true,
      colorSchemeName: "mint",
    }
    const id = await createBudget(addBudgetSchema.parse(base))
    await updateBudgetById(
      id,
      addBudgetSchema.parse({ ...base, colorSchemeName: null }),
    )
    expect(
      drizzleDb
        .select({ c: budgets.colorSchemeName })
        .from(budgets)
        .where(eq(budgets.id, id))
        .get()?.c,
    ).toBeNull()
  })

  it("tag", async () => {
    const id = await createTag({
      name: "clr-tag",
      type: "generic",
      icon: null,
      colorSchemeName: "mint",
    })
    await updateTagById(id, {
      name: "clr-tag",
      icon: null,
      colorSchemeName: null,
    })
    expect(
      drizzleDb
        .select({ c: tags.colorSchemeName })
        .from(tags)
        .where(eq(tags.id, id))
        .get()?.c,
    ).toBeNull()
  })
})

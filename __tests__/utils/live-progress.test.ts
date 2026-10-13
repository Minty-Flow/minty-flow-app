import { describe, expect, it } from "vitest"

import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type { Budget } from "~/types/budgets"
import {
  getLiveBudgetSpent,
  getLiveBudgetSpentByCategory,
} from "~/utils/live-progress"

const date = new Date(2026, 0, 10)

function budget(categoryIds: string[]): Budget {
  return {
    id: "budget-1",
    name: "Food",
    amount: 10_000,
    currencyCode: "USD",
    period: "monthly",
    startDate: date,
    endDate: null,
    alertThreshold: null,
    isActive: true,
    icon: null,
    colorSchemeName: null,
    colorScheme: null,
    accountIds: ["acc-1"],
    categoryIds,
    createdAt: date,
    updatedAt: date,
  } as Budget
}

function expense(
  id: string,
  categoryId: string | null,
  amount: number,
): TransactionWithRelations {
  return {
    id,
    type: "expense",
    amount,
    categoryId,
    isPending: false,
    isTransfer: false,
    subtype: null,
    account: { currencyCode: "USD" },
  } as unknown as TransactionWithRelations
}

const spending = [
  expense("t1", "food", 1_000),
  expense("t2", "rent", 5_000),
  expense("t3", null, 700),
]

describe("getLiveBudgetSpent", () => {
  it("counts only the budget's categories", () => {
    expect(getLiveBudgetSpent(budget(["food"]), spending)).toBe(1_000)
    expect(getLiveBudgetSpent(budget(["food", "rent"]), spending)).toBe(6_000)
  })

  it("counts nothing for a budget with no categories", () => {
    expect(getLiveBudgetSpent(budget([]), spending)).toBe(0)
  })
})

describe("getLiveBudgetSpentByCategory", () => {
  it("returns nothing for a budget with no categories", () => {
    expect(getLiveBudgetSpentByCategory(budget([]), spending)).toEqual({})
  })
})

import { describe, expect, it } from "vitest"

import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import type { Budget } from "~/types/budgets"
import type { Goal } from "~/types/goals"
import {
  getLiveBudgetSpent,
  getLiveBudgetSpentByCategory,
  getLiveGoalProgress,
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

describe("loans in budgets", () => {
  it("does not count lending as spending", () => {
    const lent = {
      ...expense("loan-1", "food", 4_000),
      loanId: "loan-a",
    } as TransactionWithRelations
    expect(getLiveBudgetSpent(budget(["food"]), [lent, ...spending])).toBe(
      1_000,
    )
  })
})

describe("getLiveGoalProgress", () => {
  const goal = (goalType: "expense" | "income") =>
    ({ id: "g1", goalType, currencyCode: "USD" }) as Goal
  const entry = (
    type: "expense" | "income",
    amount: number,
    subtype: string | null = null,
  ) =>
    ({
      ...expense("e", null, amount),
      type,
      subtype,
    }) as unknown as TransactionWithRelations

  it("subtracts refunds from an expense goal", () => {
    expect(
      getLiveGoalProgress(goal("expense"), [
        entry("expense", 5_000),
        entry("expense", 1_500, "refund"),
      ]),
    ).toBe(3_500)
  })

  it("adds up an income goal", () => {
    expect(
      getLiveGoalProgress(goal("income"), [
        entry("income", 2_000),
        entry("income", 500),
      ]),
    ).toBe(2_500)
  })
})

import { describe, expect, it } from "vitest"

import { addBudgetSchema } from "~/schemas/budgets.schema"

const emptyForm = {
  name: "",
  currencyCode: "",
  accountIds: [],
  amount: 0,
  period: "monthly",
  startDate: new Date(2026, 0, 1).getTime(),
  categoryIds: [],
  isActive: true,
}

function issuesByField(input: unknown): Record<string, string> {
  const result = addBudgetSchema.safeParse(input)
  if (result.success) return {}
  return Object.fromEntries(
    result.error.issues.map((issue) => [issue.path.join("."), issue.message]),
  )
}

describe("addBudgetSchema on an empty form", () => {
  // The budget form shows one message under each of these fields.
  it("reports every required field, each with its own message", () => {
    expect(issuesByField(emptyForm)).toEqual({
      name: "validation.required.name",
      currencyCode: "validation.required.currency",
      accountIds: "validation.required.accounts",
      amount: "validation.amount.positive",
      categoryIds: "validation.required.categories",
    })
  })

  it("stops reporting a field once it is filled in", () => {
    expect(
      issuesByField({
        ...emptyForm,
        name: "Food",
        currencyCode: "USD",
        accountIds: ["acc-1"],
        amount: 60_000,
        categoryIds: ["cat-1"],
      }),
    ).toEqual({})
  })
})

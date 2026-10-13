import { describe, expect, it } from "vitest"

import {
  addAccountsSchema,
  editAccountsSchema,
} from "~/schemas/accounts.schema"

const account = (balance: number) => ({
  name: "Credit card",
  type: "credit",
  balance,
  currencyCode: "USD",
})

describe("account schemas", () => {
  it("creating an account rejects a negative opening balance", () => {
    const result = addAccountsSchema.safeParse(account(-50_000))
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      "validation.initialBalance.negative",
    )
  })

  it("creating an account accepts zero and a positive balance", () => {
    expect(addAccountsSchema.safeParse(account(0)).success).toBe(true)
    expect(addAccountsSchema.safeParse(account(1_000)).success).toBe(true)
  })

  it("editing an account accepts a negative balance", () => {
    expect(editAccountsSchema.safeParse(account(-50_000)).success).toBe(true)
  })

  it("editing an account still rejects a balance that is not a whole number", () => {
    expect(editAccountsSchema.safeParse(account(10.5)).success).toBe(false)
  })

  it("editing an account still requires a name", () => {
    expect(
      editAccountsSchema.safeParse({ ...account(0), name: "  " }).success,
    ).toBe(false)
  })
})

import { describe, expect, it } from "vitest"

import { withPrimaryAccount } from "~/components/transaction/transaction-form/form-utils"

const accounts = [
  { id: "cash", isPrimary: false },
  { id: "bank", isPrimary: true },
]

describe("withPrimaryAccount", () => {
  it("starts a new transaction on the primary account", () => {
    expect(withPrimaryAccount(undefined, accounts)).toEqual({
      accountId: "bank",
    })
    expect(withPrimaryAccount({ categoryId: "food" }, accounts)).toEqual({
      categoryId: "food",
      accountId: "bank",
    })
  })

  it("keeps an account the caller already chose", () => {
    expect(withPrimaryAccount({ accountId: "cash" }, accounts)).toEqual({
      accountId: "cash",
    })
  })

  it("leaves the account empty when none is primary", () => {
    expect(withPrimaryAccount(undefined, [accounts[0]])).toBeUndefined()
  })
})

import { describe, expect, it } from "vitest"

import { buildAccountUpdate } from "~/components/accounts/account-modify/account-update-payload"

const form = {
  name: "Wallet",
  type: "checking" as const,
  balance: 10_000,
  currencyCode: "USD",
  icon: "wallet-outline",
  colorSchemeName: null,
  isPrimary: false,
  excludeFromBalance: false,
}

describe("buildAccountUpdate", () => {
  it("leaves the balance out when the user did not edit it", () => {
    const update = buildAccountUpdate(form, { balanceEdited: false })
    expect("balance" in update).toBe(false)
    expect(update.name).toBe("Wallet")
    expect(update.isPrimary).toBe(false)
  })

  it("sends the balance when the user edited it", () => {
    const update = buildAccountUpdate(form, { balanceEdited: true })
    expect(update.balance).toBe(10_000)
  })

  it("keeps every other field either way", () => {
    for (const balanceEdited of [true, false]) {
      const update = buildAccountUpdate(form, { balanceEdited })
      expect(update).toMatchObject({
        name: "Wallet",
        type: "checking",
        currencyCode: "USD",
        icon: "wallet-outline",
        colorSchemeName: null,
        excludeFromBalance: false,
      })
    }
  })
})

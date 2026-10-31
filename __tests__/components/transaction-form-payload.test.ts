import { describe, expect, it } from "vitest"

import { buildTransactionPayload } from "~/components/transaction/transaction-form/use-transaction-form.submit"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import type { TransactionKind } from "~/types/transactions"

const ctx = {
  isNew: false,
  transaction: null,
  selectedAccount: undefined,
  usdCode: "USD",
  attachmentsJson: null,
  effectiveDate: new Date(2026, 2, 1),
  recurringEnabled: false,
}

const formValues = (
  kind: TransactionKind,
  isPending: boolean,
): TransactionFormValues =>
  ({
    amount: 1_000,
    type: "expense",
    transactionDate: new Date(2026, 2, 1),
    accountId: "acc-1",
    title: "x",
    tags: [],
    kind,
    isPending,
  }) as TransactionFormValues

describe("buildTransactionPayload kind and pending", () => {
  it("turns an upcoming row into a plain one when Pending is off", () => {
    const payload = buildTransactionPayload(formValues("upcoming", false), ctx)
    expect(payload.kind).toBe("default")
    expect(payload.isPending).toBe(false)
  })

  it("keeps an upcoming row pending while the switch is on", () => {
    const payload = buildTransactionPayload(formValues("upcoming", true), ctx)
    expect(payload.kind).toBe("upcoming")
    expect(payload.isPending).toBe(true)
  })

  it("moves a pending default row to upcoming", () => {
    const payload = buildTransactionPayload(formValues("default", true), ctx)
    expect(payload.kind).toBe("upcoming")
    expect(payload.isPending).toBe(true)
  })
})

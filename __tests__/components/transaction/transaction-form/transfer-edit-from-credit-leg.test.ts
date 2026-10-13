import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})
// The read model imports a live-query hook that needs expo-sqlite.
vi.mock("drizzle-orm/expo-sqlite", () => ({ useLiveQuery: () => ({}) }))
vi.mock("~/styles/theme/registry", () => ({ getThemeStrict: () => null }))

import { getDefaultValues } from "~/components/transaction/transaction-form/form-utils"
import { drizzleDb } from "~/database/drizzle/db"
import {
  getPendingTransactions,
  type TransactionWithRelations,
} from "~/database/drizzle/read-models/transaction-read-model"
import {
  accounts,
  recurringTransactions,
  transactions,
  transfers,
} from "~/database/drizzle/schema"
import {
  createTransfer,
  editTransfer,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string, currencyCode: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 100_000,
      currencyCode,
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const balanceOf = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()?.balance

const amountOf = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()
    ?.amount

/** What the form submits for a title-only edit of the transfer it opened. */
function titleOnlyEdit(leg: TransactionWithRelations, rate: number) {
  const values = getDefaultValues(leg, [], "transfer")
  return {
    fromAccountId: values.accountId,
    toAccountId: values.toAccountId,
    amount: values.amount,
    conversionRate: rate,
    transactionDate: values.transactionDate,
    title: "renamed",
  }
}

describe("editing a transfer from its credit leg", () => {
  // Pending rows are hydrated by the real read model; pending also keeps the
  // balances out of the way, so the legs' amounts are what the test reads.
  async function pendingCrossCurrencyTransfer(from: string, to: string) {
    seedAccount(from, "USD")
    seedAccount(to, "EUR")
    drizzleDb
      .insert(recurringTransactions)
      .values({
        id: `rule-${from}`,
        jsonTransactionTemplate: "{}",
        range: "{}",
        rules: "[]",
        createdAt: now,
      })
      .run()
    await createTransfer(
      {
        fromAccountId: from,
        toAccountId: to,
        amount: 10_000,
        conversionRate: 0.9,
        transactionDate: new Date(Date.now() + 86_400_000),
      },
      { recurringId: `rule-${from}`, isPending: true, kind: "repetitive" },
    )
    const legs = (await getPendingTransactions()).filter(
      (t) => t.accountId === from || t.accountId === to,
    )
    return {
      debit: legs.find((t) => t.accountId === from) as TransactionWithRelations,
      credit: legs.find((t) => t.accountId === to) as TransactionWithRelations,
    }
  }

  it("hydrates the debit amount on both legs", async () => {
    const { debit, credit } = await pendingCrossCurrencyTransfer("a1", "b1")
    expect(debit.transferSourceAmount).toBe(10_000)
    expect(credit.transferSourceAmount).toBe(10_000)
    expect(credit.amount).toBe(9_000)
  })

  it("defaults the form to the debit amount whichever leg is opened", async () => {
    const { debit, credit } = await pendingCrossCurrencyTransfer("a2", "b2")
    const fromDebit = getDefaultValues(debit, [], "transfer")
    const fromCredit = getDefaultValues(credit, [], "transfer")
    expect(fromCredit.amount).toBe(10_000)
    expect(fromCredit.amount).toBe(fromDebit.amount)
    expect(fromCredit.accountId).toBe("a2")
    expect(fromCredit.toAccountId).toBe("b2")
  })

  it("leaves both legs unchanged on a title-only edit from the credit leg", async () => {
    const { debit, credit } = await pendingCrossCurrencyTransfer("a3", "b3")
    await editTransfer(credit.id, titleOnlyEdit(credit, 0.9))
    expect(amountOf(debit.id)).toBe(-10_000)
    expect(amountOf(credit.id)).toBe(9_000)
    const row = drizzleDb
      .select()
      .from(transactions)
      .where(eq(transactions.id, credit.id))
      .get()
    expect(row?.title).toBe("renamed")
  })

  it("matches what a title-only edit from the debit leg does", async () => {
    const { debit } = await pendingCrossCurrencyTransfer("a4", "b4")
    await editTransfer(debit.id, titleOnlyEdit(debit, 0.9))
    expect(amountOf(debit.id)).toBe(-10_000)
  })

  it("changes the same amounts when the amount is edited from either leg", async () => {
    const one = await pendingCrossCurrencyTransfer("a5", "b5")
    const two = await pendingCrossCurrencyTransfer("a6", "b6")
    const edit = (leg: TransactionWithRelations) => ({
      ...titleOnlyEdit(leg, 0.9),
      amount: 20_000,
    })
    await editTransfer(one.debit.id, edit(one.debit))
    await editTransfer(two.credit.id, edit(two.credit))
    expect(amountOf(one.debit.id)).toBe(-20_000)
    expect(amountOf(one.credit.id)).toBe(18_000)
    expect(amountOf(two.debit.id)).toBe(-20_000)
    expect(amountOf(two.credit.id)).toBe(18_000)
  })
})

describe("a confirmed transfer edited from its credit leg", () => {
  it("keeps both balances", async () => {
    seedAccount("a7", "USD")
    seedAccount("b7", "EUR")
    await createTransfer({
      fromAccountId: "a7",
      toAccountId: "b7",
      amount: 10_000,
      conversionRate: 0.9,
    })
    const link = drizzleDb
      .select()
      .from(transfers)
      .where(eq(transfers.fromAccountId, "a7"))
      .get()
    const creditRow = drizzleDb
      .select()
      .from(transactions)
      .where(eq(transactions.id, link?.toTransactionId as string))
      .get()
    const usdBefore = balanceOf("a7")
    const eurBefore = balanceOf("b7")
    // The credit leg, in the shape the form receives from the read model.
    const credit = {
      ...creditRow,
      transactionDate: new Date(creditRow?.transactionDate as string),
      isTransfer: true,
      transferId: link?.fromTransactionId,
      relatedAccountId: link?.fromAccountId,
      transferSourceAmount: 10_000,
      categoryId: null,
      description: null,
      isPending: false,
      goalId: null,
      budgetId: null,
      loanId: null,
      location: null,
      subtype: null,
      kind: "default",
    } as unknown as TransactionWithRelations
    await editTransfer(credit.id, titleOnlyEdit(credit, 0.9))
    expect(balanceOf("a7")).toBe(usdBefore)
    expect(balanceOf("b7")).toBe(eurBefore)
  })
})

describe("form defaults for a same-currency transfer and for other rows", () => {
  const base = {
    type: "transfer",
    isTransfer: true,
    transferId: "other",
    accountId: "b",
    relatedAccountId: "a",
    transactionDate: new Date(2026, 0, 5),
    categoryId: null,
    title: "t",
    description: null,
    isPending: false,
    goalId: null,
    budgetId: null,
    loanId: null,
    location: null,
    subtype: null,
    kind: "default",
  }

  it("same-currency credit leg keeps the shared amount", () => {
    const credit = {
      ...base,
      amount: 5_000,
      transferSourceAmount: 5_000,
    } as unknown as TransactionWithRelations
    expect(getDefaultValues(credit, [], "transfer").amount).toBe(5_000)
  })

  it("falls back to the leg's own amount when the debit amount is unknown", () => {
    const debit = {
      ...base,
      accountId: "a",
      relatedAccountId: "b",
      amount: -5_000,
      transferSourceAmount: null,
    } as unknown as TransactionWithRelations
    expect(getDefaultValues(debit, [], "transfer").amount).toBe(5_000)
  })

  it("does not touch the amount of an ordinary transaction", () => {
    const expense = {
      ...base,
      type: "expense",
      isTransfer: false,
      transferId: null,
      relatedAccountId: null,
      amount: 1_234,
      transferSourceAmount: null,
    } as unknown as TransactionWithRelations
    expect(getDefaultValues(expense, [], "expense").amount).toBe(1_234)
  })
})

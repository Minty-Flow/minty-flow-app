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
import { accounts, transactions, transfers } from "~/database/drizzle/schema"
import {
  createTransfer,
  editTransfer,
  updateTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string, balance = 10_000) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}
const balanceOf = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()?.balance

const rowOf = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()

async function transfer(from: string, to: string) {
  seedAccount(from)
  seedAccount(to)
  await createTransfer({ fromAccountId: from, toAccountId: to, amount: 1_000 })
  const link = drizzleDb
    .select()
    .from(transfers)
    .where(eq(transfers.fromAccountId, from))
    .get()
  return {
    debitId: link?.fromTransactionId as string,
    creditId: link?.toTransactionId as string,
  }
}

describe("editTransfer validation", () => {
  it("refuses an amount of 0 and changes nothing", async () => {
    const { debitId, creditId } = await transfer("v-a", "v-b")
    await expect(editTransfer(debitId, { amount: 0 })).rejects.toThrow(
      /positive/,
    )
    expect(rowOf(debitId)?.amount).toBe(-1_000)
    expect(rowOf(creditId)?.amount).toBe(1_000)
    expect(balanceOf("v-a")).toBe(9_000)
    expect(balanceOf("v-b")).toBe(11_000)
  })

  it("refuses a negative amount", async () => {
    const { creditId } = await transfer("v-c", "v-d")
    await expect(editTransfer(creditId, { amount: -5 })).rejects.toThrow(
      /positive/,
    )
  })

  it("refuses the same account on both sides", async () => {
    const { debitId } = await transfer("v-e", "v-f")
    await expect(editTransfer(debitId, { toAccountId: "v-e" })).rejects.toThrow(
      /same account/,
    )
    await expect(
      editTransfer(debitId, { fromAccountId: "v-f" }),
    ).rejects.toThrow(/same account/)
  })

  it("keeps a transfer editable from either leg, repeatedly", async () => {
    const { debitId, creditId } = await transfer("v-g", "v-h")
    await editTransfer(creditId, { amount: 2_000 })
    await editTransfer(debitId, { amount: 500 })
    await editTransfer(creditId, { title: "renamed" })
    expect(rowOf(debitId)?.amount).toBe(-500)
    expect(rowOf(creditId)?.amount).toBe(500)
    expect(balanceOf("v-g")).toBe(9_500)
    expect(balanceOf("v-h")).toBe(10_500)
  })

  it("finds the legs from the transfers row when a stored amount is 0", async () => {
    const { debitId, creditId } = await transfer("v-i", "v-j")
    // The state the unguarded service used to leave behind.
    drizzleDb
      .update(transactions)
      .set({ amount: 0 })
      .where(eq(transactions.id, debitId))
      .run()
    drizzleDb
      .update(transactions)
      .set({ amount: 0 })
      .where(eq(transactions.id, creditId))
      .run()
    drizzleDb
      .update(accounts)
      .set({ balance: 10_000 })
      .where(eq(accounts.id, "v-i"))
      .run()
    drizzleDb
      .update(accounts)
      .set({ balance: 10_000 })
      .where(eq(accounts.id, "v-j"))
      .run()
    await editTransfer(creditId, { amount: 300 })
    expect(rowOf(debitId)?.amount).toBe(-300)
    expect(rowOf(creditId)?.amount).toBe(300)
    expect(balanceOf("v-i")).toBe(9_700)
    expect(balanceOf("v-j")).toBe(10_300)
  })

  it("credits the full amount when a cross-currency transfer is edited to same currency", async () => {
    seedAccount("v-usd-a", 100_000)
    drizzleDb
      .insert(accounts)
      .values({
        id: "v-eur-b",
        name: "v-eur-b",
        type: "checking",
        balance: 0,
        currencyCode: "EUR",
        createdAt: now,
        updatedAt: now,
      })
      .run()
    seedAccount("v-usd-c", 0)
    await createTransfer({
      fromAccountId: "v-usd-a",
      toAccountId: "v-eur-b",
      amount: 10_000,
      conversionRate: 0.9,
    })
    const link = drizzleDb
      .select()
      .from(transfers)
      .where(eq(transfers.fromAccountId, "v-usd-a"))
      .get()
    expect(link?.conversionRate).toBe(0.9)
    expect(rowOf(link?.toTransactionId as string)?.amount).toBe(9_000)
    await editTransfer(link?.fromTransactionId as string, {
      fromAccountId: "v-usd-a",
      toAccountId: "v-usd-c",
      amount: 10_000,
    })
    expect(rowOf(link?.toTransactionId as string)?.amount).toBe(10_000)
    expect(balanceOf("v-usd-c")).toBe(10_000)
  })

  it("refuses to turn a transfer leg into a plain expense", async () => {
    const { debitId, creditId } = await transfer("v-x", "v-y")
    await expect(
      updateTransaction(creditId, {
        type: "expense",
        amount: 1_000,
        categoryId: null,
        accountId: "v-y",
        title: "t",
      }),
    ).rejects.toThrow(/transfer/)
    expect(rowOf(debitId)?.type).toBe("transfer")
    expect(rowOf(creditId)?.type).toBe("transfer")
  })
})

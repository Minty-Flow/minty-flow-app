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

import { isFormReadOnly } from "~/components/transaction/transaction-form/form-utils"
import { drizzleDb } from "~/database/drizzle/db"
import { getPendingTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { accounts, transactions, transfers } from "~/database/drizzle/schema"
import {
  confirmTransaction,
  confirmTransactions,
  createTransaction,
  createTransfer,
  deleteTransaction,
  deleteTransfer,
  editTransfer,
  restoreTransaction,
  updateTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string, balance = 10_000, currencyCode = "USD") {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance,
      currencyCode,
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const balanceOf = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()?.balance

const rowOf = (id: string) =>
  drizzleDb.select().from(transactions).where(eq(transactions.id, id)).get()

const tomorrow = () => new Date(Date.now() + 86_400_000)

const expense = (
  accountId: string,
  amount: number,
  extra: Record<string, unknown> = {},
) =>
  ({
    amount,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId,
    title: "x",
    tags: [],
    isPending: false,
    kind: "default",
    ...extra,
  }) as Parameters<typeof createTransaction>[0]

describe("a trashed pending transaction", () => {
  async function trashedUpcoming(account: string) {
    seedAccount(account)
    const id = await createTransaction(
      expense(account, 1_000, {
        isPending: true,
        kind: "upcoming",
        transactionDate: tomorrow(),
      }),
    )
    await deleteTransaction(id)
    return id
  }

  it("is not confirmed, and the balance stays put", async () => {
    const id = await trashedUpcoming("confirm-1")
    await confirmTransaction(id, { updateTransactionDate: false })
    expect(balanceOf("confirm-1")).toBe(10_000)
    expect(rowOf(id)?.isPending).toBe(1)
  })

  it("is skipped by a batch confirm", async () => {
    const id = await trashedUpcoming("confirm-2")
    await confirmTransactions([id], { updateTransactionDate: false })
    expect(balanceOf("confirm-2")).toBe(10_000)
  })

  it("is not on the list auto-confirm reads", async () => {
    const id = await trashedUpcoming("confirm-3")
    const pending = await getPendingTransactions()
    expect(pending.map((t) => t.id)).not.toContain(id)
  })
})

describe("a trashed confirmed transaction", () => {
  async function trashedExpense(account: string) {
    seedAccount(account)
    const id = await createTransaction(expense(account, 1_000))
    await deleteTransaction(id)
    return id
  }

  it("is not put on hold", async () => {
    const id = await trashedExpense("hold-1")
    const before = balanceOf("hold-1")
    await confirmTransaction(id, {
      updateTransactionDate: false,
      confirm: false,
    })
    expect(balanceOf("hold-1")).toBe(before)
    expect(rowOf(id)?.isPending).toBe(0)
  })

  it("refuses an update and keeps the balance and the row", async () => {
    const id = await trashedExpense("update-1")
    const before = balanceOf("update-1")
    await expect(updateTransaction(id, { amount: 2_000 })).rejects.toThrow(
      /trash/,
    )
    expect(balanceOf("update-1")).toBe(before)
    expect(rowOf(id)?.amount).toBe(1_000)
  })

  it("restores with the original amount applied exactly once", async () => {
    seedAccount("restore-1")
    const id = await createTransaction(expense("restore-1", 1_000))
    expect(balanceOf("restore-1")).toBe(9_000)
    await deleteTransaction(id)
    expect(balanceOf("restore-1")).toBe(10_000)
    await expect(updateTransaction(id, { amount: 2_000 })).rejects.toThrow()
    await restoreTransaction(id)
    expect(balanceOf("restore-1")).toBe(9_000)
  })
})

describe("a trashed transfer", () => {
  async function trashedTransfer(from: string, to: string) {
    seedAccount(from, 10_000, "USD")
    seedAccount(to, 10_000, "EUR")
    await createTransfer({
      fromAccountId: from,
      toAccountId: to,
      amount: 1_000,
      conversionRate: 0.9,
    })
    const link = drizzleDb
      .select()
      .from(transfers)
      .where(eq(transfers.fromAccountId, from))
      .get()
    const debitId = link?.fromTransactionId as string
    const creditId = link?.toTransactionId as string
    await deleteTransfer(debitId)
    return { debitId, creditId }
  }

  it("refuses an edit from either leg and changes nothing", async () => {
    const { debitId, creditId } = await trashedTransfer("tr-a", "tr-b")
    const usd = balanceOf("tr-a")
    const eur = balanceOf("tr-b")
    for (const leg of [debitId, creditId]) {
      await expect(
        editTransfer(leg, { amount: 5_000, title: "renamed" }),
      ).rejects.toThrow(/trash/)
    }
    expect(balanceOf("tr-a")).toBe(usd)
    expect(balanceOf("tr-b")).toBe(eur)
    expect(rowOf(debitId)?.amount).toBe(-1_000)
    expect(rowOf(creditId)?.amount).toBe(900)
  })

  it("restores both balances exactly once after refused edits", async () => {
    const { debitId } = await trashedTransfer("tr-c", "tr-d")
    await expect(editTransfer(debitId, { amount: 5_000 })).rejects.toThrow()
    await restoreTransaction(debitId)
    expect(balanceOf("tr-c")).toBe(9_000)
    expect(balanceOf("tr-d")).toBe(10_900)
  })
})

describe("live transactions are unaffected", () => {
  it("still confirm, update and edit as before", async () => {
    seedAccount("live-1")
    const upcoming = await createTransaction(
      expense("live-1", 1_000, {
        isPending: true,
        kind: "upcoming",
        transactionDate: tomorrow(),
      }),
    )
    await confirmTransaction(upcoming, { updateTransactionDate: false })
    expect(balanceOf("live-1")).toBe(9_000)
    await updateTransaction(upcoming, { amount: 2_000 })
    expect(balanceOf("live-1")).toBe(8_000)
  })
})

describe("isFormReadOnly", () => {
  it("is true only for a trashed transaction", () => {
    expect(isFormReadOnly({ isDeleted: true })).toBe(true)
    expect(isFormReadOnly({ isDeleted: false })).toBe(false)
    expect(isFormReadOnly(null)).toBe(false)
  })
})

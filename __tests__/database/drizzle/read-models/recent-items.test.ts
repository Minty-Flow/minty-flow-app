import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})
vi.mock("drizzle-orm/expo-sqlite", () => ({ useLiveQuery: () => ({}) }))
vi.mock("~/styles/theme/registry", () => ({ getThemeStrict: () => null }))

import { drizzleDb } from "~/database/drizzle/db"
import { getRecentItems } from "~/database/drizzle/read-models/transaction-item-read-model"
import { accounts } from "~/database/drizzle/schema"
import {
  createTransaction,
  deleteTransaction,
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

const buy = (
  accountId: string,
  day: number,
  items: { name: string; unitPrice: number }[],
) =>
  createTransaction({
    amount: 100,
    type: "expense",
    transactionDate: new Date(2026, 0, day),
    accountId,
    title: "Shop",
    tags: [],
    isPending: false,
    kind: "default",
    items: items.map((item) => ({ ...item, quantity: 1 })),
  } as Parameters<typeof createTransaction>[0])

describe("getRecentItems", () => {
  it("keeps one per name, newest spelling and price first, in the currency only", async () => {
    seedAccount("usd", "USD")
    seedAccount("syp", "SYP")
    await buy("usd", 1, [
      { name: "milk", unitPrice: 120 },
      { name: "Bread", unitPrice: 80 },
    ])
    await buy("usd", 3, [{ name: " Milk ", unitPrice: 150 }])
    await buy("syp", 4, [{ name: "Tea", unitPrice: 5000 }])
    const trashed = await buy("usd", 5, [{ name: "Nuts", unitPrice: 100 }])
    await deleteTransaction(trashed)

    expect(getRecentItems("USD")).toEqual([
      { name: " Milk ", unitPrice: 150 },
      { name: "Bread", unitPrice: 80 },
    ])
    expect(getRecentItems("SYP")).toEqual([{ name: "Tea", unitPrice: 5000 }])
    expect(getRecentItems("EUR")).toEqual([])
  })
})

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

// importBackup snapshots the database first; keep that snapshot in memory so
// it doubles as the export half of a round trip.
const file = vi.hoisted(() => ({ snapshot: null as unknown }))
vi.mock("~/database/utils/import-snapshot", () => ({
  writeSqliteSnapshot: async (data: unknown) => {
    file.snapshot = JSON.parse(JSON.stringify(data))
  },
  readSqliteSnapshot: async () => file.snapshot,
  deleteSqliteSnapshot: async () => {},
}))
vi.mock("~/stores/portable-settings", () => ({
  readPortableSettings: () => ({}),
  readBackupProfile: () => null,
  profileImageForExport: () => null,
}))
vi.mock("expo-crypto", () => ({ randomUUID: () => "uuid" }))
vi.mock("expo-document-picker", () => ({}))
vi.mock("expo-file-system", () => ({
  Directory: class {},
  File: class {},
  Paths: {},
}))
vi.mock("expo-file-system/legacy", () => ({
  documentDirectory: "/",
  EncodingType: { UTF8: "utf8" },
}))
vi.mock("react-native", () => ({ Platform: { OS: "android" }, Share: {} }))
vi.mock("react-native-zip-archive", () => ({ unzip: vi.fn(), zip: vi.fn() }))

import {
  type MintyFlowBackup,
  SCHEMA_VERSION,
  validateBackup,
} from "~/database/backup/backup-format"
import { drizzleDb } from "~/database/drizzle/db"
import { getTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { accounts, transactionItems } from "~/database/drizzle/schema"
import { importBackup } from "~/database/services/data-management-service"
import {
  createTransaction,
  destroyTransaction,
  updateTransaction,
} from "~/database/services/ledger-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 10_000,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const groceries = [
  { name: "Milk", unitPrice: 150, quantity: 2 },
  { name: "Bread", unitPrice: 200, quantity: 1 },
]

const expense = (accountId: string, extra: Record<string, unknown> = {}) =>
  ({
    amount: 500,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId,
    title: "Groceries",
    tags: [],
    isPending: false,
    kind: "default",
    ...extra,
  }) as Parameters<typeof createTransaction>[0]

const itemsOf = async (id: string) =>
  (await getTransactions({ id, includeDeleted: true }))[0]?.items

const itemRowCount = (id: string) =>
  drizzleDb
    .select()
    .from(transactionItems)
    .where(eq(transactionItems.transactionId, id))
    .all().length

describe("transaction items", () => {
  it("saves items in order and reads them back", async () => {
    seedAccount("a1")
    const id = await createTransaction(expense("a1", { items: groceries }))
    expect(await itemsOf(id)).toEqual(groceries)
  })

  it("leaves items alone on an update without items, and replaces them otherwise", async () => {
    seedAccount("a2")
    const id = await createTransaction(expense("a2", { items: groceries }))

    await updateTransaction(id, { title: "Weekly shop" })
    expect(await itemsOf(id)).toEqual(groceries)

    const eggs = [{ name: "Eggs", unitPrice: 300, quantity: 1 }]
    await updateTransaction(id, { items: eggs })
    expect(await itemsOf(id)).toEqual(eggs)

    await updateTransaction(id, { items: [] })
    expect(await itemsOf(id)).toEqual([])
  })

  it("removes the items with a destroyed transaction", async () => {
    seedAccount("a3")
    const id = await createTransaction(expense("a3", { items: groceries }))
    await destroyTransaction(id)
    expect(itemRowCount(id)).toBe(0)
  })

  it("rejects a line total past the safe-integer cap", async () => {
    seedAccount("a4")
    await expect(
      createTransaction(
        expense("a4", {
          items: [
            { name: "x", unitPrice: Number.MAX_SAFE_INTEGER, quantity: 2 },
          ],
        }),
      ),
    ).rejects.toThrow()
  })
})

describe("transaction items in a backup", () => {
  it("survive an export and import", async () => {
    seedAccount("b1")
    const id = await createTransaction(expense("b1", { items: groceries }))

    // Importing an empty backup snapshots (exports) the current data first.
    const empty: MintyFlowBackup = {
      meta: {
        version: 1,
        schemaVersion: SCHEMA_VERSION,
        exportedAt: now,
        appId: "minty-flow-app",
      },
      data: {
        categories: [],
        tags: [],
        accounts: [],
        recurring_transactions: [],
        budgets: [],
        goals: [],
        loans: [],
        transactions: [],
        transfers: [],
        transaction_tags: [],
        transaction_items: [],
        budget_accounts: [],
        budget_categories: [],
        goal_accounts: [],
      },
    }
    expect((await importBackup(empty)).success).toBe(true)
    expect(itemRowCount(id)).toBe(0)

    const validated = validateBackup(JSON.stringify(file.snapshot))
    if (!validated.success) throw new Error(validated.message)
    expect((await importBackup(validated.backup)).success).toBe(true)
    expect(await itemsOf(id)).toEqual(groceries)
  })

  it("restores a v6 backup, which has no items table", () => {
    const v6 = {
      meta: {
        version: 1,
        schemaVersion: 6,
        exportedAt: now,
        appId: "minty-flow-app",
      },
      data: {
        categories: [],
        tags: [],
        accounts: [],
        recurring_transactions: [],
        budgets: [],
        goals: [],
        loans: [],
        transactions: [],
        transfers: [],
        transaction_tags: [],
        budget_accounts: [],
        budget_categories: [],
        goal_accounts: [],
      },
    }
    const result = validateBackup(JSON.stringify(v6))
    expect(result.success && result.backup.data.transaction_items).toEqual([])
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

// The snapshot file is the only thing the file system layer is used for here.
const file = vi.hoisted(() => ({ snapshot: null as unknown }))
vi.mock("~/database/utils/import-snapshot", () => ({
  writeSqliteSnapshot: async (data: unknown) => {
    file.snapshot = JSON.parse(JSON.stringify(data))
  },
  readSqliteSnapshot: async () => file.snapshot,
  deleteSqliteSnapshot: async () => {
    file.snapshot = null
  },
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
} from "~/database/backup/backup-format"
import {
  readImportMarker,
  writeImportMarker,
} from "~/database/backup/import-marker"
import { drizzleDb } from "~/database/drizzle/db"
import { accounts } from "~/database/drizzle/schema"
import {
  importBackup,
  recoverInterruptedImport,
} from "~/database/services/data-management-service"

const now = "2026-01-01T00:00:00.000Z"

function insertAccount(id: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 0,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

const accountIds = () =>
  drizzleDb
    .select({ id: accounts.id })
    .from(accounts)
    .all()
    .map((r) => r.id)
    .sort()

describe("interrupted import recovery", () => {
  beforeEach(() => {
    drizzleDb.delete(accounts).run()
    file.snapshot = null
    writeImportMarker(drizzleDb, 0)
  })

  it("keeps the imported data when the app died after the import committed", async () => {
    insertAccount("old")
    const backup = buildImportOf("imported")
    expect((await importBackup(backup)).success).toBe(true)
    const committedMarker = readImportMarker()
    expect(committedMarker).not.toBe(0)

    // Simulate the kill: the snapshot file survives the commit.
    file.snapshot = { ...buildImportOf("old"), importMarker: committedMarker }

    expect(await recoverInterruptedImport()).toBe(false)
    expect(accountIds()).toEqual(["imported"])
    expect(file.snapshot).toBeNull()
  })

  it("restores the old data when the app died before the import committed", async () => {
    insertAccount("half")
    file.snapshot = {
      ...buildImportOf("old"),
      importMarker: 123456,
    }

    expect(await recoverInterruptedImport()).toBe(true)
    expect(accountIds()).toEqual(["old"])
    expect(file.snapshot).toBeNull()
  })

  it("still restores a snapshot written before the marker existed", async () => {
    file.snapshot = buildImportOf("old")

    expect(await recoverInterruptedImport()).toBe(true)
    expect(accountIds()).toEqual(["old"])
  })

  it("rolls back to the old data when the import fails", async () => {
    insertAccount("old")
    const bad = buildImportOf("imported")
    // Violates the NOT NULL columns, so the insert transaction throws.
    bad.data.transactions = [{ id: "t" }]

    expect((await importBackup(bad)).success).toBe(false)
    expect(accountIds()).toEqual(["old"])
    expect(readImportMarker()).toBe(0)
  })
})

function buildImportOf(accountId: string): MintyFlowBackup {
  return {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now,
      appId: "minty-flow-app",
    },
    data: {
      categories: [],
      tags: [],
      accounts: [
        {
          id: accountId,
          name: accountId,
          type: "checking",
          balance: 0,
          currency_code: "USD",
          is_primary: 0,
          exclude_from_balance: 0,
          is_archived: 0,
          created_at: now,
          updated_at: now,
        },
      ],
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
}

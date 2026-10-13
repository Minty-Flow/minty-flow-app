import { eq } from "drizzle-orm"
import { describe, expect, it, vi } from "vitest"

// Files written during export and import, by path.
const files = vi.hoisted(() => new Map<string, string>())

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})
vi.mock("expo-document-picker", () => ({}))
vi.mock("expo-file-system", () => ({
  Directory: class {},
  File: class {},
  Paths: {},
}))
vi.mock("expo-file-system/legacy", () => ({
  documentDirectory: "file:///docs/",
  EncodingType: { UTF8: "utf8", Base64: "base64" },
  makeDirectoryAsync: async () => {},
  writeAsStringAsync: async (uri: string, content: string) => {
    files.set(uri, content)
  },
  readAsStringAsync: async (uri: string) => files.get(uri) ?? "",
  getInfoAsync: async (uri: string) => ({ exists: files.has(uri) }),
  deleteAsync: async (uri: string) => {
    files.delete(uri)
  },
  StorageAccessFramework: {},
}))
vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Share: {
    share: async () => ({ action: "sharedAction" }),
    dismissedAction: "dismissedAction",
  },
}))
vi.mock("react-native-zip-archive", () => ({
  zip: async () => {},
  unzip: async () => {},
}))
vi.mock("~/utils/attachments", () => ({
  attachmentsDirectory: () => ({ list: () => [] }),
}))

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, recurringTransactions } from "~/database/drizzle/schema"
import { destroyAccount } from "~/database/services/account-service"
import {
  importBackup,
  saveJsonToDevice,
  validateBackup,
} from "~/database/services/data-management-service"

const now = "2026-01-01T00:00:00.000Z"

function seedAccount(id: string) {
  drizzleDb
    .insert(accounts)
    .values({
      id,
      name: id,
      type: "checking",
      balance: 1_000,
      currencyCode: "USD",
      createdAt: now,
      updatedAt: now,
    })
    .run()
}

/** Export with the real export function and return the JSON it wrote. */
async function exportJson(name: string): Promise<string> {
  const saved = await saveJsonToDevice(name)
  const json = files.get(saved.uri)
  if (!json) throw new Error("export wrote no file")
  return json
}

describe("a backup taken after deleting an account that had a recurring rule", () => {
  async function setUp() {
    seedAccount("keep")
    seedAccount("gone")
    drizzleDb
      .insert(recurringTransactions)
      .values({
        id: "rule-1",
        jsonTransactionTemplate: JSON.stringify({
          amount: 500,
          type: "expense",
          accountId: "gone",
          categoryId: null,
          title: "Rent",
          description: null,
          subtype: null,
          tags: null,
          extra: null,
          kind: "repetitive",
        }),
        range: JSON.stringify({ from: 1, to: 4_000_000_000_000 }),
        rules: "[]",
        createdAt: now,
      })
      .run()
  }

  it("validates and restores, and the rule stays disabled", async () => {
    await setUp()
    // Control: before the delete the backup is fine.
    expect(validateBackup(await exportJson("before")).success).toBe(true)

    await destroyAccount("gone")
    const rule = drizzleDb
      .select()
      .from(recurringTransactions)
      .where(eq(recurringTransactions.id, "rule-1"))
      .get()
    expect(rule?.disabled).toBe(1)

    const verdict = validateBackup(await exportJson("after"))
    expect(verdict.success).toBe(true)
    if (!verdict.success) return

    const result = await importBackup(verdict.backup)
    expect(result.success).toBe(true)

    const restored = drizzleDb
      .select()
      .from(recurringTransactions)
      .where(eq(recurringTransactions.id, "rule-1"))
      .get()
    expect(restored?.disabled).toBe(1)
    const ids = drizzleDb
      .select()
      .from(accounts)
      .all()
      .map((a) => a.id)
    expect(ids).toEqual(["keep"])
  })
})

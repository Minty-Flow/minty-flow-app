import { describe, expect, it, vi } from "vitest"

vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import {
  onWriteCommitted,
  writeAffectsPendingTransactions,
} from "~/database/commit-events"
import { runInTransaction } from "~/database/transaction"

describe("write commit events", () => {
  it("tells listeners the name of a committed write", async () => {
    const seen: string[] = []
    const off = onWriteCommitted((name) => seen.push(name))
    await runInTransaction("transaction.delete", () => undefined)
    off()
    expect(seen).toEqual(["transaction.delete"])
  })

  it("stays quiet when the transaction rolls back", async () => {
    const seen: string[] = []
    const off = onWriteCommitted((name) => seen.push(name))
    await expect(
      runInTransaction("transaction.update", () => {
        throw new Error("boom")
      }),
    ).rejects.toThrow("boom")
    off()
    expect(seen).toEqual([])
  })

  it("keeps notifying after a listener throws, and stops after unsubscribe", async () => {
    const seen: string[] = []
    const offBad = onWriteCommitted(() => {
      throw new Error("bad listener")
    })
    const off = onWriteCommitted((name) => seen.push(name))
    await runInTransaction("recurring.generate", () => undefined)
    off()
    offBad()
    await runInTransaction("recurring.generate", () => undefined)
    expect(seen).toEqual(["recurring.generate"])
  })

  it("flags the writes that can change a pending transaction", () => {
    for (const name of [
      "transaction.delete",
      "transaction.confirm",
      "transaction.confirmMany",
      "transaction.restore",
      "transfer.edit",
      "recurring.updateFuture",
      "recurring.generate",
      "trash.destroyAll",
      "trash.autoPurge",
      "import.insert",
      "loan.delete",
      "account.destroy",
    ]) {
      expect(writeAffectsPendingTransactions(name), name).toBe(true)
    }
    for (const name of [
      "budget.create",
      "goal.update",
      "tag.update",
      "category.delete",
    ]) {
      expect(writeAffectsPendingTransactions(name), name).toBe(false)
    }
  })
})

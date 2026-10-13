import { eq } from "drizzle-orm"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("~/database/utils/generate-id", () => ({
  generateId: () => crypto.randomUUID(),
}))
vi.mock("~/database/drizzle/db", async () => {
  const { createTestDb } = await import("@tests/helpers/create-test-db")
  return { drizzleDb: await createTestDb() }
})

import { drizzleDb } from "~/database/drizzle/db"
import { accounts, transactions } from "~/database/drizzle/schema"
import { updateAccount } from "~/database/services/account-service"
import { createTransaction } from "~/database/services/ledger-service"
import i18n, { ensureLanguageLoaded } from "~/i18n/config"
import ar from "~/i18n/translation/ar.json"
import en from "~/i18n/translation/en.json"

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

const account = (id: string) =>
  drizzleDb.select().from(accounts).where(eq(accounts.id, id)).get()

const adjustments = (id: string) =>
  drizzleDb
    .select()
    .from(transactions)
    .where(eq(transactions.accountId, id))
    .all()
    .filter((t) => t.title !== "spend")

const spend = (accountId: string, amount: number) =>
  createTransaction({
    amount,
    type: "expense",
    transactionDate: new Date(2026, 0, 5),
    accountId,
    title: "spend",
    tags: [],
    isPending: false,
    kind: "default",
  } as Parameters<typeof createTransaction>[0])

afterEach(async () => {
  await i18n.changeLanguage("en")
})

describe("updateAccount without a balance", () => {
  it("renames the account without an adjustment while the balance moved elsewhere", async () => {
    seedAccount("moved")
    // Something moves the balance after the form opened.
    await spend("moved", 1_000)
    await updateAccount("moved", { name: "renamed" })
    expect(account("moved")?.name).toBe("renamed")
    expect(account("moved")?.balance).toBe(9_000)
    expect(adjustments("moved")).toHaveLength(0)
  })

  it("renames an account that is below zero", async () => {
    seedAccount("overdrawn", -50_000)
    await updateAccount("overdrawn", { name: "Card" })
    expect(account("overdrawn")?.name).toBe("Card")
    expect(account("overdrawn")?.balance).toBe(-50_000)
  })
})

describe("updateAccount with a balance on purpose", () => {
  it("writes one income adjustment up to the requested balance", async () => {
    seedAccount("up")
    await updateAccount("up", { balance: 12_500 })
    const rows = adjustments("up")
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      type: "income",
      amount: 2_500,
      title: "Balance adjustment",
      isPending: 0,
    })
    expect(account("up")?.balance).toBe(12_500)
  })

  it("writes one expense adjustment down to the requested balance", async () => {
    seedAccount("down")
    await updateAccount("down", { balance: 4_000 })
    const rows = adjustments("down")
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ type: "expense", amount: 6_000 })
    expect(account("down")?.balance).toBe(4_000)
  })

  it("writes nothing when the requested balance equals the current one", async () => {
    seedAccount("same")
    await updateAccount("same", { balance: 10_000, name: "kept" })
    expect(adjustments("same")).toHaveLength(0)
  })

  it("titles the adjustment in the current language", async () => {
    ensureLanguageLoaded("ar")
    await i18n.changeLanguage("ar")
    seedAccount("arabic")
    await updateAccount("arabic", { balance: 11_000 })
    const title = adjustments("arabic")[0]?.title
    // Compared with the file, not with `i18n.t`: a missing key would make both
    // sides the key itself and the test would pass.
    expect(ar.screens.accounts.balanceAdjustmentTitle).not.toBe(
      en.screens.accounts.balanceAdjustmentTitle,
    )
    expect(title).toBe(ar.screens.accounts.balanceAdjustmentTitle)
  })
})

describe("the update and its adjustment are one write", () => {
  it("rolls the whole update back when the adjustment cannot be written", async () => {
    seedAccount("atomic", -1_000)
    // The gap to this balance is not a safe integer, so the adjustment fails
    // after the account row was already updated.
    await expect(
      updateAccount("atomic", {
        name: "renamed",
        balance: Number.MAX_SAFE_INTEGER,
      }),
    ).rejects.toThrow()
    expect(account("atomic")?.name).toBe("atomic")
    expect(account("atomic")?.balance).toBe(-1_000)
    expect(adjustments("atomic")).toHaveLength(0)
  })
})

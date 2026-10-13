import { beforeEach, describe, expect, it, vi } from "vitest"

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const schedule = vi.hoisted(() => vi.fn())
const pending = vi.hoisted(() => ({ rows: [] as unknown[] }))
const language = vi.hoisted(() => ({ current: "en" }))

vi.mock("expo-notifications", () => ({
  getAllScheduledNotificationsAsync: async () => [],
  cancelScheduledNotificationAsync: async () => {},
  scheduleNotificationAsync: schedule,
  SchedulableTriggerInputTypes: { DATE: "date" },
}))
vi.mock("~/database/drizzle/read-models/transaction-read-model", () => ({
  getPendingTransactions: async () => pending.rows,
}))
vi.mock("~/stores/pending-transactions.store", () => ({
  usePendingTransactionsStore: {
    getState: () => ({ notify: true, earlyReminderInSeconds: 3_600 }),
  },
}))
// A translator backed by the real translation files, so a missing key fails.
vi.mock("~/i18n/config", () => {
  const load = (lang: string) =>
    JSON.parse(
      readFileSync(
        fileURLToPath(
          new URL(`../../src/i18n/translation/${lang}.json`, import.meta.url),
        ),
        "utf8",
      ),
    )
  const resources: Record<string, unknown> = { en: load("en"), ar: load("ar") }
  const t = (key: string, options?: Record<string, string>) => {
    const value = key
      .split(".")
      .reduce<unknown>(
        (node, part) => (node as Record<string, unknown> | undefined)?.[part],
        resources[language.current],
      )
    if (typeof value !== "string") return key
    return value.replace(/{{(\w+)}}/g, (_, name) => options?.[name] ?? "")
  }
  return { default: { t } }
})

import { synchronizePlannedTransactionNotifications } from "~/services/pending-transaction-notifications"

const inTwoHours = () => new Date(Date.now() + 2 * 60 * 60 * 1000)

const pendingTx = (
  title: string | null,
  extra: { id?: string; type?: string; amount?: number } = {},
) => ({
  id: "tx-1",
  title,
  type: "expense",
  amount: 1_000,
  transactionDate: inTwoHours(),
  ...extra,
})

const contents = () =>
  schedule.mock.calls.map(
    ([request]) => request.content as { title: string; body: string },
  )

const scheduleIds = () =>
  schedule.mock.calls.map(([request]) => request.identifier as string).sort()

beforeEach(() => {
  schedule.mockClear()
  language.current = "en"
})

describe("pending transaction notifications", () => {
  it("writes the due and early reminders in English", async () => {
    pending.rows = [pendingTx("Netflix")]

    await synchronizePlannedTransactionNotifications()

    expect(contents()).toEqual(
      expect.arrayContaining([
        {
          title: "Netflix",
          body: "Your planned transaction is due now.",
          data: expect.anything(),
        },
        {
          title: "Upcoming: Netflix",
          body: "You have a planned transaction coming up.",
          data: expect.anything(),
        },
      ]),
    )
  })

  it("writes them in Arabic, not English", async () => {
    language.current = "ar"
    pending.rows = [pendingTx("Netflix")]

    await synchronizePlannedTransactionNotifications()

    const bodies = contents().map((c) => c.body)
    expect(bodies).toHaveLength(2)
    for (const body of bodies) expect(body).toMatch(/[؀-ۿ]/)
    expect(contents().map((c) => c.title)).toContain("قادم: Netflix")
  })

  it("translates the fallback title for an untitled transaction", async () => {
    language.current = "ar"
    pending.rows = [pendingTx(null)]

    await synchronizePlannedTransactionNotifications()

    expect(contents().map((c) => c.title)).toContain("معاملة معلّقة")
  })

  it("notifies once for a pending transfer, not once per leg", async () => {
    pending.rows = [
      pendingTx("Move", { id: "debit", type: "transfer", amount: -2_000 }),
      pendingTx("Move", { id: "credit", type: "transfer", amount: 2_000 }),
    ]

    await synchronizePlannedTransactionNotifications()

    // The due and the early reminder, for the debit leg only.
    expect(scheduleIds()).toEqual(["txn-debit", "txn-early-debit"])
  })

  it("still notifies for pending income, which also has a positive amount", async () => {
    pending.rows = [pendingTx("Salary", { id: "pay", type: "income" })]

    await synchronizePlannedTransactionNotifications()

    expect(scheduleIds()).toEqual(["txn-early-pay", "txn-pay"])
  })
})

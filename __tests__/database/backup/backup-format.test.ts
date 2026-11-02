import { describe, expect, it } from "vitest"

import {
  type MintyFlowBackup,
  normalizeColumnValue,
  SCHEMA_VERSION,
  validateBackup,
} from "~/database/backup/backup-format"

const now = "2026-01-01T00:00:00.000Z"

const account = {
  id: "acc-1",
  name: "Wallet",
  type: "checking",
  balance: 1_000,
  currency_code: "USD",
  created_at: now,
  updated_at: now,
}

const template = (accountId: string, amount: number | string = 500) =>
  JSON.stringify({
    amount,
    type: "expense",
    accountId,
    categoryId: null,
    title: "Rent",
    description: null,
    subtype: null,
    tags: null,
    extra: null,
    kind: "repetitive",
  })

const rule = (
  accountId: string,
  extra: Record<string, unknown> = {},
  amount: number | string = 500,
) => ({
  id: "rule-1",
  json_transaction_template: template(accountId, amount),
  transfer_to_account_id: null,
  range: JSON.stringify({ from: 1, to: 4_000_000_000_000 }),
  rules: "[]",
  last_generated_transaction_date: null,
  created_at: now,
  ...extra,
})

function backupWith(rules: Record<string, unknown>[]): string {
  const backup: MintyFlowBackup = {
    meta: {
      version: 1,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: now,
      appId: "minty-flow-app",
    },
    data: {
      categories: [],
      tags: [],
      accounts: [account],
      recurring_transactions: rules,
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
  return JSON.stringify(backup)
}

describe("validateBackup, recurring rules", () => {
  it("accepts an enabled rule whose account exists", () => {
    const result = validateBackup(backupWith([rule("acc-1", { disabled: 0 })]))
    expect(result.success).toBe(true)
  })

  it("accepts a disabled rule whose account is gone", () => {
    const result = validateBackup(backupWith([rule("gone", { disabled: 1 })]))
    expect(result.success).toBe(true)
  })

  it("accepts a disabled flag stored as a boolean", () => {
    const result = validateBackup(
      backupWith([rule("gone", { disabled: true })]),
    )
    expect(result.success).toBe(true)
  })

  it("rejects an enabled rule whose account is gone", () => {
    const result = validateBackup(backupWith([rule("gone", { disabled: 0 })]))
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.message).toBe("Invalid recurring rule (row 0)")
    }
  })

  it("treats a rule from an older backup without the flag as enabled", () => {
    const result = validateBackup(backupWith([rule("gone")]))
    expect(result.success).toBe(false)
  })

  it("still rejects a disabled rule whose amount is not a whole number", () => {
    const result = validateBackup(
      backupWith([rule("gone", { disabled: 1 }, 10.5)]),
    )
    expect(result.success).toBe(false)
  })

  it("rejects an enabled rule whose category is not in the backup", () => {
    const withCategory = JSON.parse(template("acc-1")) as Record<
      string,
      unknown
    >
    withCategory.categoryId = "gone"
    const result = validateBackup(
      backupWith([
        rule("acc-1", {
          disabled: 0,
          json_transaction_template: JSON.stringify(withCategory),
        }),
      ]),
    )
    expect(result.success).toBe(false)
  })

  it("rejects an enabled rule whose transfer account is not in the backup", () => {
    const result = validateBackup(
      backupWith([
        rule("acc-1", { disabled: 0, transfer_to_account_id: "gone" }),
      ]),
    )
    expect(result.success).toBe(false)
  })

  it("accepts a disabled rule whose transfer account is gone", () => {
    const result = validateBackup(
      backupWith([
        rule("acc-1", { disabled: 1, transfer_to_account_id: "gone" }),
      ]),
    )
    expect(result.success).toBe(true)
  })

  it("rejects a transaction date that does not parse", () => {
    const result = validateBackup(
      backupWith([rule("acc-1", { disabled: 1 })]).replace(
        '"transactions":[]',
        '"transactions":[{"id":"tx-1","amount":100,"transaction_date":"nope"}]',
      ),
    )
    expect(result.success).toBe(false)
  })

  it("still rejects a rule whose template is not JSON", () => {
    const result = validateBackup(
      backupWith([
        rule("acc-1", { disabled: 1, json_transaction_template: "{nope" }),
      ]),
    )
    expect(result.success).toBe(false)
  })
})

describe("normalizeColumnValue, dates", () => {
  it("turns a date-only string into an ISO timestamp", () => {
    expect(normalizeColumnValue("transaction_date", "2026-03-04")).toBe(
      "2026-03-04T00:00:00.000Z",
    )
  })

  it("normalizes an offset-carrying timestamp to UTC", () => {
    expect(
      normalizeColumnValue("transaction_date", "2026-03-04T12:00:00+03:00"),
    ).toBe("2026-03-04T09:00:00.000Z")
  })

  it("leaves an unparseable date for validation to reject", () => {
    expect(normalizeColumnValue("transaction_date", "nope")).toBe("nope")
  })
})

describe("settings and profile sections", () => {
  const base = (extra: Record<string, unknown> = {}) =>
    JSON.stringify({
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
        budget_accounts: [],
        budget_categories: [],
        goal_accounts: [],
      },
      ...extra,
    })

  it("accepts a backup with neither section and adds nothing", () => {
    const result = validateBackup(base())
    expect(result.success).toBe(true)
    if (!result.success) return
    expect("settings" in result.backup).toBe(false)
    expect("profile" in result.backup).toBe(false)
  })

  it("accepts an older schema version without the sections", () => {
    const old = JSON.parse(base())
    old.meta.schemaVersion = 5
    expect(validateBackup(JSON.stringify(old)).success).toBe(true)
  })

  it("keeps valid settings and the profile", () => {
    const result = validateBackup(
      base({
        settings: { weekStart: { version: 0, state: { weekStart: "monday" } } },
        profile: { name: "  Sam ", imageFile: "minty_profile_123.jpg" },
      }),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.backup.settings?.weekStart.state).toEqual({
      weekStart: "monday",
    })
    expect(result.backup.profile).toEqual({
      name: "Sam",
      imageFile: "minty_profile_123.jpg",
    })
  })

  it("ignores unreadable sections without blocking the data import", () => {
    const result = validateBackup(
      base({
        settings: "nope",
        profile: { name: 5, imageFile: "../../etc/passwd" },
      }),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect("settings" in result.backup).toBe(false)
    expect("profile" in result.backup).toBe(false)
  })
})

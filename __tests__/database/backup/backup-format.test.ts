import { describe, expect, it } from "vitest"

import {
  type MintyFlowBackup,
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
      expect(result.message).toBe("Invalid recurring money template (row 0)")
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

  it("still rejects a rule whose template is not JSON", () => {
    const result = validateBackup(
      backupWith([
        rule("acc-1", { disabled: 1, json_transaction_template: "{nope" }),
      ]),
    )
    expect(result.success).toBe(false)
  })
})

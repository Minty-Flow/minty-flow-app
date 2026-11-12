import { LOW_PRICE_CRYPTO_CODES } from "~/services/currency-registry"
import { roundToSafeInteger } from "~/utils/money"

import type { RawRow } from "./backup-format"

/** v8 moved these codes from 8 to 2 minor digits: divide by 10^(8-2). */
const LEGACY_CRYPTO_SCALE = 1_000_000

const rows = (data: Record<string, unknown>, table: string): RawRow[] => {
  const value = data[table]
  return Array.isArray(value) ? (value as RawRow[]) : []
}

const rescale = (row: RawRow, column: string) => {
  const value = row[column]
  if (typeof value === "number")
    row[column] = roundToSafeInteger(value / LEGACY_CRYPTO_SCALE)
}

/**
 * Bring an older backup's data up to the current schema, in place: the same
 * changes the database migrations made to live data.
 * - before v7: no `transaction_items` table, so no items.
 * - before v8: PEPE/SHIB amounts were at 8 minor digits; rescale them like
 *   migration 0007 (round half away from zero to 0.01).
 */
export function upgradeBackupData(
  schemaVersion: number,
  data: Record<string, unknown>,
): void {
  if (schemaVersion < 7 && data.transaction_items === undefined) {
    data.transaction_items = []
  }
  if (schemaVersion < 8) rescaleLowPriceCrypto(data)
}

function rescaleLowPriceCrypto(data: Record<string, unknown>): void {
  const codes = new Set<string>(LOW_PRICE_CRYPTO_CODES)
  const isLowPrice = (row: RawRow) => codes.has(String(row.currency_code))

  const accountIds = new Set<string>()
  for (const account of rows(data, "accounts")) {
    if (!isLowPrice(account)) continue
    accountIds.add(String(account.id))
    rescale(account, "balance")
  }
  const txIds = new Set<string>()
  for (const tx of rows(data, "transactions")) {
    if (!accountIds.has(String(tx.account_id))) continue
    txIds.add(String(tx.id))
    rescale(tx, "amount")
    rescale(tx, "account_balance_before")
  }
  for (const item of rows(data, "transaction_items")) {
    if (txIds.has(String(item.transaction_id))) rescale(item, "unit_price")
  }
  for (const budget of rows(data, "budgets")) {
    if (isLowPrice(budget)) rescale(budget, "amount")
  }
  for (const goal of rows(data, "goals")) {
    if (isLowPrice(goal)) rescale(goal, "target_amount")
  }
  for (const loan of rows(data, "loans")) {
    if (accountIds.has(String(loan.account_id)))
      rescale(loan, "principal_amount")
  }
  for (const rule of rows(data, "recurring_transactions")) {
    try {
      const template = JSON.parse(String(rule.json_transaction_template))
      if (!accountIds.has(String(template.accountId))) continue
      if (typeof template.amount !== "number") continue
      template.amount = roundToSafeInteger(
        template.amount / LEGACY_CRYPTO_SCALE,
      )
      rule.json_transaction_template = JSON.stringify(template)
    } catch {
      // An unreadable template is rejected by validation, not here.
    }
  }
}

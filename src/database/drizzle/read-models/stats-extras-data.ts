import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { expenseContribution } from "~/database/drizzle/read-models/stats-data"
import type { StatsDateRange } from "~/types/stats"
import type { TransactionLocation } from "~/types/transactions"

/* ------------------------------------------------------------------ */
/* Recurring spend                                                     */
/* ------------------------------------------------------------------ */

export interface RecurringSpend {
  total: number
  count: number
}

/**
 * Expenses spawned by a recurring rule in `range` on accounts using
 * `currency`, upcoming ones included: the same rows the Recurring screen lists.
 */
export function fetchRecurringSpend(
  range: Pick<StatsDateRange, "from" | "to">,
  currency: string,
): RecurringSpend {
  const row = drizzleDb.get<{ total: number | null; count: number }>(sql`
    SELECT SUM(ABS(t.amount)) AS total, COUNT(*) AS count
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     WHERE t.is_deleted = 0
       AND t.recurring_id IS NOT NULL
       AND t.type = 'expense'
       AND a.currency_code = ${currency}
       AND t.transaction_date >= ${range.from.toISOString()}
       AND t.transaction_date <= ${range.to.toISOString()}`)
  return { total: row?.total ?? 0, count: row?.count ?? 0 }
}

/* ------------------------------------------------------------------ */
/* Spending places                                                     */
/* ------------------------------------------------------------------ */

export interface SpendingPlace {
  key: string
  /** The saved address; null when only coordinates were stored. */
  address: string | null
  latitude: number
  longitude: number
  total: number
  count: number
}

export interface PlaceRow {
  amount: number
  type: string
  subtype: string | null
  loanId: string | null
  kind: string | null
  location: string | null
}

function parseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function parseLocation(raw: string | null): TransactionLocation | null {
  if (!raw) return null
  const loc = parseJson<TransactionLocation>(raw)
  if (!loc) return null
  if (!Number.isFinite(loc.latitude) || !Number.isFinite(loc.longitude)) {
    return null
  }
  return loc
}

/**
 * Groups located expenses by place: the same address is one place; without an
 * address, coordinates rounded to 3 decimals (about 100 m) are. Sorted by
 * total spent, places that net to zero or less (refunds) are dropped.
 */
export function groupSpendingPlaces(rows: PlaceRow[]): SpendingPlace[] {
  const places = new Map<string, SpendingPlace>()
  for (const row of rows) {
    const contribution = expenseContribution(row)
    if (contribution === 0) continue
    const loc = parseLocation(row.location)
    if (!loc) continue
    const address = loc.address?.trim() || null
    const key = address
      ? `a:${address.toLowerCase()}`
      : `c:${loc.latitude.toFixed(3)},${loc.longitude.toFixed(3)}`
    const place = places.get(key)
    if (place) {
      place.total += contribution
      place.count += 1
    } else {
      places.set(key, {
        key,
        address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        total: contribution,
        count: 1,
      })
    }
  }
  return [...places.values()]
    .filter((p) => p.total > 0)
    .sort((a, b) => b.total - a.total)
}

/** Confirmed, located expenses in `range` on accounts using `currency`. */
export function fetchSpendingPlaces(
  range: Pick<StatsDateRange, "from" | "to">,
  currency: string,
): SpendingPlace[] {
  const rows = drizzleDb.all<{
    amount: number
    type: string
    subtype: string | null
    loan_id: string | null
    kind: string | null
    location: string | null
  }>(sql`
    SELECT t.amount, t.type, t.subtype, t.loan_id, t.kind, t.location
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     WHERE t.is_deleted = 0
       AND t.is_pending = 0
       AND t.location IS NOT NULL
       AND a.currency_code = ${currency}
       AND NOT EXISTS (SELECT 1 FROM transfers tr WHERE tr.from_transaction_id = t.id OR tr.to_transaction_id = t.id)
       AND t.transaction_date >= ${range.from.toISOString()}
       AND t.transaction_date <= ${range.to.toISOString()}`)

  return groupSpendingPlaces(
    rows.map((r) => ({
      amount: r.amount,
      type: r.type,
      subtype: r.subtype,
      loanId: r.loan_id,
      kind: r.kind,
      location: r.location,
    })),
  )
}

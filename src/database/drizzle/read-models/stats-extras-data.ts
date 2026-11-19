import { sql } from "drizzle-orm"

import { drizzleDb } from "~/database/drizzle/db"
import { expenseContribution } from "~/database/drizzle/read-models/stats-data"
import type { RowAccount, RowCategory } from "~/database/types/rows"
import type { StatsDateRange } from "~/types/stats"
import type {
  Recurrence,
  TransactionKind,
  TransactionLocation,
} from "~/types/transactions"
import { TransactionKindEnum } from "~/types/transactions"
import { roundToSafeInteger } from "~/utils/money"
import { nextAbsoluteOccurrence, parseRecurrence } from "~/utils/recurrence"

/* ------------------------------------------------------------------ */
/* Recurring commitments                                               */
/* ------------------------------------------------------------------ */

export interface RecurringCommitment {
  id: string
  title: string | null
  categoryName: string | null
  categoryIcon: string | null
  kind: TransactionKind
  amount: number
  /** `amount` scaled to one month, in minor units. */
  monthlyAmount: number
  recurrence: Recurrence
  nextDate: Date
  /** Newest generated transaction; editing the rule goes through it. */
  latestTransactionId: string | null
}

export interface RecurringSummary {
  currency: string
  monthlyTotal: number
  subscriptions: RecurringCommitment[]
  repetitive: RecurringCommitment[]
}

const MONTHS_PER_UNIT: Record<Recurrence["unit"], number> = {
  day: 12 / 365.25,
  week: 12 / 52,
  month: 1,
  year: 12,
}

/** What a rule costs per month: "every 2 weeks" of 100 is about 217. */
export function monthlyEquivalent(amount: number, recurrence: Recurrence) {
  const months = MONTHS_PER_UNIT[recurrence.unit] * recurrence.interval
  return roundToSafeInteger(Math.abs(amount) / months)
}

interface RecurringRow {
  id: string
  json_transaction_template: string
  range: string
  rules: string
  latest_transaction_id: string | null
}

interface TemplateShape {
  amount?: number
  type?: string
  accountId?: string
  categoryId?: string | null
  title?: string | null
  kind?: TransactionKind
}

function parseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Active expense rules whose account uses `currency`, split by kind. A rule
 * counts as active while it is enabled and still has an occurrence after `now`.
 */
export function fetchRecurringSummary(
  currency: string,
  now: Date = new Date(),
): RecurringSummary {
  const rows = drizzleDb.all<RecurringRow>(sql`
    SELECT r.id, r.json_transaction_template, r.range, r.rules,
      (SELECT t.id FROM transactions t
        WHERE t.recurring_id = r.id AND t.is_deleted = 0
        ORDER BY t.transaction_date DESC LIMIT 1) AS latest_transaction_id
     FROM recurring_transactions r
     WHERE r.disabled = 0`)

  const accountRows = drizzleDb.all<RowAccount>(sql`SELECT * FROM accounts`)
  const categoryRows = drizzleDb.all<RowCategory>(sql`SELECT * FROM categories`)
  const accountCurrency = new Map(
    accountRows.map((a) => [a.id, a.currency_code]),
  )
  const categoryMap = new Map(categoryRows.map((c) => [c.id, c]))

  const summary: RecurringSummary = {
    currency,
    monthlyTotal: 0,
    subscriptions: [],
    repetitive: [],
  }

  for (const row of rows) {
    const template = parseJson<TemplateShape>(row.json_transaction_template)
    const range = parseJson<{ from: number; to: number }>(row.range)
    const rules = parseJson<string[]>(row.rules)
    if (!template || !range || !rules?.length) continue
    if (template.type !== "expense" || !template.accountId) continue
    if (accountCurrency.get(template.accountId) !== currency) continue

    const nextDate = nextAbsoluteOccurrence(rules, range, now)
    if (!nextDate) continue

    const recurrence = parseRecurrence(rules[0])
    const amount = Math.abs(template.amount ?? 0)
    const category = template.categoryId
      ? categoryMap.get(template.categoryId)
      : undefined
    const kind = template.kind ?? TransactionKindEnum.REPETITIVE
    const item: RecurringCommitment = {
      id: row.id,
      title: template.title?.trim() || null,
      categoryName: category?.name ?? null,
      categoryIcon: category?.icon ?? null,
      kind,
      amount,
      monthlyAmount: monthlyEquivalent(amount, recurrence),
      recurrence,
      nextDate,
      latestTransactionId: row.latest_transaction_id,
    }
    summary.monthlyTotal += item.monthlyAmount
    if (kind === TransactionKindEnum.SUBSCRIPTION) {
      summary.subscriptions.push(item)
    } else {
      summary.repetitive.push(item)
    }
  }

  const byMonthly = (a: RecurringCommitment, b: RecurringCommitment) =>
    b.monthlyAmount - a.monthlyAmount
  summary.subscriptions.sort(byMonthly)
  summary.repetitive.sort(byMonthly)
  return summary
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
  range: StatsDateRange,
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

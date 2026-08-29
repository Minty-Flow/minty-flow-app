/**
 * "Safe to spend" — a single discretionary figure for the current calendar
 * month. Balance-based (not income-projection based): money already received
 * is in the balance, so there is no "already spent" term to subtract and no
 * double counting. Deliberate deviation from the spec's income-first wording;
 * see `.scratch/budget-gaps-easy/issues/02-safe-to-spend.md`.
 *
 *   pot = balance + upcomingIncome − upcomingBills − goalContributions
 *   perUnit = pot / remainingUnits(month, cadence)
 */

export type SafeToSpendCadence = "daily" | "weekly"

export interface SafeToSpendInput {
  balanceMinor: number
  /** Recurring income still scheduled between now and month end. */
  upcomingIncomeMinor: number
  /** Recurring expenses still scheduled between now and month end. */
  upcomingBillsMinor: number
  /** Planned goal top-ups for the rest of the month (0 when disabled). */
  goalContributionsMinor: number
  remainingUnits: number
}

export interface SafeToSpendResult {
  potMinor: number
  perUnitMinor: number
  isOver: boolean
}

export function computeSafeToSpend(input: SafeToSpendInput): SafeToSpendResult {
  const potMinor =
    input.balanceMinor +
    input.upcomingIncomeMinor -
    input.upcomingBillsMinor -
    input.goalContributionsMinor
  const units = Math.max(1, Math.trunc(input.remainingUnits))
  return {
    potMinor,
    perUnitMinor: Math.round(potMinor / units),
    isOver: potMinor < 0,
  }
}

/**
 * Units left in the current calendar month, inclusive of today.
 * `daily` → whole days remaining; `weekly` → those days in 7-day chunks,
 * rounded up, minimum 1.
 */
export function remainingUnitsInMonth(
  now: Date,
  cadence: SafeToSpendCadence,
): number {
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  )
  const dayMs = 24 * 60 * 60 * 1000
  const daysLeft = Math.max(
    1,
    Math.round((monthEnd.getTime() - startOfToday.getTime()) / dayMs) + 1,
  )
  return cadence === "weekly" ? Math.max(1, Math.ceil(daysLeft / 7)) : daysLeft
}

/** First and last instant of the current calendar month. */
export function currentMonthBounds(now: Date): { start: Date; end: Date } {
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
  }
}

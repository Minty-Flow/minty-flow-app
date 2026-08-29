/**
 * Budget pace projection — pure, no React, no DB. Given how much of a budget
 * is spent and how far through its period we are, extrapolate the run-rate to
 * the period end and decide whether it lands over the limit.
 */

export interface PaceInput {
  /** Spent so far this period, minor units. */
  spentMinor: number
  /** Budget limit, minor units. */
  limitMinor: number
  /** Days elapsed in the period (1-based, capped at totalDays). */
  elapsedDays: number
  /** Total days in the period. */
  totalDays: number
}

/** Extrapolate current spend to the period end: `spent / elapsedFraction`. */
export function projectedSpendMinor(input: PaceInput): number {
  const { spentMinor, elapsedDays, totalDays } = input
  if (totalDays <= 0 || elapsedDays <= 0) return spentMinor
  const fraction = Math.min(elapsedDays / totalDays, 1)
  if (fraction <= 0) return spentMinor
  return Math.round(spentMinor / fraction)
}

/**
 * True when the run-rate points past the limit by more than `sensitivity`
 * headroom (0.1 = 10%). Never fires when already over the limit — that is the
 * existing over-budget state, not a pace warning — nor on the last day, when
 * there is no "before the period ends" left to act in.
 */
export function isOnPaceToExceed(
  input: PaceInput,
  sensitivity: number,
): boolean {
  const { spentMinor, limitMinor, elapsedDays, totalDays } = input
  if (limitMinor <= 0) return false
  if (spentMinor >= limitMinor) return false
  if (elapsedDays >= totalDays) return false
  return (
    projectedSpendMinor(input) > limitMinor * (1 + Math.max(sensitivity, 0))
  )
}

/** How far past the limit the run-rate projects, minor units, never negative. */
export function paceOverageMinor(input: PaceInput): number {
  return Math.max(projectedSpendMinor(input) - input.limitMinor, 0)
}

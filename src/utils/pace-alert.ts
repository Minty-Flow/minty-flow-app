/**
 * Budget pace projection: pure, no React, no DB. Extrapolates the spend rate to
 * the period end and decides whether it lands over the limit.
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

/** Headroom over the limit before a pace warning fires (0.1 = 10%). */
export const PACE_SENSITIVITY_OPTIONS = [0.1, 0.25] as const

/** Current spend extrapolated to the period end: `spent / elapsedFraction`. */
export function projectedSpendMinor(input: PaceInput): number {
  const { spentMinor, elapsedDays, totalDays } = input
  if (totalDays <= 0 || elapsedDays <= 0) return spentMinor
  return Math.round(spentMinor / Math.min(elapsedDays / totalDays, 1))
}

/**
 * True when the spend rate points past the limit by more than `sensitivity`.
 * Never when already over (that is the over-budget state, not a pace warning)
 * nor on the last day, when there is no time left to act.
 */
export function isOnPaceToExceed(
  input: PaceInput,
  sensitivity: number,
): boolean {
  const { spentMinor, limitMinor, elapsedDays, totalDays } = input
  if (limitMinor <= 0 || spentMinor >= limitMinor) return false
  if (elapsedDays >= totalDays) return false
  return (
    projectedSpendMinor(input) > limitMinor * (1 + Math.max(sensitivity, 0))
  )
}

/** How far past the limit the spend rate projects, never negative. */
export function paceOverageMinor(input: PaceInput): number {
  return Math.max(projectedSpendMinor(input) - input.limitMinor, 0)
}

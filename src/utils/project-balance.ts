/**
 * Forward balance projection — pure, no React, no DB. Walks one point per day
 * from today to `now + horizonDays`, applying dated balance events (future
 * recurring charges, pending one-offs) to a starting balance.
 *
 * The starting balance is the account's *current real* balance, so events must
 * be things not already reflected in it: unspawned recurring occurrences and
 * still-pending transactions.
 */

const DAY_MS = 24 * 60 * 60 * 1000

/** A single dated change to the balance, minor units, signed. */
export interface BalanceEvent {
  atMs: number
  deltaMinor: number
}

export interface ProjectedBalancePoint {
  /** Start-of-day, local time. */
  dateMs: number
  /** Projected balance at the end of this day. */
  balanceMinor: number
  isNegative: boolean
}

export interface ProjectBalanceParams {
  startBalanceMinor: number
  events: BalanceEvent[]
  /** 1+; number of days to project past today. */
  horizonDays: number
  nowMs: number
}

export interface ProjectBalanceResult {
  points: ProjectedBalancePoint[]
  /** Most-negative day (earliest on ties), or null if the balance never dips below zero. */
  low: { dateMs: number; balanceMinor: number } | null
}

function startOfDay(ms: number): number {
  const d = new Date(ms)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function projectBalance(p: ProjectBalanceParams): ProjectBalanceResult {
  const horizon = Math.max(1, Math.trunc(p.horizonDays))
  const day0 = startOfDay(p.nowMs)

  // Bucket each event's delta onto a day index. Anything already overdue but
  // not yet applied lands on today; anything past the horizon is dropped.
  const deltaByDay = new Array<number>(horizon + 1).fill(0)
  for (const e of p.events) {
    let idx = Math.round((startOfDay(e.atMs) - day0) / DAY_MS)
    if (idx < 0) idx = 0
    if (idx > horizon) continue
    deltaByDay[idx] += e.deltaMinor
  }

  const points: ProjectedBalancePoint[] = []
  let running = p.startBalanceMinor
  let low: ProjectBalanceResult["low"] = null
  for (let i = 0; i <= horizon; i++) {
    running += deltaByDay[i]
    const dateMs = day0 + i * DAY_MS
    const isNegative = running < 0
    points.push({ dateMs, balanceMinor: running, isNegative })
    if (isNegative && (low === null || running < low.balanceMinor)) {
      low = { dateMs, balanceMinor: running }
    }
  }

  return { points, low }
}

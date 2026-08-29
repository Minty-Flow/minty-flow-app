/**
 * Debt payoff projection — pure, no React, no DB. Simulates paying down a set
 * of loans month by month under the snowball or avalanche method, given a
 * fixed extra amount on top of the per-loan minimums.
 *
 * All money is minor units. APR is an annual percentage (0 allowed →
 * interest-free, linear payoff).
 */

export type PayoffStrategy = "snowball" | "avalanche"

export interface PayoffLoanInput {
  id: string
  name: string
  /** Outstanding balance now, minor units. */
  balanceMinor: number
  /** Annual interest rate as a percentage. 0 = no interest. */
  aprPercent: number
  /** Required payment each month, minor units. May be 0. */
  minPaymentMinor: number
}

export interface PayoffMonth {
  /** 1-based months from now. */
  month: number
  /** Combined balance across all loans at the end of this month. */
  totalBalanceMinor: number
  /** Interest added across all loans during this month. */
  interestPaidMinor: number
}

export interface PayoffResult {
  schedule: PayoffMonth[]
  /** Months until every balance reaches zero. 0 when nothing is owed. */
  monthsToPayoff: number
  /**
   * `now + monthsToPayoff` months, or null when the plan never clears the
   * debt (payments don't cover the interest).
   */
  payoffDate: Date | null
  totalInterestMinor: number
  /** True when at least one loan carries a non-zero APR. */
  hasRates: boolean
}

export interface DebtPayoffParams {
  loans: PayoffLoanInput[]
  extraPerMonthMinor: number
  strategy: PayoffStrategy
  now?: Date
}

// A century of months — if a plan hasn't cleared by then, treat it as never.
const MAX_MONTHS = 1200

interface WorkingLoan {
  id: string
  balance: number
  monthlyRate: number
  minPayment: number
}

function orderLoans(
  loans: WorkingLoan[],
  strategy: PayoffStrategy,
  aprById: Map<string, number>,
): WorkingLoan[] {
  return [...loans].sort((a, b) => {
    if (strategy === "snowball") {
      if (a.balance !== b.balance) return a.balance - b.balance
    } else {
      const aprA = aprById.get(a.id) ?? 0
      const aprB = aprById.get(b.id) ?? 0
      if (aprA !== aprB) return aprB - aprA
    }
    return a.id.localeCompare(b.id)
  })
}

export function debtPayoff(params: DebtPayoffParams): PayoffResult {
  const { extraPerMonthMinor, strategy, now = new Date() } = params
  const aprById = new Map(params.loans.map((l) => [l.id, l.aprPercent]))
  const hasRates = params.loans.some((l) => l.aprPercent > 0)

  const working: WorkingLoan[] = params.loans
    .filter((l) => l.balanceMinor > 0)
    .map((l) => ({
      id: l.id,
      balance: l.balanceMinor,
      monthlyRate: Math.max(l.aprPercent, 0) / 100 / 12,
      minPayment: Math.max(l.minPaymentMinor, 0),
    }))

  if (working.length === 0) {
    return {
      schedule: [],
      monthsToPayoff: 0,
      payoffDate: now,
      totalInterestMinor: 0,
      hasRates,
    }
  }

  const schedule: PayoffMonth[] = []
  let totalInterest = 0
  let month = 0
  let prevBalance = working.reduce((sum, l) => sum + l.balance, 0)

  while (working.some((l) => l.balance > 0) && month < MAX_MONTHS) {
    month += 1
    let interestThisMonth = 0

    // Accrue interest.
    for (const loan of working) {
      if (loan.balance <= 0) continue
      const interest = Math.round(loan.balance * loan.monthlyRate)
      loan.balance += interest
      interestThisMonth += interest
    }
    totalInterest += interestThisMonth

    // Budget for the month: every active loan's minimum, plus the extra.
    let pool =
      extraPerMonthMinor +
      working.reduce((sum, l) => (l.balance > 0 ? sum + l.minPayment : sum), 0)

    // Pay minimums first (capped at the balance).
    for (const loan of working) {
      if (loan.balance <= 0) continue
      const pay = Math.min(loan.minPayment, loan.balance, pool)
      loan.balance -= pay
      pool -= pay
    }

    // Funnel whatever is left to the highest-priority active loan, cascading.
    const ordered = orderLoans(working, strategy, aprById)
    for (const loan of ordered) {
      if (pool <= 0) break
      if (loan.balance <= 0) continue
      const pay = Math.min(pool, loan.balance)
      loan.balance -= pay
      pool -= pay
    }

    const totalBalance = working.reduce(
      (sum, l) => sum + Math.max(l.balance, 0),
      0,
    )
    schedule.push({
      month,
      totalBalanceMinor: totalBalance,
      interestPaidMinor: interestThisMonth,
    })

    // No dent in the balance this month → payments can't cover the interest.
    if (totalBalance >= prevBalance && totalBalance > 0) {
      return {
        schedule,
        monthsToPayoff: month,
        payoffDate: null,
        totalInterestMinor: totalInterest,
        hasRates,
      }
    }
    prevBalance = totalBalance
  }

  const cleared = working.every((l) => l.balance <= 0)
  const payoffDate = cleared
    ? new Date(now.getFullYear(), now.getMonth() + month, now.getDate())
    : null

  return {
    schedule,
    monthsToPayoff: month,
    payoffDate,
    totalInterestMinor: totalInterest,
    hasRates,
  }
}

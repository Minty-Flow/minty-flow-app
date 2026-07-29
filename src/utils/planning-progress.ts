import { differenceInCalendarDays, differenceInDays } from "date-fns"

import type { Budget, BudgetPeriod } from "~/types/budgets"
import type { Goal } from "~/types/goals"
import { type Loan, LoanTypeEnum } from "~/types/loans"

import {
  endOfAppWeek,
  formatDateKey,
  formatMonthKey,
  formatWeekKey,
  formatYear,
  startOfAppWeek,
} from "./time-utils"

export type BudgetStatus = "onTrack" | "watch" | "over"
export type GoalStatus = "onTrack" | "behind" | "flexible" | "reached"

export function getBudgetPeriodBounds(
  period: BudgetPeriod,
  startDate: Date,
  endDate: Date | null,
  now = new Date(),
): { periodStart: Date; periodEnd: Date } {
  switch (period) {
    case "daily":
      return {
        periodStart: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        periodEnd: new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        ),
      }
    case "weekly":
      return {
        periodStart: startOfAppWeek(now),
        periodEnd: endOfAppWeek(now),
      }
    case "monthly":
      return {
        periodStart: new Date(now.getFullYear(), now.getMonth(), 1),
        periodEnd: new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        ),
      }
    case "yearly":
      return {
        periodStart: new Date(now.getFullYear(), 0, 1),
        periodEnd: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      }
    case "custom":
      return {
        periodStart: startDate,
        periodEnd: endDate ?? now,
      }
  }
}

export function getBudgetPeriodKey(
  budget: Pick<Budget, "period" | "startDate">,
  now = new Date(),
): string {
  switch (budget.period) {
    case "daily":
      return formatDateKey(now)
    case "weekly":
      return formatWeekKey(now)
    case "monthly":
      return formatMonthKey(now)
    case "yearly":
      return formatYear(now)
    case "custom":
      return formatDateKey(budget.startDate)
  }
}

export function getBudgetProgressModel(
  budget: Budget,
  spent: number,
  now = new Date(),
) {
  const { periodStart, periodEnd } = getBudgetPeriodBounds(
    budget.period,
    budget.startDate,
    budget.endDate,
    now,
  )
  const limit = budget.amount
  const totalDays =
    Math.max(differenceInCalendarDays(periodEnd, periodStart), 0) + 1
  const elapsedDays = Math.min(
    Math.max(differenceInCalendarDays(now, periodStart), 0) + 1,
    totalDays,
  )
  const daysRemaining = Math.max(totalDays - elapsedDays, 0)
  const timeRatio = totalDays > 0 ? elapsedDays / totalDays : 0
  const spendRatio = limit > 0 ? Math.min(spent / limit, 1) : 0
  const spendPercent = limit > 0 ? (spent / limit) * 100 : 0
  const isOverBudget = spent > limit
  const remaining = limit - spent
  const status: BudgetStatus = isOverBudget
    ? "over"
    : limit > 0 && spent / limit - timeRatio >= 0.1
      ? "watch"
      : "onTrack"

  return {
    periodStart,
    periodEnd,
    limit,
    spent,
    totalDays,
    elapsedDays,
    daysRemaining,
    timeRatio,
    spendRatio,
    spendPercent,
    isOverBudget,
    remaining,
    status,
  }
}

export function getGoalProgressModel(
  goal: Goal,
  currentAmount: number,
  now = new Date(),
) {
  const progress = goal.targetAmount > 0 ? currentAmount / goal.targetAmount : 0
  const isCompleted = progress >= 1
  const daysLeft = goal.targetDate
    ? differenceInDays(goal.targetDate, now)
    : null
  const status: GoalStatus =
    progress >= 1
      ? "reached"
      : !goal.targetDate
        ? "flexible"
        : daysLeft !== null && daysLeft < 0
          ? "behind"
          : (() => {
              const totalDays = differenceInDays(
                goal.targetDate,
                goal.createdAt,
              )
              if (totalDays <= 0) return "onTrack"
              const elapsed = differenceInDays(now, goal.createdAt)
              return progress >= Math.min(elapsed / totalDays, 1)
                ? "onTrack"
                : "behind"
            })()

  return {
    currentAmount,
    progress,
    clampedProgress: Math.min(progress, 1),
    isCompleted,
    remaining: Math.max(goal.targetAmount - currentAmount, 0),
    daysLeft,
    status,
  }
}

export function getLoanProgressModel(
  loan: Loan,
  paidAmount: number,
  now = new Date(),
) {
  const progress =
    loan.principalAmount > 0 ? paidAmount / loan.principalAmount : 0
  return {
    isLent: loan.loanType === LoanTypeEnum.LENT,
    paid: paidAmount,
    principal: loan.principalAmount,
    progress,
    clampedProgress: Math.min(progress, 1),
    isPaid: progress >= 1,
    remaining: Math.max(loan.principalAmount - paidAmount, 0),
    dueDays: loan.dueDate ? differenceInDays(loan.dueDate, now) : null,
  }
}

import { describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
// Sunday-first, unlike the ISO week.
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 0 }))

import type { Goal } from "~/types/goals"
import type { Loan } from "~/types/loans"
import {
  getBudgetPeriodKey,
  getGoalProgressModel,
  getLoanProgressModel,
} from "~/utils/planning-progress"

const weekly = { period: "weekly" as const, startDate: new Date(2026, 0, 1) }

describe("getBudgetPeriodKey", () => {
  it("changes when the app's week starts, not on the ISO Monday", () => {
    // Sat 10 Jan and Sun 11 Jan 2026 are in different Sunday-first weeks
    // but the same ISO week.
    expect(getBudgetPeriodKey(weekly, new Date(2026, 0, 10, 12))).not.toBe(
      getBudgetPeriodKey(weekly, new Date(2026, 0, 11, 12)),
    )
  })

  it("is the same for every day of one app week", () => {
    expect(getBudgetPeriodKey(weekly, new Date(2026, 0, 11, 8))).toBe(
      getBudgetPeriodKey(weekly, new Date(2026, 0, 17, 22)),
    )
  })
})

const goal = (targetDate: Date, createdAt = new Date(2026, 0, 1)): Goal =>
  ({
    id: "g1",
    name: "Trip",
    goalType: "savings",
    targetAmount: 10_000,
    currencyCode: "USD",
    targetDate,
    createdAt,
  }) as Goal

const loan = (dueDate: Date): Loan =>
  ({
    id: "l1",
    name: "Car",
    principalAmount: 10_000,
    loanType: "lent",
    dueDate,
  }) as Loan

describe("goal and loan day counts", () => {
  it("counts the goal's last day as a full day, whatever the stored time", () => {
    const now = new Date(2026, 2, 10, 23, 0)
    const target = new Date(2026, 2, 11, 9, 0)

    expect(getGoalProgressModel(goal(target), 0, now).daysLeft).toBe(1)
  })

  it("counts a loan due later today as due in zero days", () => {
    const now = new Date(2026, 2, 10, 23, 0)
    const due = new Date(2026, 2, 10, 8, 0)

    expect(getLoanProgressModel(loan(due), 0, now).dueDays).toBe(0)
  })
})

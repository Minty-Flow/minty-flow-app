import { describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
// Sunday-first, unlike the ISO week.
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 0 }))

import { getBudgetPeriodKey } from "~/utils/planning-progress"

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

import { describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 1 }))

import { buildStatsDateRange, navigateRange } from "~/utils/stats-date-range"

const endsAtEndOfDay = (d: Date) =>
  d.getHours() === 23 && d.getMinutes() === 59 && d.getSeconds() === 59

describe("previous period", () => {
  it("ends at the end of its last day for last 30 days", () => {
    const range = buildStatsDateRange("last30")
    expect(endsAtEndOfDay(range.previousTo)).toBe(true)
    expect(range.previousFrom.getHours()).toBe(0)
  })

  it("ends at the end of its last day for a custom range", () => {
    const range = buildStatsDateRange(
      "custom",
      new Date(2026, 2, 10),
      new Date(2026, 2, 16),
    )
    expect(endsAtEndOfDay(range.previousTo)).toBe(true)
    expect(range.previousFrom.getHours()).toBe(0)
    expect(range.previousFrom.getDate()).toBe(3)
    expect(range.previousTo.getDate()).toBe(9)
  })

  it("keeps that after navigating a custom range", () => {
    const range = buildStatsDateRange(
      "custom",
      new Date(2026, 2, 10),
      new Date(2026, 2, 16),
    )
    const next = navigateRange(range, "custom", "next")
    expect(endsAtEndOfDay(next.previousTo)).toBe(true)
    expect(next.previousFrom.getHours()).toBe(0)
  })
})

import { describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 1 }))

import {
  buildStatsDateRange,
  navigateRange,
  startAllTimeRange,
} from "~/utils/stats-date-range"

const endsAtEndOfDay = (d: Date) =>
  d.getHours() === 23 && d.getMinutes() === 59 && d.getSeconds() === 59

describe("previous period", () => {
  it("ends at the end of its last day for last 30 days", () => {
    const range = buildStatsDateRange("last30")
    expect(endsAtEndOfDay(range.previousTo)).toBe(true)
    expect(range.previousFrom.getHours()).toBe(0)
  })

  it("covers 30 calendar days with a matching previous window", () => {
    const range = buildStatsDateRange("last30")
    const dayCount = (a: Date, b: Date) =>
      Math.round(
        (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
          Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
          86_400_000,
      ) + 1
    expect(dayCount(range.from, range.to)).toBe(30)
    expect(dayCount(range.previousFrom, range.previousTo)).toBe(30)
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

describe("all time", () => {
  const allTime = buildStatsDateRange("allTime")
  const thisYear = new Date(new Date().getFullYear(), 0, 1)

  it("starts with the year of the first transaction, also before 2000", () => {
    const range = startAllTimeRange(allTime, new Date(1997, 6, 15))
    expect(range.from).toEqual(new Date(1997, 0, 1))
    // No previous period to compare against.
    expect(range.previousFrom).toEqual(range.from)
    expect(range.to).toEqual(allTime.to)
  })

  it("covers this year when there is nothing earlier", () => {
    const future = new Date(new Date().getFullYear() + 2, 0, 1)
    expect(startAllTimeRange(allTime, undefined).from).toEqual(thisYear)
    expect(startAllTimeRange(allTime, future).from).toEqual(thisYear)
  })
})

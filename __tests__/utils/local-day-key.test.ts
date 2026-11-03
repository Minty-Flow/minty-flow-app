import { describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 1 }))

import { localDayKey } from "~/utils/time-utils"

describe("localDayKey", () => {
  it("is stable across a local day", () => {
    expect(localDayKey(new Date(2026, 11, 31, 0, 0, 0))).toBe("2026-12-31")
    expect(localDayKey(new Date(2026, 11, 31, 23, 59, 59))).toBe("2026-12-31")
  })

  it("flips at local midnight, not UTC midnight", () => {
    expect(localDayKey(new Date(2026, 10, 1, 0, 0, 0))).toBe("2026-11-01")
    expect(localDayKey(new Date(2026, 9, 31, 23, 59, 59))).toBe("2026-10-31")
  })

  it("uses the calendar date across a DST change", () => {
    expect(localDayKey(new Date(2026, 2, 8, 12, 0, 0))).toBe("2026-03-08")
    expect(localDayKey(new Date(2026, 2, 9, 12, 0, 0))).toBe("2026-03-09")
  })
})

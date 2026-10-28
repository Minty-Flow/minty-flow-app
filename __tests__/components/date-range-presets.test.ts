import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("expo-localization", () => ({ getCalendars: () => [] }))
vi.mock("~/i18n/config", () => ({ default: { t: (key: string) => key } }))
vi.mock("~/stores/calendar-format.store", () => ({
  useCalendarFormatStore: { getState: () => ({}) },
}))
vi.mock("~/utils/get-week-start-on", () => ({ getWeekStartsOn: () => 1 }))

import { PRESETS } from "~/components/date-range-preset-sheet/presets"

function range(id: string) {
  const preset = PRESETS.find((p) => p.id === id)
  if (!preset) throw new Error(`no preset ${id}`)
  return preset.getRange()
}

describe("date range presets", () => {
  afterEach(() => vi.useRealTimers())

  it("follow the clock after the module has loaded", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 15, 12))
    expect(range("thisMonth").start).toEqual(new Date(2026, 0, 1))

    vi.setSystemTime(new Date(2026, 1, 10, 12))
    expect(range("thisMonth").start).toEqual(new Date(2026, 1, 1))
    expect(range("last30").end.getMonth()).toBe(1)
    expect(range("thisYear").start).toEqual(new Date(2026, 0, 1))
    expect(range("allTime").end.getMonth()).toBe(1)
  })
})

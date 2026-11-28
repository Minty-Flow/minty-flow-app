import { beforeEach, describe, expect, it, vi } from "vitest"

const getCalendars = vi.hoisted(() => vi.fn())
vi.mock("expo-localization", () => ({ getCalendars }))

import {
  forgetDeviceCalendar,
  getDeviceCalendar,
} from "~/utils/device-calendar"

beforeEach(() => {
  forgetDeviceCalendar()
  getCalendars.mockReset()
})

describe("device calendar", () => {
  it("reads the device once until told to forget", () => {
    getCalendars.mockReturnValue([{ uses24hourClock: false }])
    getDeviceCalendar()
    getCalendars.mockReturnValue([{ uses24hourClock: true }])
    expect(getDeviceCalendar()?.uses24hourClock).toBe(false)
    expect(getCalendars).toHaveBeenCalledTimes(1)

    forgetDeviceCalendar()
    expect(getDeviceCalendar()?.uses24hourClock).toBe(true)
  })

  it("reads again after a failed read", () => {
    getCalendars.mockImplementationOnce(() => {
      throw new Error("unavailable")
    })
    getCalendars.mockReturnValue([{ firstWeekday: 2 }])
    expect(() => getDeviceCalendar()).toThrow("unavailable")
    expect(getDeviceCalendar()?.firstWeekday).toBe(2)
  })
})

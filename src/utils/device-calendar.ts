import { type Calendar, getCalendars } from "expo-localization"

let cached: { calendar: Calendar | undefined } | null = null

/**
 * The device's calendar settings. Reading them is a synchronous native call
 * that list rows would otherwise make on every render, so they are cached
 * until `forgetDeviceCalendar` runs.
 */
export function getDeviceCalendar(): Calendar | undefined {
  cached ??= { calendar: getCalendars()[0] }
  return cached.calendar
}

/** Call when the settings may have changed: when the app returns to the front. */
export function forgetDeviceCalendar(): void {
  cached = null
}

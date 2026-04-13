import { getCalendars } from "expo-localization"

/**
 * Resolve the first day of the week (0=Sunday … 6=Saturday)
 * based on device region/calendar settings.
 */
export const getWeekStartsOn = (): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  // Primary: expo-localization
  try {
    const calendars = getCalendars()
    const firstWeekday = calendars[0]?.firstWeekday
    if (firstWeekday != null) {
      return ((firstWeekday - 1) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    }
  } catch {}

  // Secondary: Intl.Locale
  try {
    const locale = new Intl.Locale(
      Intl.DateTimeFormat().resolvedOptions().locale,
    )

    const weekInfo = (
      locale as unknown as {
        weekInfo?: { firstDay?: number }
      }
    ).weekInfo

    if (weekInfo?.firstDay != null) {
      const intlFirst = weekInfo.firstDay
      // ISO 8601: 1=Mon…7=Sun → date-fns: 0=Sun…6=Sat
      return (intlFirst % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    }
  } catch {}

  // Fallback: Monday
  return 1
}

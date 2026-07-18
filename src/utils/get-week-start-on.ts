import { getCalendars } from "expo-localization"

import { useWeekStartStore } from "~/stores/week-start.store"

/**
 * Resolve the first day of the week (0=Sunday … 6=Saturday).
 *
 * The user's explicit choice wins; "auto" falls back to device region/calendar
 * settings. Read via `getState()` rather than a hook because the DB layer
 * (repos, services) calls this outside React.
 */
export const getWeekStartsOn = (): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  const preference = useWeekStartStore.getState().weekStart
  if (preference === "sunday") return 0
  if (preference === "monday") return 1

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

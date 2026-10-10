import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"

import { DateFormatSheet } from "~/components/calendar-format/date-format-sheet"
import {
  SettingsOptionRow,
  SettingsRow,
  SettingsSection,
  settingsStyles,
} from "~/components/settings/settings-list"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import type { TranslationKey } from "~/i18n/config"
import {
  type ClockFormatPreference,
  useCalendarFormatStore,
} from "~/stores/calendar-format.store"
import {
  useWeekStartStore,
  type WeekStartPreference,
} from "~/stores/week-start.store"
import { getDeviceWeekStartsOn } from "~/utils/get-week-start-on"
import {
  formatClockPreview,
  formatDatePreview,
  resolveClockFormat,
} from "~/utils/time-utils"

const WEEK_DAY_OPTIONS: WeekStartPreference[] = [
  "auto",
  "saturday",
  "sunday",
  "monday",
]
const NUM_TO_WEEK_PREF: Record<number, WeekStartPreference> = {
  0: "sunday",
  1: "monday",
  6: "saturday",
}

export default function CalendarFormattingScreen() {
  const { t } = useTranslation()

  const clockFormat = useCalendarFormatStore((s) => s.clockFormat)
  const setClockFormat = useCalendarFormatStore((s) => s.setClockFormat)
  const dateStyle = useCalendarFormatStore((s) => s.dateStyle)
  const dateOrder = useCalendarFormatStore((s) => s.dateOrder)
  const [dateSheetVisible, setDateSheetVisible] = useState(false)
  const weekStart = useWeekStartStore((s) => s.weekStart)
  const setWeekStart = useWeekStartStore((s) => s.setWeekStart)
  const now = new Date()
  // "auto" highlights the format the device resolves to; "Default" for the first
  // day always names the device day, whatever is currently selected.
  const activeClock = resolveClockFormat(clockFormat)
  const deviceWeekDay = NUM_TO_WEEK_PREF[getDeviceWeekStartsOn()] ?? "monday"
  const calendarKey = (suffix: string) =>
    `screens.settings.preferences.calendarFormat.${suffix}` as TranslationKey

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <SettingsSection title={t(calendarKey("clock.label"))}>
        {(["12h", "24h"] as const).map((format) => (
          <SettingsOptionRow
            key={format}
            label={t(calendarKey(`clock.${format}`))}
            description={formatClockPreview(now, format)}
            selected={activeClock === format}
            onPress={() => setClockFormat(format as ClockFormatPreference)}
          />
        ))}
      </SettingsSection>

      <SettingsSection title={t(calendarKey("date.label"))}>
        <SettingsRow
          label={t(calendarKey("date.label"))}
          description={formatDatePreview(now, dateStyle, dateOrder)}
          onPress={() => setDateSheetVisible(true)}
          trailing={<ChevronIcon direction="trailing" size={20} />}
        />
      </SettingsSection>

      <SettingsSection title={t(calendarKey("firstDay.label"))}>
        {WEEK_DAY_OPTIONS.map((option) => (
          <SettingsOptionRow
            key={option}
            label={
              option === "auto"
                ? t(calendarKey("firstDay.default"))
                : t(
                    `screens.settings.preferences.weekStart.${option}` as TranslationKey,
                  )
            }
            description={
              option === "auto"
                ? t(
                    `screens.settings.preferences.weekStart.${deviceWeekDay}` as TranslationKey,
                  )
                : undefined
            }
            selected={weekStart === option}
            onPress={() => setWeekStart(option)}
          />
        ))}
      </SettingsSection>

      <DateFormatSheet
        visible={dateSheetVisible}
        onClose={() => setDateSheetVisible(false)}
      />
    </ScrollView>
  )
}

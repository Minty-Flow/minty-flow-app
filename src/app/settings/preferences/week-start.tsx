import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ToggleItem } from "~/components/toggle-item"
import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"
import type { TranslationKey } from "~/i18n/config"
import {
  useWeekStartStore,
  type WeekStartPreference,
} from "~/stores/week-start.store"
import { getWeekStartsOn } from "~/utils/get-week-start-on"

const DAY_OPTIONS: {
  value: WeekStartPreference
  labelKey: TranslationKey
}[] = [
  {
    value: "saturday",
    labelKey: "screens.settings.preferences.weekStart.saturday",
  },
  {
    value: "sunday",
    labelKey: "screens.settings.preferences.weekStart.sunday",
  },
  {
    value: "monday",
    labelKey: "screens.settings.preferences.weekStart.monday",
  },
]

const NUM_TO_PREF: Record<number, WeekStartPreference> = {
  0: "sunday",
  1: "monday",
  6: "saturday",
}

export default function WeekStartScreen() {
  const { t } = useTranslation()
  const weekStart = useWeekStartStore((s) => s.weekStart)
  const setWeekStart = useWeekStartStore((s) => s.setWeekStart)

  const isAuto = weekStart === "auto"

  // When auto, resolve the device day so the matching chip stays highlighted
  const resolvedDay = useMemo(() => {
    if (!isAuto) return weekStart
    return NUM_TO_PREF[getWeekStartsOn()] ?? "monday"
  }, [isAuto, weekStart])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <ToggleItem
          icon="calendar-week"
          title={t("screens.settings.preferences.weekStart.useDeviceSetting")}
          description={t(
            "screens.settings.preferences.weekStart.basedOnDevice",
          )}
          value={isAuto}
          onValueChange={(auto) => {
            if (auto) {
              setWeekStart("auto")
            } else {
              // Switch to the resolved day so toggle-off is intuitive
              setWeekStart(NUM_TO_PREF[getWeekStartsOn()] ?? "monday")
            }
          }}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.chipsRow}>
          {DAY_OPTIONS.map((option) => {
            const selected = option.value === resolvedDay
            return (
              <Chip
                key={option.value}
                label={t(option.labelKey)}
                selected={selected}
                hideCheck
                disabled={isAuto}
                onPress={() => setWeekStart(option.value)}
                style={isAuto ? styles.chipAuto : undefined}
              />
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingTop: 16,
    gap: 12,
  },
  section: {
    marginVertical: 6,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  chipAuto: {
    opacity: 0.55,
  },
}))

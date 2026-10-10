import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { MonthPickerSheet } from "~/components/month-picker-sheet"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { clampYear } from "~/components/year-picker-sheet"
import type { StatsDateRange } from "~/types/stats"
import { canNavigate, formatNavigatorLabel } from "~/utils/stats-date-range"
import type { DateRangePresetId } from "~/utils/time-utils"
import { getDisplayMonthTitle } from "~/utils/time-utils"

interface MonthYearPickerProps {
  initialYear: number
  initialMonth: number
  onSelect: (year: number, month: number) => void
  /** Optional: preset-aware mode for stats page integration */
  activePreset?: DateRangePresetId
  dateRange?: StatsDateRange
  onNavigate?: (direction: "prev" | "next") => void
  /** Let the month sheet pick future months (scheduled/upcoming screens). */
  allowFuture?: boolean
}
export function MonthYearPicker({
  initialYear,
  initialMonth,
  onSelect,
  activePreset,
  dateRange,
  onNavigate,
  allowFuture = false,
}: MonthYearPickerProps) {
  const { t } = useTranslation()
  const [monthSheetVisible, setMonthSheetVisible] = useState(false)
  const [localYear, setLocalYear] = useState(() => initialYear)
  const [localMonth, setLocalMonth] = useState(() => initialMonth)
  // Preset-aware mode
  const isPresetMode = activePreset !== undefined && dateRange !== undefined
  const navigable = isPresetMode ? canNavigate(activePreset) : true
  // Compute pill label
  const pillLabel = isPresetMode
    ? activePreset === "last30"
      ? t("components.dateRange.presets.last30")
      : activePreset === "allTime"
        ? t("components.dateRange.presets.allTime")
        : formatNavigatorLabel(dateRange, activePreset)
    : getDisplayMonthTitle(localYear, localMonth)
  // Navigation handlers
  const goPrev = () => {
    if (isPresetMode && onNavigate) {
      onNavigate("prev")
      return
    }
    // Legacy month navigation
    if (localMonth === 0) {
      const newYear = clampYear(localYear - 1)
      setLocalMonth(11)
      setLocalYear(newYear)
      onSelect(newYear, 11)
    } else {
      const newMonth = localMonth - 1
      setLocalMonth(newMonth)
      onSelect(localYear, newMonth)
    }
  }
  const goNext = () => {
    if (isPresetMode && onNavigate) {
      onNavigate("next")
      return
    }
    // Legacy month navigation
    if (localMonth === 11) {
      const newYear = clampYear(localYear + 1)
      setLocalMonth(0)
      setLocalYear(newYear)
      onSelect(newYear, 0)
    } else {
      const newMonth = localMonth + 1
      setLocalMonth(newMonth)
      onSelect(localYear, newMonth)
    }
  }
  const handleSheetSelect = (year: number, month: number) => {
    setLocalYear(year)
    setLocalMonth(month)
    onSelect(year, month)
  }
  return (
    <>
      {/* Top row: chevrons + pill */}
      <View style={styles.topRow}>
        {navigable && (
          <Button variant="secondary" size="icon" onPress={goPrev}>
            <ChevronIcon direction="leading" size={24} />
          </Button>
        )}

        <Pressable
          style={styles.pill}
          onPress={() => setMonthSheetVisible(true)}
        >
          <Text style={styles.pillText} numberOfLines={1}>
            {pillLabel}
          </Text>
        </Pressable>

        {navigable && (
          <Button variant="secondary" size="icon" onPress={goNext}>
            <ChevronIcon direction="trailing" size={24} />
          </Button>
        )}
      </View>

      <MonthPickerSheet
        visible={monthSheetVisible}
        year={localYear}
        month={localMonth}
        onSelect={handleSheetSelect}
        allowFuture={allowFuture}
        onClose={() => setMonthSheetVisible(false)}
      />
    </>
  )
}
const styles = StyleSheet.create((theme) => ({
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  pill: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: theme.radius,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
}))

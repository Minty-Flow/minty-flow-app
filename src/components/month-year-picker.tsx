import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { Keyboard } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { MonthGrid } from "~/components/month-grid"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { StatsDateRange } from "~/types/stats"
import { canNavigate, formatNavigatorLabel } from "~/utils/stats-date-range"
import type { DateRangePresetId } from "~/utils/time-utils"
import { getDisplayMonthTitle } from "~/utils/time-utils"

interface MonthYearPickerProps {
  initialYear: number
  initialMonth: number
  onSelect: (year: number, month: number) => void
  onNow?: () => void
  onDone?: () => void
  /** Optional: preset-aware mode for stats page integration */
  activePreset?: DateRangePresetId
  dateRange?: StatsDateRange
  onNavigate?: (direction: "prev" | "next") => void
}

const MIN_YEAR = 1970
const MAX_YEAR = 2100

function clampYear(y: number) {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, y))
}

export function MonthYearPicker({
  initialYear,
  initialMonth,
  onSelect,
  onNow,
  onDone,
  activePreset,
  dateRange,
  onNavigate,
}: MonthYearPickerProps) {
  const { t } = useTranslation()

  const [monthPickerOpen, setMonthPickerOpen] = useState(false)
  const [localYear, setLocalYear] = useState(() => initialYear)
  const [localMonth, setLocalMonth] = useState(() => initialMonth)
  const [yearInputValue, setYearInputValue] = useState(() =>
    String(initialYear),
  )

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
  const goPrev = useCallback(() => {
    if (isPresetMode && onNavigate) {
      onNavigate("prev")
      return
    }

    // Legacy month navigation
    if (localMonth === 0) {
      const newYear = clampYear(localYear - 1)
      setLocalMonth(11)
      setLocalYear(newYear)
      setYearInputValue(String(newYear))
      onSelect(newYear, 11)
    } else {
      const newMonth = localMonth - 1
      setLocalMonth(newMonth)
      onSelect(localYear, newMonth)
    }
  }, [isPresetMode, onNavigate, localMonth, localYear, onSelect])

  const goNext = useCallback(() => {
    if (isPresetMode && onNavigate) {
      onNavigate("next")
      return
    }

    // Legacy month navigation
    if (localMonth === 11) {
      const newYear = clampYear(localYear + 1)
      setLocalMonth(0)
      setLocalYear(newYear)
      setYearInputValue(String(newYear))
      onSelect(newYear, 0)
    } else {
      const newMonth = localMonth + 1
      setLocalMonth(newMonth)
      onSelect(localYear, newMonth)
    }
  }, [isPresetMode, onNavigate, localMonth, localYear, onSelect])

  // Inline picker handlers
  const handleMonthPress = useCallback((monthIndex: number) => {
    setLocalMonth(monthIndex)
  }, [])

  const handleYearChange = useCallback((year: number) => {
    setLocalYear(year)
    setYearInputValue(String(year))
  }, [])

  const handleNow = useCallback(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()

    setLocalYear(y)
    setLocalMonth(m)
    setYearInputValue(String(y))

    onNow?.()
  }, [onNow])

  const handleDone = useCallback(() => {
    Keyboard.dismiss()

    const y = clampYear(parseInt(yearInputValue, 10) || localYear)

    setLocalYear(y)
    setYearInputValue(String(y))

    onSelect(y, localMonth)
    onDone?.()

    setMonthPickerOpen(false)
  }, [yearInputValue, localYear, localMonth, onSelect, onDone])

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
          onPress={() => setMonthPickerOpen((v) => !v)}
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

      {/* Inline month picker */}
      {monthPickerOpen && (
        <View style={styles.pickerContainer}>
          <MonthGrid
            year={localYear}
            yearInput={yearInputValue}
            month={localMonth}
            onYearInputChange={setYearInputValue}
            onYearChange={handleYearChange}
            onMonthChange={handleMonthPress}
            onNow={handleNow}
            onDone={handleDone}
          />
        </View>
      )}
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

  pickerContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    paddingTop: 0,
    overflow: "hidden",
  },
}))

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { DateRangePresetSheet } from "~/components/date-range-preset-sheet"
import { MonthYearPicker } from "~/components/month-year-picker"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { StatsDateRange } from "~/types/stats"
import { formatRangeLabel } from "~/utils/stats-date-range"
import type { DateRangePresetId } from "~/utils/time-utils"

interface StatsPeriodHeaderProps {
  activeYear: number
  activeMonth: number
  activePreset: DateRangePresetId
  dateRange: StatsDateRange
  setMonthRange: (year: number, month: number) => void
  setCustomRange: (from: Date, to: Date, source?: DateRangePresetId) => void
  navigate: (direction: "prev" | "next") => void
}

export function StatsPeriodHeader({
  activeYear,
  activeMonth,
  activePreset,
  dateRange,
  setMonthRange,
  setCustomRange,
  navigate,
}: StatsPeriodHeaderProps) {
  const { t } = useTranslation()
  const [sheetVisible, setSheetVisible] = useState(false)

  return (
    <>
      <MonthYearPicker
        initialYear={activeYear}
        initialMonth={activeMonth}
        onSelect={setMonthRange}
        activePreset={activePreset}
        dateRange={dateRange}
        onNavigate={navigate}
      />

      <View style={styles.moreOptionsRow}>
        <Text variant="muted" style={styles.rangeLabel}>
          {formatRangeLabel(dateRange)}
        </Text>
        <Button variant="ghost" onPress={() => setSheetVisible(true)}>
          <Text style={styles.moreOptionsText}>
            {t("screens.stats.moreOptions")}
          </Text>
        </Button>
      </View>

      <DateRangePresetSheet
        visible={sheetVisible}
        initialStart={dateRange.from}
        initialEnd={dateRange.to}
        onSave={(start, end, source) => {
          setCustomRange(start, end, source)
          setSheetVisible(false)
        }}
        onRequestClose={() => setSheetVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  moreOptionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  rangeLabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
  },
  moreOptionsText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
  },
}))

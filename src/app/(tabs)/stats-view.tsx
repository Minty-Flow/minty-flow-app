import { useState } from "react"
import { useTranslation } from "react-i18next"
import { RefreshControl, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DateRangePresetModal } from "~/components/date-range-preset-modal"
import { MonthYearPicker } from "~/components/month-year-picker"
import { CurrencyStatSection } from "~/components/stats/currency-stat-section"
import { StatsEmptyState } from "~/components/stats/stats-empty-state"
import { StatsSkeleton } from "~/components/stats/stats-skeleton"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useStats } from "~/hooks/use-stats"
import { formatRangeLabel } from "~/utils/stats-date-range"

export default function StatsScreen() {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
  const {
    byCurrency,
    supplementByCurrency,
    isLoading,
    dateRange,
    activeYear,
    activeMonth,
    setMonthRange,
    setCustomRange,
    refetch,
  } = useStats()

  const [modalVisible, setModalVisible] = useState(false)

  const isFirstLoad = isLoading && byCurrency.length === 0
  const hasNoData = !isLoading && byCurrency.length === 0

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        style={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && byCurrency.length > 0}
            onRefresh={refetch}
            tintColor={theme.colors.onPrimary}
            colors={[theme.colors.onPrimary]}
          />
        }
      >
        {/* Month navigation */}
        <MonthYearPicker
          initialYear={activeYear}
          initialMonth={activeMonth}
          onSelect={setMonthRange}
        />

        {/* More options row */}
        <View style={styles.moreOptionsRow}>
          <Text variant="muted" style={styles.rangeLabel}>
            {formatRangeLabel(dateRange)}
          </Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.moreOptionsText}>
              {t("screens.stats.moreOptions")}
            </Text>
          </Pressable>
        </View>

        {/* Loading skeleton on first load */}
        {isFirstLoad && <StatsSkeleton />}

        {/* No data at all */}
        {hasNoData && (
          <StatsEmptyState
            rangeLabel={formatRangeLabel(dateRange)}
            scenario="noTransactionsEver"
          />
        )}

        {/* One section per currency */}
        {byCurrency.map((stats, index) => (
          <CurrencyStatSection
            key={stats.currency}
            stats={stats}
            dateRange={dateRange}
            isFirst={index === 0}
            supplement={supplementByCurrency.find(
              (s) => s.currency === stats.currency,
            )}
          />
        ))}

        {/* Bottom padding for tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <DateRangePresetModal
        visible={modalVisible}
        initialStart={dateRange.from}
        initialEnd={dateRange.to}
        onSave={(start, end) => {
          setCustomRange(start, end)
          setModalVisible(false)
        }}
        onRequestClose={() => setModalVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    marginTop: 50,
    gap: 8,
  },
  moreOptionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  rangeLabel: {
    fontSize: theme.typography.bodyMedium.fontSize,
  },
  moreOptionsText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 100,
  },
}))

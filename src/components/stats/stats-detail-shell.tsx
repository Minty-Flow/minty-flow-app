import { isValid } from "date-fns"
import { useLocalSearchParams } from "expo-router"
import { type ReactNode, useState } from "react"
import { RefreshControl, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { View } from "~/components/ui/view"
import { type UseStatsInit, useStats } from "~/hooks/use-stats"
import type {
  CurrencyStats,
  StatsDateRange,
  StatsSupplement,
} from "~/types/stats"
import { formatRangeLabel } from "~/utils/stats-date-range"
import type { DateRangePresetId } from "~/utils/time-utils"

import { CurrencySwitcher } from "./currency-switcher"
import { StatsEmptyState } from "./stats-empty-state"
import { StatsPeriodHeader } from "./stats-period-header"
import { StatsSkeleton } from "./stats-skeleton"

interface StatsDetailContext {
  stats: CurrencyStats
  supplement: StatsSupplement | undefined
  dateRange: StatsDateRange
  isLoading: boolean
}

interface StatsDetailShellProps {
  /** Overrides route params (e.g. net-worth/calendar force thisYear) */
  init?: UseStatsInit
  children: (ctx: StatsDetailContext) => ReactNode
}

/**
 * Keyed by the union so a newly added preset fails to compile here rather than
 * silently degrading its deep link to `thisMonth`.
 */
const PRESET_IDS: Record<DateRangePresetId, true> = {
  last30: true,
  thisWeek: true,
  thisMonth: true,
  thisYear: true,
  allTime: true,
  byMonth: true,
  byYear: true,
  custom: true,
}

function toPreset(value: string | undefined): DateRangePresetId | undefined {
  // `hasOwn`, not `in` — the latter walks the prototype, so `?preset=toString`
  // would pass and throw out of `buildStatsDateRange`'s exhaustive default.
  return value && Object.hasOwn(PRESET_IDS, value)
    ? (value as DateRangePresetId)
    : undefined
}

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return isValid(date) ? date : undefined
}

/**
 * Reads { preset, from, to } route params pushed by the dashboard cards.
 *
 * Deep links reach here too, so the params are untrusted: an unknown preset
 * throws out of `buildStatsDateRange`'s exhaustive default during render, and an
 * unparseable date yields NaN fields. Falling back to `undefined` lets
 * `buildInitialState` default to `thisMonth`.
 */
function useStatsInitFromParams(): UseStatsInit {
  const params = useLocalSearchParams<{
    preset?: string
    from?: string
    to?: string
  }>()
  return {
    preset: toPreset(params.preset),
    from: toDate(params.from),
    to: toDate(params.to),
  }
}

export function StatsDetailShell({ init, children }: StatsDetailShellProps) {
  const { theme } = useUnistyles()
  const paramsInit = useStatsInitFromParams()
  const {
    byCurrency,
    supplementByCurrency,
    isLoading,
    dateRange,
    activePreset,
    activeYear,
    activeMonth,
    setMonthRange,
    setCustomRange,
    navigate,
    refetch,
  } = useStats(init ?? paramsInit)

  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)

  const stats =
    byCurrency.find((s) => s.currency === selectedCurrency) ?? byCurrency[0]
  const supplement = stats
    ? supplementByCurrency.find((s) => s.currency === stats.currency)
    : undefined

  const isFirstLoad = isLoading && byCurrency.length === 0
  const hasNoData = !isLoading && byCurrency.length === 0

  return (
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
      <StatsPeriodHeader
        activeYear={activeYear}
        activeMonth={activeMonth}
        activePreset={activePreset}
        dateRange={dateRange}
        setMonthRange={setMonthRange}
        setCustomRange={setCustomRange}
        navigate={navigate}
      />

      {isFirstLoad && <StatsSkeleton />}

      {hasNoData && (
        <StatsEmptyState rangeLabel={formatRangeLabel(dateRange)} />
      )}

      {stats && (
        <>
          <CurrencySwitcher
            currencies={byCurrency.map((s) => s.currency)}
            value={stats.currency}
            onChange={setSelectedCurrency}
          />
          <View style={styles.body}>
            {children({ stats, supplement, dateRange, isLoading })}
          </View>
        </>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    gap: 6,
    paddingTop: 8,
  },
  body: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomSpacer: {
    height: 40,
  },
}))

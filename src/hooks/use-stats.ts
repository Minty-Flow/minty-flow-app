import { addWeeks } from "date-fns"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { on } from "~/database/events"
import { fetchAllStatsData } from "~/database/services-sqlite/stats-service"
import { useDebouncedCallback } from "~/hooks/use-debounced-callback"
import { useAccounts } from "~/stores/db/account.store"
import { useWeekStartStore } from "~/stores/week-start.store"
import type { Account } from "~/types/accounts"
import type {
  CurrencyStats,
  StatsDateRange,
  StatsDateRangePreset,
  StatsSupplement,
} from "~/types/stats"
import { getWeekStartsOn } from "~/utils/get-week-start-on"
import {
  buildMonthRange,
  buildStatsDateRange,
  navigateRange,
} from "~/utils/stats-date-range"
import type { DateRangePresetId } from "~/utils/time-utils"
export interface UseStatsInit {
  preset?: DateRangePresetId
  from?: Date
  to?: Date
}
interface UseStatsReturn {
  byCurrency: CurrencyStats[]
  supplementByCurrency: StatsSupplement[]
  isLoading: boolean
  dateRange: StatsDateRange
  activePreset: DateRangePresetId
  activeYear: number
  activeMonth: number
  setPreset: (preset: StatsDateRangePreset) => void
  setCustomRange: (from: Date, to: Date, source?: DateRangePresetId) => void
  setMonthRange: (year: number, month: number) => void
  navigate: (direction: "prev" | "next") => void
  refetch: () => Promise<void>
}
function computeSupplements(accounts: Account[]): StatsSupplement[] {
  const currencySet = new Set(accounts.map((a) => a.currencyCode))
  const supplements: StatsSupplement[] = []
  for (const currency of currencySet) {
    const currencyAccounts = accounts.filter((a) => a.currencyCode === currency)
    const included = currencyAccounts.filter((a) => !a.excludeFromBalance)
    const currentNetBalance = included.reduce((s, a) => s + a.balance, 0)
    supplements.push({
      currency,
      currentNetBalance,
      accountBalanceSummary: currencyAccounts.map((a) => ({
        accountId: a.id,
        accountName: a.name,
        balance: a.balance,
        excludeFromBalance: a.excludeFromBalance,
        icon: a.icon,
        colorSchemeName: a.colorSchemeName,
      })),
    })
  }
  return supplements
}
function buildInitialState(init?: UseStatsInit): {
  preset: DateRangePresetId
  range: StatsDateRange
} {
  const { preset, from, to } = init ?? {}
  if (!preset)
    return { preset: "thisMonth", range: buildStatsDateRange("thisMonth") }
  if (preset === "byMonth" && from) {
    return {
      preset,
      range: buildMonthRange(from.getFullYear(), from.getMonth()),
    }
  }
  if ((preset === "byYear" || preset === "custom") && from && to) {
    return { preset, range: buildStatsDateRange("custom", from, to) }
  }
  if (preset === "byMonth" || preset === "byYear" || preset === "custom") {
    return { preset: "thisMonth", range: buildStatsDateRange("thisMonth") }
  }
  return { preset, range: buildStatsDateRange(preset) }
}
export function useStats(init?: UseStatsInit): UseStatsReturn {
  const [activeYear, setActiveYear] = useState(() =>
    (init?.from ?? new Date()).getFullYear(),
  )
  const [activeMonth, setActiveMonth] = useState(() =>
    (init?.from ?? new Date()).getMonth(),
  )
  const [initial] = useState(() => buildInitialState(init))
  const [activePreset, setActivePreset] = useState<DateRangePresetId>(
    initial.preset,
  )
  const [range, setRange] = useState<StatsDateRange>(initial.range)
  const [weekAnchor, setWeekAnchor] = useState(() =>
    initial.preset === "thisWeek"
      ? initial.range.from
      : (init?.from ?? new Date()),
  )
  const [byCurrency, setByCurrency] = useState<CurrencyStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchIdRef = useRef(0)
  const activeFetchCountRef = useRef(0)
  const accounts = useAccounts()
  const supplementByCurrency = computeSupplements(accounts)
  const _weekStart = useWeekStartStore((s) => s.weekStart)
  const weekStartsOn = getWeekStartsOn()
  const dateRange = useMemo(
    () =>
      activePreset === "thisWeek"
        ? buildStatsDateRange(
            "thisWeek",
            undefined,
            undefined,
            weekAnchor,
            weekStartsOn,
          )
        : range,
    [activePreset, range, weekAnchor, weekStartsOn],
  )
  const fetchData = useCallback(async (range: StatsDateRange) => {
    const fetchId = ++fetchIdRef.current
    activeFetchCountRef.current++

    // Move what was in `finally` into a small helper so we don't repeat ourselves
    const finalizeFetch = () => {
      activeFetchCountRef.current = Math.max(0, activeFetchCountRef.current - 1)
      setIsLoading(activeFetchCountRef.current > 0)
    }

    try {
      const stats = await fetchAllStatsData(range)

      // Cleanup for the success path
      finalizeFetch()

      if (fetchIdRef.current !== fetchId) return
      setByCurrency(stats)
    } catch (error) {
      // Cleanup for the error path
      finalizeFetch()
      throw error
    }
  }, [])
  const debouncedFetch = useDebouncedCallback(fetchData, 300)
  // Initial and range-driven fetch
  useEffect(() => {
    void fetchData(dateRange)
  }, [dateRange, fetchData])
  // Re-fetch stats on any relevant DB change
  useEffect(() => {
    const refresh = () => {
      setIsLoading(true)
      debouncedFetch(dateRange)
    }
    const unsub1 = on("transactions:dirty", refresh)
    const unsub2 = on("accounts:dirty", refresh)
    const unsub3 = on("tags:dirty", refresh)
    const unsub4 = on("categories:dirty", refresh)
    const unsub5 = on("db:reset", refresh)
    return () => {
      fetchIdRef.current++
      unsub1()
      unsub2()
      unsub3()
      unsub4()
      unsub5()
    }
  }, [dateRange, debouncedFetch])
  const setPreset = (preset: StatsDateRangePreset) => {
    setIsLoading(true)
    setActivePreset(preset)
    if (preset === "thisWeek") {
      setWeekAnchor(new Date())
    } else {
      setRange(buildStatsDateRange(preset))
    }
  }
  const setCustomRange = (from: Date, to: Date, source?: DateRangePresetId) => {
    setIsLoading(true)
    const mappedPreset: StatsDateRangePreset =
      source === "thisWeek" ||
      source === "thisMonth" ||
      source === "thisYear" ||
      source === "last30" ||
      source === "allTime"
        ? source
        : "custom"
    setActivePreset(source ?? "custom")
    // `byMonth` must route through `buildMonthRange` exactly as
    // `buildInitialState` does, or the tab and the detail screen it opens
    // disagree on interval and previous-period for the same month.
    if (source === "byMonth") {
      setRange(buildMonthRange(from.getFullYear(), from.getMonth()))
    } else if (mappedPreset === "thisWeek") {
      setWeekAnchor(new Date(from))
    } else if (mappedPreset !== "custom") {
      setRange(buildStatsDateRange(mappedPreset))
    } else {
      setRange(buildStatsDateRange("custom", from, to))
    }
    setActiveYear(from.getFullYear())
    setActiveMonth(from.getMonth())
  }
  const setMonthRange = (year: number, month: number) => {
    setIsLoading(true)
    setActiveYear(year)
    setActiveMonth(month)
    setActivePreset("byMonth")
    setRange(buildMonthRange(year, month))
  }
  const navigate = (direction: "prev" | "next") => {
    setIsLoading(true)
    if (activePreset === "thisWeek") {
      setWeekAnchor((prev) => addWeeks(prev, direction === "next" ? 1 : -1))
      return
    }
    setRange((prev) => navigateRange(prev, activePreset, direction))
  }
  const refetch = () => {
    setIsLoading(true)
    return fetchData(dateRange)
  }
  return {
    byCurrency,
    supplementByCurrency,
    isLoading,
    dateRange,
    activePreset,
    activeYear,
    activeMonth,
    setPreset,
    setCustomRange,
    setMonthRange,
    navigate,
    refetch,
  }
}

import { useCallback, useEffect, useRef, useState } from "react"

import { on } from "~/database/events"
import { fetchAllStatsData } from "~/database/services-sqlite/stats-service"
import { useAccounts } from "~/stores/db/account.store"
import { useWeekStartStore } from "~/stores/week-start.store"
import type { Account } from "~/types/accounts"
import type {
  CurrencyStats,
  StatsDateRange,
  StatsDateRangePreset,
  StatsSupplement,
} from "~/types/stats"
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
  const [dateRange, setDateRange] = useState<StatsDateRange>(initial.range)
  const [byCurrency, setByCurrency] = useState<CurrencyStats[]>([])
  const [supplementByCurrency, setSupplementByCurrency] = useState<
    StatsSupplement[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fetchIdRef = useRef(0)

  const accounts = useAccounts()

  const fetchData = useCallback(async (range: StatsDateRange) => {
    const fetchId = ++fetchIdRef.current
    setIsLoading(true)
    try {
      const stats = await fetchAllStatsData(range)
      if (fetchIdRef.current !== fetchId) return
      setByCurrency(stats)
    } finally {
      if (fetchIdRef.current === fetchId) setIsLoading(false)
    }
  }, [])

  const debouncedFetch = useCallback(
    (range: StatsDateRange) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => fetchData(range), 300)
    },
    [fetchData],
  )

  // `thisWeek` is the one preset whose boundaries move when the week-start
  // setting changes; every other range is week-agnostic, and week *buckets*
  // inside a range are recomputed by the refetch the store already triggers.
  const weekStart = useWeekStartStore((s) => s.weekStart)
  const prevWeekStartRef = useRef(weekStart)
  useEffect(() => {
    if (prevWeekStartRef.current === weekStart) return
    prevWeekStartRef.current = weekStart
    if (activePreset === "thisWeek") {
      setDateRange(buildStatsDateRange("thisWeek"))
    }
  }, [weekStart, activePreset])

  // Initial and range-driven fetch
  useEffect(() => {
    fetchData(dateRange)
  }, [dateRange, fetchData])

  // Supplements reactively follow account store (already Zustand-reactive)
  useEffect(() => {
    setSupplementByCurrency(computeSupplements(accounts))
  }, [accounts])

  // Re-fetch stats on any relevant DB change
  useEffect(() => {
    const unsub1 = on("transactions:dirty", () => debouncedFetch(dateRange))
    const unsub2 = on("accounts:dirty", () => debouncedFetch(dateRange))
    const unsub3 = on("tags:dirty", () => debouncedFetch(dateRange))
    const unsub4 = on("db:reset", () => debouncedFetch(dateRange))
    return () => {
      fetchIdRef.current++
      unsub1()
      unsub2()
      unsub3()
      unsub4()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [dateRange, debouncedFetch])

  const setPreset = useCallback((preset: StatsDateRangePreset) => {
    setActivePreset(preset)
    setDateRange(buildStatsDateRange(preset))
  }, [])

  const setCustomRange = useCallback(
    (from: Date, to: Date, source?: DateRangePresetId) => {
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
        setDateRange(buildMonthRange(from.getFullYear(), from.getMonth()))
      } else if (mappedPreset !== "custom") {
        setDateRange(buildStatsDateRange(mappedPreset))
      } else {
        setDateRange(buildStatsDateRange("custom", from, to))
      }

      setActiveYear(from.getFullYear())
      setActiveMonth(from.getMonth())
    },
    [],
  )

  const setMonthRange = useCallback((year: number, month: number) => {
    setActiveYear(year)
    setActiveMonth(month)
    setActivePreset("byMonth")
    setDateRange(buildMonthRange(year, month))
  }, [])

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      setDateRange((prev) => navigateRange(prev, activePreset, direction))
    },
    [activePreset],
  )

  const refetch = useCallback(
    () => fetchData(dateRange),
    [dateRange, fetchData],
  )

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

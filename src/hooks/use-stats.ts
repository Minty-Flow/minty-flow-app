import { useCallback, useEffect, useRef, useState } from "react"

import { on } from "~/database/events"
import { fetchAllStatsData } from "~/database/services-sqlite/stats-service"
import { useAccounts } from "~/stores/db/account.store"
import type { Account } from "~/types/accounts"
import type {
  CurrencyStats,
  StatsDateRange,
  StatsDateRangePreset,
  StatsSupplement,
} from "~/types/stats"
import { buildMonthRange, buildStatsDateRange } from "~/utils/stats-date-range"

interface UseStatsReturn {
  byCurrency: CurrencyStats[]
  supplementByCurrency: StatsSupplement[]
  isLoading: boolean
  dateRange: StatsDateRange
  activeYear: number
  activeMonth: number
  setPreset: (preset: StatsDateRangePreset) => void
  setCustomRange: (from: Date, to: Date) => void
  setMonthRange: (year: number, month: number) => void
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

export function useStats(): UseStatsReturn {
  const now = new Date()
  const [activeYear, setActiveYear] = useState(() => now.getFullYear())
  const [activeMonth, setActiveMonth] = useState(() => now.getMonth())
  const [dateRange, setDateRange] = useState<StatsDateRange>(() =>
    buildStatsDateRange("thisMonth"),
  )
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
    setDateRange(buildStatsDateRange(preset))
  }, [])

  const setCustomRange = useCallback((from: Date, to: Date) => {
    setDateRange(buildStatsDateRange("custom", from, to))
    setActiveYear(from.getFullYear())
    setActiveMonth(from.getMonth())
  }, [])

  const setMonthRange = useCallback((year: number, month: number) => {
    setActiveYear(year)
    setActiveMonth(month)
    setDateRange(buildMonthRange(year, month))
  }, [])

  const refetch = useCallback(
    () => fetchData(dateRange),
    [dateRange, fetchData],
  )

  return {
    byCurrency,
    supplementByCurrency,
    isLoading,
    dateRange,
    activeYear,
    activeMonth,
    setPreset,
    setCustomRange,
    setMonthRange,
    refetch,
  }
}

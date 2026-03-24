import { useCallback, useEffect, useRef, useState } from "react"

import { database } from "~/database"
import type AccountModel from "~/database/models/account"
import { fetchAllStatsData } from "~/database/services/stats-service"
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

function computeSupplements(accounts: AccountModel[]): StatsSupplement[] {
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
  const mountedRef = useRef(true)

  const fetchData = useCallback(async (range: StatsDateRange) => {
    setIsLoading(true)
    try {
      const stats = await fetchAllStatsData(range)
      if (!mountedRef.current) return
      setByCurrency(stats)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  const debouncedFetch = useCallback(
    (range: StatsDateRange) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetchData(range)
      }, 300)
    },
    [fetchData],
  )

  useEffect(() => {
    fetchData(dateRange)
  }, [dateRange, fetchData])

  // Reactively observe accounts so color/icon changes propagate immediately
  useEffect(() => {
    const subscription = database
      .get<AccountModel>("accounts")
      .query()
      .observe()
      .subscribe((accounts) => {
        setSupplementByCurrency(computeSupplements(accounts))
      })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    mountedRef.current = true

    const subscription = database
      .withChangesForTables(["transactions", "accounts", "transaction_tags"])
      .subscribe(() => {
        debouncedFetch(dateRange)
      })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
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

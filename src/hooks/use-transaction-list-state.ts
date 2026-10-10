import { useCallback, useRef, useState } from "react"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"

import type {
  SearchState,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import {
  DEFAULT_SEARCH_STATE,
  DEFAULT_TRANSACTION_LIST_FILTER_STATE,
} from "~/types/transaction-filters"
import { getMonthRange } from "~/utils/time-utils"

/** Filter + search state behind a `TransactionFilterHeader`, plus its show/hide toggle. */
export function useTransactionListFilters() {
  const [filterState, setFilterState] = useState<TransactionListFilterState>(
    DEFAULT_TRANSACTION_LIST_FILTER_STATE,
  )
  const [searchState, setSearchState] =
    useState<SearchState>(DEFAULT_SEARCH_STATE)
  const [showFilters, setShowFilters] = useState(false)
  const toggleFilters = useCallback(() => setShowFilters((v) => !v), [])
  return {
    filterState,
    setFilterState,
    searchState,
    setSearchState,
    showFilters,
    toggleFilters,
  }
}

/** Month picked in a `MonthYearPicker` (defaults to the current month) and its ISO bounds. */
export function useSelectedMonth() {
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const { fromDate, toDate } = getMonthRange(year, month)
  return {
    year,
    month,
    onSelect: (y: number, m: number) => {
      setYear(y)
      setMonth(m)
    },
    from: new Date(fromDate).toISOString(),
    to: new Date(toDate).toISOString(),
  }
}

/** Keeps at most one swipeable row open: opening a row closes the previous one. */
export function useSingleOpenSwipeable() {
  const openRef = useRef<SwipeableMethods | null>(null)
  const onWillOpen = useCallback((methods: SwipeableMethods) => {
    if (openRef.current !== methods) openRef.current?.close()
    openRef.current = methods
  }, [])
  const closeOpen = useCallback(() => openRef.current?.close(), [])
  return { onWillOpen, closeOpen }
}

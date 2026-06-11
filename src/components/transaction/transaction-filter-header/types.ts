import type { Account } from "~/types/accounts"
import type { Category } from "~/types/categories"
import type { Tag } from "~/types/tags"
import type {
  SearchMatchType,
  SearchState,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import type { TransactionType } from "~/types/transactions"

export type FilterPanelKey =
  | "search"
  | "accounts"
  | "categories"
  | "tags"
  | "pending"
  | "type"
  | "groupBy"
  | "attachments"
  | "currency"

export const EMPTY_HIDDEN_FILTERS: FilterPanelKey[] = []

export const CHIPS_PER_ROW = 4

export const SEARCH_MATCH_OPTIONS: { id: SearchMatchType; label: string }[] = [
  { id: "smart", label: "Smart" },
  { id: "partial", label: "Partial match" },
  { id: "exact", label: "Exact match" },
  { id: "untitled", label: "Untitled" },
]

export interface TransactionFilterHeaderProps {
  accounts: Account[]
  categoriesByType: Record<TransactionType, Category[]>
  tags: Tag[]
  filterState: TransactionListFilterState
  onFilterChange: (state: TransactionListFilterState) => void
  selectedRange?: { start: Date; end: Date } | null
  onDateRangeChange?: (range: { start: Date; end: Date } | null) => void
  searchState?: SearchState
  onSearchApply?: (state: SearchState) => void
  hiddenFilters?: FilterPanelKey[]
}

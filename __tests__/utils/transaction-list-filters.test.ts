import { describe, expect, it, vi } from "vitest"

// The list utils import this store only for its layout enum; the real one
// pulls in react-native, which Node cannot parse.
vi.mock("~/stores/transfers-preferences.store", () => ({
  TransferLayoutEnum: { COMBINE: "combine", SEPARATE: "separate" },
}))

// Date formatting for section titles; the filters under test never call it.
vi.mock("~/utils/time-utils", () => ({}))

import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"
import {
  DEFAULT_SEARCH_STATE,
  DEFAULT_TRANSACTION_LIST_FILTER_STATE,
} from "~/types/transaction-filters"
import {
  applyFiltersAndSearch,
  hasActiveFilters,
} from "~/utils/transaction-list-utils"

function row(
  id: string,
  accountId: string,
  categoryId: string,
  title: string,
  itemNames: string[] = [],
): TransactionWithRelations {
  return {
    id,
    accountId,
    categoryId,
    title,
    tagIds: [],
    items: itemNames.map((name) => ({ name, unitPrice: 100, quantity: 1 })),
    type: "expense",
    extra: null,
  } as unknown as TransactionWithRelations
}

const rows = [
  row("1", "cash", "food", "Lunch"),
  row("2", "bank", "food", "Dinner"),
  row("3", "cash", "rent", "Rent"),
  row("4", "bank", "food", "Groceries", ["Milk", "Bread"]),
]
const ids = (list: TransactionWithRelations[]) => list.map((r) => r.id)

describe("applyFiltersAndSearch", () => {
  it("keeps every row when no filter or search is set", () => {
    const out = applyFiltersAndSearch(
      rows,
      DEFAULT_TRANSACTION_LIST_FILTER_STATE,
      DEFAULT_SEARCH_STATE,
    )
    expect(ids(out)).toEqual(["1", "2", "3", "4"])
  })

  it("narrows by account and category", () => {
    const out = applyFiltersAndSearch(
      rows,
      {
        ...DEFAULT_TRANSACTION_LIST_FILTER_STATE,
        accountIds: ["cash"],
        categoryIds: ["food"],
      },
      DEFAULT_SEARCH_STATE,
    )
    expect(ids(out)).toEqual(["1"])
  })

  it("narrows by the search query", () => {
    const search = { ...DEFAULT_SEARCH_STATE, query: "din" }
    const out = applyFiltersAndSearch(
      rows,
      DEFAULT_TRANSACTION_LIST_FILTER_STATE,
      search,
    )
    expect(ids(out)).toEqual(["2"])
    expect(
      hasActiveFilters(DEFAULT_TRANSACTION_LIST_FILTER_STATE, search),
    ).toBe(true)
  })

  it("finds a transaction by one of its item names", () => {
    const out = applyFiltersAndSearch(
      rows,
      DEFAULT_TRANSACTION_LIST_FILTER_STATE,
      { ...DEFAULT_SEARCH_STATE, query: "milk" },
    )
    expect(ids(out)).toEqual(["4"])
  })
})

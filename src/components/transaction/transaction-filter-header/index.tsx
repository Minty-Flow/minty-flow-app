/**
 * Inline filter header for the transaction list.
 * Horizontal pill row + expandable inline filter panels.
 * No bottom sheets — filters are shown directly in the view.
 */

import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { DateRangePresetModal } from "~/components/date-range-preset-modal"
import { Chip } from "~/components/ui/chips"
import { IconSvg, type IconSvgName } from "~/components/ui/icon-svg"
import type {
  AttachmentsOptionsType,
  GroupByOption,
  PendingOptionsType,
  SearchMatchType,
} from "~/types/transaction-filters"
import {
  AttachmentsOptionsEnum,
  DEFAULT_SEARCH_STATE,
  DEFAULT_TRANSACTION_LIST_FILTER_STATE,
  PendingOptionsEnum,
} from "~/types/transaction-filters"
import type { TransactionType } from "~/types/transactions"
import { formatShortMonthDay } from "~/utils/time-utils"

import { filterHeaderStyles } from "./filter-header.styles"
import {
  AccountsPanel,
  AttachmentsPanel,
  CategoriesPanel,
  CurrencyPanel,
  GroupByPanel,
  PendingPanel,
  SearchPanel,
  TagsPanel,
  TypePanel,
} from "./panels"
import {
  EMPTY_HIDDEN_FILTERS,
  type FilterPanelKey,
  type TransactionFilterHeaderProps,
} from "./types"

export function TransactionFilterHeader({
  accounts,
  categoriesByType,
  tags,
  filterState,
  onFilterChange,
  selectedRange = null,
  onDateRangeChange,
  searchState: propSearchState,
  onSearchApply,
  hiddenFilters = EMPTY_HIDDEN_FILTERS,
}: TransactionFilterHeaderProps) {
  const { t } = useTranslation()
  const searchState = propSearchState ?? DEFAULT_SEARCH_STATE
  const [expandedPanel, setExpandedPanel] = useState<FilterPanelKey | null>(
    null,
  )
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const { theme } = useUnistyles()

  const togglePanel = useCallback((key: FilterPanelKey) => {
    setExpandedPanel((prev) => (prev === key ? null : key))
  }, [])

  const handleDatePress = useCallback(() => {
    setExpandedPanel(null)
    setDateModalVisible(true)
  }, [])

  const handleSearchChange = useCallback(
    (text: string) => {
      const next = { ...searchState, query: text }
      onSearchApply?.(next)
    },
    [searchState, onSearchApply],
  )

  const handleSearchMatchTypeChange = useCallback(
    (matchType: SearchMatchType) => {
      const next = { ...searchState, matchType }
      onSearchApply?.(next)
    },
    [searchState, onSearchApply],
  )

  const handleSearchIncludeNotesChange = useCallback(
    (includeNotes: boolean) => {
      const next = { ...searchState, includeNotes }
      onSearchApply?.(next)
    },
    [searchState, onSearchApply],
  )

  const handleSearchClear = useCallback(() => {
    onSearchApply?.(DEFAULT_SEARCH_STATE)
  }, [onSearchApply])

  const toggleAccount = useCallback(
    (accountId: string) => {
      const ids = filterState.accountIds.includes(accountId)
        ? filterState.accountIds.filter((id) => id !== accountId)
        : [...filterState.accountIds, accountId]
      onFilterChange({ ...filterState, accountIds: ids })
    },
    [filterState, onFilterChange],
  )

  const clearAccounts = useCallback(() => {
    onFilterChange({ ...filterState, accountIds: [] })
  }, [filterState, onFilterChange])

  const toggleCurrency = useCallback(
    (currencyCode: string) => {
      const codes = filterState.currencyIds.includes(currencyCode)
        ? filterState.currencyIds.filter((c) => c !== currencyCode)
        : [...filterState.currencyIds, currencyCode]
      onFilterChange({ ...filterState, currencyIds: codes })
    },
    [filterState, onFilterChange],
  )

  const clearCurrencies = useCallback(() => {
    onFilterChange({ ...filterState, currencyIds: [] })
  }, [filterState, onFilterChange])

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const ids = filterState.categoryIds.includes(categoryId)
        ? filterState.categoryIds.filter((id) => id !== categoryId)
        : [...filterState.categoryIds, categoryId]
      onFilterChange({ ...filterState, categoryIds: ids })
    },
    [filterState, onFilterChange],
  )

  const clearCategories = useCallback(() => {
    onFilterChange({ ...filterState, categoryIds: [] })
  }, [filterState, onFilterChange])

  const clearTags = useCallback(() => {
    onFilterChange({ ...filterState, tagIds: [] })
  }, [filterState, onFilterChange])

  const toggleTag = useCallback(
    (tagId: string) => {
      const ids = filterState.tagIds.includes(tagId)
        ? filterState.tagIds.filter((id) => id !== tagId)
        : [...filterState.tagIds, tagId]
      onFilterChange({ ...filterState, tagIds: ids })
    },
    [filterState, onFilterChange],
  )

  const toggleType = useCallback(
    (type: TransactionType) => {
      const types = filterState.typeFilters.includes(type)
        ? filterState.typeFilters.filter((t) => t !== type)
        : [...filterState.typeFilters, type]
      onFilterChange({ ...filterState, typeFilters: types })
    },
    [filterState, onFilterChange],
  )

  const clearTypes = useCallback(() => {
    onFilterChange({ ...filterState, typeFilters: [] })
  }, [filterState, onFilterChange])

  const setPending = useCallback(
    (value: PendingOptionsType) => {
      onFilterChange({ ...filterState, pendingFilter: value })
    },
    [filterState, onFilterChange],
  )

  const setGroupBy = useCallback(
    (value: GroupByOption) => {
      onFilterChange({ ...filterState, groupBy: value })
    },
    [filterState, onFilterChange],
  )

  const setAttachment = useCallback(
    (value: AttachmentsOptionsType) => {
      onFilterChange({
        ...filterState,
        attachmentFilter: value,
      })
    },
    [filterState, onFilterChange],
  )

  const handleClearAll = useCallback(() => {
    setExpandedPanel(null)
    onFilterChange(DEFAULT_TRANSACTION_LIST_FILTER_STATE)
    onSearchApply?.(DEFAULT_SEARCH_STATE)
    onDateRangeChange?.(null)
  }, [onFilterChange, onSearchApply, onDateRangeChange])

  const handleDone = useCallback(() => {
    setExpandedPanel(null)
  }, [])

  const isSearchActive =
    searchState.query.length > 0 || searchState.matchType === "untitled"
  const isDateActive = selectedRange !== null
  const isAccountsActive = filterState.accountIds.length > 0
  const isCategoriesActive = filterState.categoryIds.length > 0
  const isTagsActive = filterState.tagIds.length > 0
  const isPendingActive = filterState.pendingFilter !== "all"
  const isTypeActive = filterState.typeFilters.length > 0
  const isGroupByActive = filterState.groupBy !== "day"
  const isAttachmentsActive = filterState.attachmentFilter !== "all"
  const isCurrencyActive = filterState.currencyIds.length > 0

  const hasAnyFilter =
    isSearchActive ||
    isDateActive ||
    isAccountsActive ||
    isCategoriesActive ||
    isTagsActive ||
    isPendingActive ||
    isTypeActive ||
    isGroupByActive ||
    isAttachmentsActive ||
    isCurrencyActive

  const accountLabel =
    filterState.accountIds.length === 0
      ? t("components.filters.chips.accounts")
      : filterState.accountIds.length === accounts.length
        ? t("components.filters.chips.allAccounts")
        : t("components.filters.chips.accountCount", {
            count: filterState.accountIds.length,
          })

  const categoryLabel =
    filterState.categoryIds.length === 0
      ? t("components.filters.chips.categories")
      : t("components.filters.chips.categoryCount", {
          count: filterState.categoryIds.length,
        })

  const tagLabel =
    filterState.tagIds.length === 0
      ? t("components.filters.chips.tags")
      : t("components.filters.chips.tagCount", {
          count: filterState.tagIds.length,
        })

  const typeLabel =
    filterState.typeFilters.length === 0
      ? t("components.filters.chips.type")
      : filterState.typeFilters.length === 3
        ? t("components.filters.chips.allTypes")
        : t("components.filters.chips.typeCount", {
            count: filterState.typeFilters.length,
          })

  const groupByLabel = t(
    `components.filters.groupByOptions.${filterState.groupBy}`,
  )

  const attachmentLabel =
    filterState.attachmentFilter === AttachmentsOptionsEnum.ALL
      ? t("components.filters.chips.attachments")
      : t(
          `components.filters.attachmentOptions.${filterState.attachmentFilter}`,
        )

  const pendingLabel =
    filterState.pendingFilter === PendingOptionsEnum.ALL
      ? t("components.filters.chips.pendingStatus")
      : t(`components.filters.pendingOptions.${filterState.pendingFilter}`)

  // Derive the unique set of currency codes that appear in the current accounts list.
  const availableCurrencies = [
    ...new Set(accounts.map((a) => a.currencyCode)),
  ].filter(Boolean)

  const currencyLabel =
    filterState.currencyIds.length === 0
      ? "Currency"
      : filterState.currencyIds.length === availableCurrencies.length
        ? "All currencies"
        : filterState.currencyIds.length === 1
          ? filterState.currencyIds[0]
          : `${filterState.currencyIds.length} currencies`

  const dateLabel = selectedRange
    ? `${formatShortMonthDay(selectedRange.start)} – ${formatShortMonthDay(selectedRange.end)}`
    : t("components.filters.chips.thisMonth")

  const borderColor = theme.colors.customColors.semi

  const pills: {
    key: FilterPanelKey | "date"
    icon: IconSvgName
    label: string
    active: boolean
  }[] = [
    {
      key: "search",
      icon: "search",
      label: isSearchActive
        ? searchState.query || t("components.filters.chips.untitled")
        : t("common.actions.search"),
      active: isSearchActive,
    },
    { key: "date", icon: "calendar", label: dateLabel, active: isDateActive },
    {
      key: "accounts",
      icon: "credit-card",
      label: accountLabel,
      active: isAccountsActive,
    },
    {
      key: "categories",
      icon: "category",
      label: categoryLabel,
      active: isCategoriesActive,
    },
    {
      key: "tags",
      icon: "tags",
      label: tagLabel,
      active: isTagsActive,
    },
    {
      key: "pending",
      icon: "clock",
      label: pendingLabel,
      active: isPendingActive,
    },
    {
      key: "type",
      icon: "arrows-diff",
      label: typeLabel,
      active: isTypeActive,
    },
    {
      key: "attachments",
      icon: "paperclip",
      label: attachmentLabel,
      active: isAttachmentsActive,
    },
    {
      key: "currency",
      icon: "currency",
      label: currencyLabel,
      active: isCurrencyActive,
    },
    {
      key: "groupBy",
      icon: "grip-horizontal",
      label: groupByLabel,
      active: isGroupByActive,
    },
  ]

  const visiblePills = pills.filter(
    (p) => !hiddenFilters.includes(p.key as FilterPanelKey),
  )

  return (
    <View style={filterHeaderStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={filterHeaderStyles.pillRow}
      >
        {hasAnyFilter ? (
          <Chip
            onPress={handleClearAll}
            leading="x"
            label={t("components.filters.clearAll")}
            selected={false} // keep it outline style
            labelStyle={{ color: theme.colors.primary }}
          />
        ) : null}
        {visiblePills.map(({ key, icon, label, active }) => {
          const isExpanded = expandedPanel === key
          const selected = active || isExpanded
          return (
            <Chip
              key={key}
              label={label}
              selected={selected}
              hideCheck
              onPress={() =>
                key === "date"
                  ? handleDatePress()
                  : togglePanel(key as FilterPanelKey)
              }
              leading={<IconSvg name={icon} size={18} />}
            />
          )
        })}
      </ScrollView>

      {expandedPanel !== null ? (
        <View
          style={[
            filterHeaderStyles.panel,
            {
              backgroundColor: `${theme.colors.onSurface}10`,
              borderColor,
            },
          ]}
        >
          {expandedPanel === "search" ? (
            <SearchPanel
              value={searchState.query}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              onDone={handleDone}
              matchType={searchState.matchType}
              onMatchTypeChange={handleSearchMatchTypeChange}
              includeNotes={searchState.includeNotes}
              onIncludeNotesChange={handleSearchIncludeNotesChange}
            />
          ) : null}
          {expandedPanel === "accounts" ? (
            <AccountsPanel
              accounts={accounts}
              selectedIds={filterState.accountIds}
              onToggle={toggleAccount}
              onClear={clearAccounts}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "categories" ? (
            <CategoriesPanel
              categoriesByType={categoriesByType}
              selectedIds={filterState.categoryIds}
              onToggle={toggleCategory}
              onClear={clearCategories}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "tags" ? (
            <TagsPanel
              tags={tags}
              selectedIds={filterState.tagIds}
              onToggle={toggleTag}
              onClear={clearTags}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "pending" ? (
            <PendingPanel
              value={filterState.pendingFilter}
              onSelect={setPending}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "type" ? (
            <TypePanel
              value={filterState.typeFilters}
              onToggle={toggleType}
              onClear={clearTypes}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "groupBy" ? (
            <GroupByPanel
              value={filterState.groupBy}
              onSelect={setGroupBy}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "attachments" ? (
            <AttachmentsPanel
              value={filterState.attachmentFilter}
              onSelect={setAttachment}
              onDone={handleDone}
            />
          ) : null}
          {expandedPanel === "currency" ? (
            <CurrencyPanel
              accounts={accounts}
              selectedCurrencies={filterState.currencyIds}
              onToggle={toggleCurrency}
              onClear={clearCurrencies}
              onDone={handleDone}
            />
          ) : null}
        </View>
      ) : null}

      <DateRangePresetModal
        visible={dateModalVisible}
        initialStart={selectedRange?.start}
        initialEnd={selectedRange?.end}
        onSave={(start, end) => {
          onDateRangeChange?.({ start, end })
          setDateModalVisible(false)
        }}
        onRequestClose={() => setDateModalVisible(false)}
      />
    </View>
  )
}

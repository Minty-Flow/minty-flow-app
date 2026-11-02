import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { FilterToggleButton } from "~/components/filter-toggle-button"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { MonthYearPicker } from "~/components/month-year-picker"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionSectionList } from "~/components/transaction/transaction-section-list"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useCategoriesQuery } from "~/database/drizzle/read-models/category-read-model"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import {
  useSelectedMonth,
  useTransactionListFilters,
} from "~/hooks/use-transaction-list-state"
import { getThemeStrict } from "~/styles/theme/registry"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { hasActiveFilters } from "~/utils/transaction-list-utils"
export default function CategoryDetailsScreen() {
  const { categoryId } = useLocalSearchParams<{
    categoryId: string
  }>()
  const router = useRouter()
  const navigation = useNavigation()
  const month = useSelectedMonth()
  const {
    filterState,
    setFilterState,
    searchState,
    setSearchState,
    showFilters,
    toggleFilters,
  } = useTransactionListFilters()
  const { t } = useTranslation()
  const categoriesQuery = useCategoriesQuery(true)
  const category = categoriesQuery.data.find((c) => c.id === categoryId)
  const { items: transactionsFull } = useTransactions(
    categoryId
      ? {
          categoryId,
          from: month.from,
          to: month.to,
        }
      : {},
  )
  const colorScheme = getThemeStrict(category?.colorSchemeName ?? null)
  // Sum per currency: amounts in different currencies must not be added up.
  const monthTotals = (() => {
    const byCurrency = new Map<string, { income: number; expense: number }>()
    for (const r of transactionsFull) {
      const code = r.account?.currencyCode
      if (!code || r.isPending || r.isDeleted || r.loanId != null) continue
      const totals = byCurrency.get(code) ?? { income: 0, expense: 0 }
      if (r.type === TransactionTypeEnum.INCOME) {
        totals.income += r.amount
      } else if (r.type === TransactionTypeEnum.EXPENSE) {
        totals.expense +=
          r.subtype === TransactionSubTypeEnum.REFUND ? -r.amount : r.amount
      } else continue
      byCurrency.set(code, totals)
    }
    return [...byCurrency.entries()].map(([currency, totals]) => ({
      currency,
      ...totals,
    }))
  })()
  const filtersApplied = hasActiveFilters(filterState, searchState)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: category?.name ?? "",
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <FilterToggleButton
            active={showFilters}
            onPress={toggleFilters}
            filtersApplied={filtersApplied}
          />
          <Button
            variant="ghost"
            size="icon"
            onPress={() =>
              router.push({
                pathname: "/settings/categories/[categoryId]/modify",
                params: { categoryId: category?.id ?? "" },
              })
            }
          >
            <IconSvg name="pencil-outline" size={20} />
          </Button>
        </View>
      ),
    })
  }, [
    navigation,
    router,
    category?.id,
    category?.name,
    showFilters,
    toggleFilters,
    filtersApplied,
  ])
  if (!category) {
    return categoriesQuery.status === "loading" ? (
      <RouteLoadingState />
    ) : (
      <RouteNotFoundState message={t("common.notFound.category")} />
    )
  }
  const typeLabel = t(`common.transaction.types.${category.type}`)
  const headerContent = (
    <>
      {/* Category Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <DynamicIcon
            icon={category.icon || "category-outline"}
            size={32}
            variant="badge"
            colorScheme={colorScheme}
          />
          <View style={styles.headerInfo}>
            <Text
              style={styles.categoryName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {category.name}
            </Text>
            <Text style={styles.categoryType}>{typeLabel}</Text>
          </View>
        </View>
      </View>

      {/* Summary: Income & Expense pill cards */}
      {monthTotals.map(({ currency, income, expense }) => (
        <View key={currency} style={styles.summaryRow}>
          <View style={styles.summaryPillCard}>
            <Money
              value={income}
              currency={currency}
              visualTone={TransactionTypeEnum.INCOME}
              style={styles.summaryPillAmount}
            />
          </View>
          <View style={styles.summaryPillCard}>
            <Money
              value={expense}
              currency={currency}
              tone={TransactionTypeEnum.EXPENSE}
              style={styles.summaryPillAmount}
            />
          </View>
        </View>
      ))}
    </>
  )
  return (
    <View style={styles.container}>
      <MonthYearPicker
        initialYear={month.year}
        initialMonth={month.month}
        onSelect={month.onSelect}
      />

      {showFilters && (
        <TransactionFilterHeader
          accounts={[]}
          filterState={filterState}
          onFilterChange={setFilterState}
          searchState={searchState}
          onSearchApply={setSearchState}
          hiddenFilters={["accounts", "categories"]}
        />
      )}

      <TransactionSectionList
        transactionsFull={transactionsFull}
        filterState={filterState}
        searchState={searchState}
        showUpcoming
        ListHeaderComponent={headerContent}
      />
    </View>
  )
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  // ── Header Card ──────────────────────────────────────────────
  headerCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    marginHorizontal: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
  categoryName: {
    fontSize: theme.typography.titleSmall.fontSize,
    fontWeight: "700",
    flex: 1,
    color: theme.colors.onSecondary,
  },
  categoryType: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "500",
    color: theme.colors.semantic.semi,
    marginRight: 16,
  },
  // ── Summary: Income & Expense pills ─────────────────
  summaryRow: {
    flexDirection: "row",
    gap: 5,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  summaryPillCard: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryPillAmount: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "700",
  },
}))

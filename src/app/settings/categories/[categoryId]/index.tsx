import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect } from "react"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { FilterToggleButton } from "~/components/filter-toggle-button"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { MonthYearPicker } from "~/components/month-year-picker"
import { RouteLoadingState } from "~/components/route-load-state"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionSectionList } from "~/components/transaction/transaction-section-list"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useCategory } from "~/database/drizzle/read-models/category-read-model"
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
  const category = useCategory(categoryId ?? "")
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
  const dominantCurrency = (() => {
    for (const r of transactionsFull) {
      const code = r.account?.currencyCode
      if (code) return code
    }
    return ""
  })()
  const monthIn = transactionsFull
    .filter(
      (r) =>
        r.type === TransactionTypeEnum.INCOME && !r.isPending && !r.isDeleted,
    )
    .reduce((sum, r) => {
      if (r.loanId != null) return sum
      return sum + r.amount
    }, 0)
  const monthOut = transactionsFull
    .filter(
      (r) =>
        r.type === TransactionTypeEnum.EXPENSE && !r.isPending && !r.isDeleted,
    )
    .reduce((sum, r) => {
      if (r.loanId != null) return sum
      if (r.subtype === TransactionSubTypeEnum.REFUND) {
        return sum - r.amount
      }
      return sum + r.amount
    }, 0)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: category?.name ?? "",
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <FilterToggleButton active={showFilters} onPress={toggleFilters} />
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
  ])
  if (!category) {
    return <RouteLoadingState />
  }
  const typeLabel =
    category.type.charAt(0).toUpperCase() + category.type.slice(1)
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
      {dominantCurrency !== "" && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryPillCard}>
            <Money
              value={monthIn}
              currency={dominantCurrency}
              visualTone={TransactionTypeEnum.INCOME}
              style={styles.summaryPillAmount}
            />
          </View>
          <View style={styles.summaryPillCard}>
            <Money
              value={monthOut}
              currency={dominantCurrency}
              tone={TransactionTypeEnum.EXPENSE}
              style={styles.summaryPillAmount}
            />
          </View>
        </View>
      )}
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

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useMemo, useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { MonthYearPicker } from "~/components/month-year-picker"
import { TransactionFilterHeader } from "~/components/transaction/transaction-filter-header"
import { TransactionSectionList } from "~/components/transaction/transaction-section-list"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getMonthRange } from "~/database/services-sqlite/account-service"
import { useCategoriesByType, useCategory } from "~/stores/db/category.store"
import { useTags } from "~/stores/db/tag.store"
import { useTransactions } from "~/stores/db/transaction.store"
import { getThemeStrict } from "~/styles/theme/registry"
import type {
  SearchState,
  TransactionListFilterState,
} from "~/types/transaction-filters"
import {
  DEFAULT_SEARCH_STATE,
  DEFAULT_TRANSACTION_LIST_FILTER_STATE,
} from "~/types/transaction-filters"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"

export default function CategoryDetailsScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>()
  const router = useRouter()
  const navigation = useNavigation()

  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear(),
  )
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth(),
  )
  const [filterState, setFilterState] = useState<TransactionListFilterState>(
    DEFAULT_TRANSACTION_LIST_FILTER_STATE,
  )
  const [searchState, setSearchState] =
    useState<SearchState>(DEFAULT_SEARCH_STATE)
  const [showFilters, setShowFilters] = useState(false)

  const category = useCategory(categoryId ?? "")
  const categoriesExpense = useCategoriesByType(TransactionTypeEnum.EXPENSE)
  const categoriesIncome = useCategoriesByType(TransactionTypeEnum.INCOME)
  const categoriesTransfer = useCategoriesByType(TransactionTypeEnum.TRANSFER)
  const tags = useTags()

  const { fromDate, toDate } = useMemo(
    () => getMonthRange(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  )

  const { items: transactionsFull } = useTransactions(
    categoryId
      ? {
          categoryId,
          from: new Date(fromDate).toISOString(),
          to: new Date(toDate).toISOString(),
        }
      : {},
  )

  const colorScheme = getThemeStrict(category?.colorSchemeName ?? null)

  const categoriesByType = useMemo(
    () => ({
      expense: categoriesExpense,
      income: categoriesIncome,
      transfer: categoriesTransfer,
    }),
    [categoriesExpense, categoriesIncome, categoriesTransfer],
  )

  const dominantCurrency = useMemo(() => {
    for (const r of transactionsFull) {
      const code = r.account?.currencyCode
      if (code) return code
    }
    return ""
  }, [transactionsFull])

  const monthIn = useMemo(
    () =>
      transactionsFull
        .filter(
          (r) =>
            r.type === TransactionTypeEnum.INCOME &&
            !r.isPending &&
            !r.isDeleted,
        )
        .reduce((sum, r) => {
          if (
            r.subtype === TransactionSubTypeEnum.LOAN_BORROWED ||
            r.subtype === TransactionSubTypeEnum.LOAN_RECEIVED
          ) {
            return sum
          }
          return sum + r.amount
        }, 0),
    [transactionsFull],
  )

  const monthOut = useMemo(
    () =>
      transactionsFull
        .filter(
          (r) =>
            r.type === TransactionTypeEnum.EXPENSE &&
            !r.isPending &&
            !r.isDeleted,
        )
        .reduce((sum, r) => {
          if (
            r.subtype === TransactionSubTypeEnum.LOAN_REPAYMENT ||
            r.subtype === TransactionSubTypeEnum.LOAN_LENT
          ) {
            return sum
          }
          if (r.subtype === TransactionSubTypeEnum.REFUND) {
            return sum - r.amount
          }
          return sum + r.amount
        }, 0),
    [transactionsFull],
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: category?.name ?? "",
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <Button
            variant={"ghost"}
            size="icon"
            onPress={() => setShowFilters((v) => !v)}
          >
            <IconSvg
              name={showFilters ? "filter-2-x-outline" : "filter-2-outline"}
              size={20}
            />
          </Button>
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
  }, [navigation, router, category?.id, category?.name, showFilters])

  if (!category) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
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
        initialYear={selectedYear}
        initialMonth={selectedMonth}
        onSelect={(y, m) => {
          setSelectedYear(y)
          setSelectedMonth(m)
        }}
      />

      {showFilters && (
        <TransactionFilterHeader
          accounts={[]}
          categoriesByType={categoriesByType}
          tags={tags}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Header Card ──────────────────────────────────────────────
  headerCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
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

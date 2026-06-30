import {
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, FlatList, View as RNView } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { on } from "~/database/events"
import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
import {
  getBudgetPeriodRange,
  getBudgetSpent,
  getBudgetSpentByCategory,
} from "~/database/repos/budget-repo"
import type { TranslationKey } from "~/i18n/config"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useBudget } from "~/stores/db/budget.store"
import { useCategories } from "~/stores/db/category.store"
import { useTransactions } from "~/stores/db/transaction.store"
import { useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { getWeekStartsOn } from "~/utils/get-week-start-on"
import { formatDisplayValue } from "~/utils/number-format"
import { formatCustomPeriodRange } from "~/utils/time-utils"

type BudgetStatus = "onTrack" | "watch" | "over"

/* ------------------------------------------------------------------ */
/* Detail screen                                                      */
/* ------------------------------------------------------------------ */

function BudgetDetailInner({ budgetId }: { budgetId: string }) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)

  const budget = useBudget(budgetId)
  const allAccounts = useActiveAccounts()
  const allCategories = useCategories()
  const [spentAmount, setSpentAmount] = useState(0)
  const [spentByCategory, setSpentByCategory] = useState<
    Record<string, number>
  >({})

  const accountNames = useMemo(
    () =>
      (budget?.accountIds ?? [])
        .map((id) => allAccounts.find((a) => a.id === id)?.name)
        .filter(Boolean) as string[],
    [budget?.accountIds, allAccounts],
  )

  const linkedCategories = useMemo(
    () =>
      (budget?.categoryIds ?? [])
        .map((id) => allCategories.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [budget?.categoryIds, allCategories],
  )
  const periodRange = useMemo(() => {
    if (!budget) return null
    return getBudgetPeriodRange(
      budget.period,
      budget.startDate.toISOString(),
      budget.endDate?.toISOString() ?? null,
    )
  }, [budget])

  const { items: transactionsFull } = useTransactions(
    periodRange && budget
      ? {
          accountIds: budget.accountIds,
          categoryIds: budget.categoryIds,
          from: periodRange.periodStart,
          to: periodRange.periodEnd,
        }
      : {},
  )

  useEffect(() => {
    if (!budget) return
    let cancelled = false
    const fetch = () => {
      getBudgetSpent(
        budget.accountIds,
        budget.categoryIds,
        budget.period,
        budget.startDate.toISOString(),
        budget.endDate?.toISOString() ?? null,
      ).then((v) => {
        if (!cancelled) setSpentAmount(v)
      })
      getBudgetSpentByCategory(
        budget.accountIds,
        budget.categoryIds,
        budget.period,
        budget.startDate.toISOString(),
        budget.endDate?.toISOString() ?? null,
      ).then((v) => {
        if (!cancelled) setSpentByCategory(v)
      })
    }
    fetch()
    const unsub = on("transactions:dirty", fetch)
    return () => {
      cancelled = true
      unsub()
    }
  }, [budget])

  const handleTransactionPress = useCallback(
    (id: string) => {
      router.push({ pathname: "/transaction/[id]", params: { id } })
    },
    [router],
  )
  const handleDeleteDone = useCallback(() => {
    openSwipeableRef.current?.close()
  }, [])

  const handleWillOpen = useCallback((methods: SwipeableMethods) => {
    openSwipeableRef.current?.close()
    openSwipeableRef.current = methods
  }, [])

  const renderTransactionItem = useCallback(
    ({ item }: { item: TransactionWithRelations }) => (
      <TransactionItem
        transactionWithRelations={item}
        onPress={() => handleTransactionPress(item.id)}
        onDelete={handleDeleteDone}
        onWillOpen={handleWillOpen}
      />
    ),
    [handleTransactionPress, handleDeleteDone, handleWillOpen],
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("screens.settings.budgets.detail.title"),
      headerRight: () => (
        <Button
          variant="ghost"
          size="icon"
          onPress={() =>
            router.push({
              pathname: "/settings/budgets/[budgetId]/modify",
              params: { budgetId },
            })
          }
        >
          <IconSvg name="pencil-outline" size={20} />
        </Button>
      ),
    })
  }, [navigation, router, budgetId, t])

  if (!budget) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
  }

  const limit = budget.amount
  const spent = spentAmount
  const isOverBudget = spent > limit
  const remaining = limit - spent

  // Period bounds — match card logic.
  const { periodStart, periodEnd } = (() => {
    const now = new Date()
    const wso = getWeekStartsOn()
    switch (budget.period) {
      case "daily":
        return { periodStart: startOfDay(now), periodEnd: endOfDay(now) }
      case "weekly":
        return {
          periodStart: startOfWeek(now, { weekStartsOn: wso }),
          periodEnd: endOfWeek(now, { weekStartsOn: wso }),
        }
      case "monthly":
        return { periodStart: startOfMonth(now), periodEnd: endOfMonth(now) }
      case "yearly":
        return { periodStart: startOfYear(now), periodEnd: endOfYear(now) }
      default:
        return {
          periodStart: budget.startDate,
          periodEnd: budget.endDate ?? now,
        }
    }
  })()

  const totalDays =
    Math.max(differenceInCalendarDays(periodEnd, periodStart), 0) + 1
  const elapsedDays = Math.min(
    Math.max(differenceInCalendarDays(new Date(), periodStart), 0) + 1,
    totalDays,
  )
  const daysRemaining = Math.max(totalDays - elapsedDays, 0)
  const timeRatio = totalDays > 0 ? elapsedDays / totalDays : 0
  const spendRatio = limit > 0 ? Math.min(spent / limit, 1) : 0

  const status: BudgetStatus = isOverBudget
    ? "over"
    : limit > 0 && spent / limit - timeRatio >= 0.1
      ? "watch"
      : "onTrack"

  const statusColor = {
    onTrack: theme.colors.semantic.income,
    watch: theme.colors.semantic.warning,
    over: theme.colors.semantic.expense,
  }[status]
  const statusBg = `${statusColor}20`
  const progressBarColor = statusColor

  const periodLabel =
    budget.period === "custom"
      ? formatCustomPeriodRange(budget.startDate, budget.endDate)
      : t(`screens.settings.budgets.periods.${budget.period}` as TranslationKey)

  const formatAmt = (n: number) => {
    const raw = formatDisplayValue(n.toString(), {
      currency: budget.currencyCode,
      currencyDisplay: currencyLook,
      hideSign: true,
    })
    return privacyMode ? raw.replace(/[\d٠-٩۰-۹]/gu, "⁕") : raw
  }
  const insight = isOverBudget
    ? t(
        `screens.settings.budgets.card.insight.over.${budget.period}` as TranslationKey,
        {
          amount: formatAmt(Math.abs(remaining)),
          range:
            budget.period === "custom"
              ? formatCustomPeriodRange(budget.startDate, budget.endDate)
              : "",
        },
      )
    : daysRemaining > 0
      ? t("screens.settings.budgets.card.insight.dailyPace", {
          amount: formatAmt(remaining / daysRemaining),
          count: daysRemaining,
        })
      : null

  // Per-category breakdown — sorted by spend descending, only categories with
  // non-zero spend. The segmented progress bar mirrors this order so colors
  // map left-to-right.
  const categoryBreakdown = linkedCategories
    .map((c) => ({ category: c, spent: spentByCategory[c.id] ?? 0 }))
    .sort((a, b) => b.spent - a.spent)

  // Uncategorized portion — when total spend exceeds the sum of category
  // segments (transactions without a linked category, etc.).
  const categorizedTotal = categoryBreakdown.reduce(
    (sum, b) => sum + b.spent,
    0,
  )
  const uncategorizedSpent = Math.max(spent - categorizedTotal, 0)

  // Segment widths are percentages of the limit so segments stay proportional
  // to their share of spend. We cap each at 100% so a single over-budget
  // segment doesn't overflow the bar visually.
  const segmentPct = (n: number) =>
    limit > 0 ? Math.min((n / limit) * 100, 100) : 0

  const headerContent = (
    <View style={styles.headerCard}>
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <View style={styles.nameRow}>
            <Text style={styles.budgetName} numberOfLines={1}>
              {budget.name}
            </Text>
            {budget.isActive ? (
              <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                <RNView
                  style={[styles.statusDot, { backgroundColor: statusColor }]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: statusColor },
                    isRTL && styles.statusTextRTL,
                  ]}
                >
                  {t(
                    `screens.settings.budgets.card.status.${status}` as TranslationKey,
                  )}
                </Text>
              </View>
            ) : (
              <View style={styles.disabledBadge}>
                <Text style={styles.disabledText}>
                  {t("screens.settings.budgets.card.disabled")}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle} numberOfLines={1}>
            {periodLabel} ·{" "}
            {t("screens.settings.budgets.card.dayXofY", {
              current: elapsedDays,
              total: totalDays,
            })}
          </Text>
        </View>
        <View style={styles.amountColumn}>
          <Money
            value={spent}
            currency={budget.currencyCode}
            tone="transfer"
            hideSign
            style={[styles.spentAmount, isOverBudget && { color: statusColor }]}
          />
          <Text style={styles.ofLimit}>
            {t("screens.settings.budgets.card.of")}{" "}
            <Money
              value={limit}
              currency={budget.currencyCode}
              tone="transfer"
              hideSign
              variant="small"
              style={styles.ofLimit}
            />
          </Text>
        </View>
      </View>

      <View style={styles.segmentTrack}>
        {categoryBreakdown.length > 0 || uncategorizedSpent > 0 ? (
          <View style={styles.segmentRow}>
            {categoryBreakdown.map((b) => (
              <RNView
                key={b.category.id}
                style={{
                  width: `${segmentPct(b.spent)}%` as DimensionValue,
                  height: "100%",
                  backgroundColor:
                    b.category.colorScheme?.primary ?? progressBarColor,
                }}
              />
            ))}
            {uncategorizedSpent > 0 && (
              <RNView
                style={{
                  width: `${segmentPct(uncategorizedSpent)}%` as DimensionValue,
                  height: "100%",
                  backgroundColor: progressBarColor,
                }}
              />
            )}
          </View>
        ) : (
          <RNView
            style={{
              width: `${(spendRatio * 100).toFixed(1)}%` as DimensionValue,
              height: "100%",
              backgroundColor: progressBarColor,
            }}
          />
        )}
      </View>

      {categoryBreakdown.length > 0 && (
        <View style={styles.breakdownList}>
          {categoryBreakdown.map((b) => (
            <View key={b.category.id} style={styles.breakdownRow}>
              <DynamicIcon
                icon={b.category.icon}
                colorScheme={b.category.colorScheme}
                size={16}
              />
              <Text style={styles.breakdownName} numberOfLines={1}>
                {b.category.name}
              </Text>
              <Money
                value={b.spent}
                currency={budget.currencyCode}
                tone="transfer"
                hideSign
                style={styles.breakdownAmount}
              />
            </View>
          ))}
          {uncategorizedSpent > 0 && (
            <View style={styles.breakdownRow}>
              <View style={styles.uncategorizedDot} />
              <Text style={styles.breakdownName} numberOfLines={1}>
                {t("screens.settings.budgets.card.uncategorized")}
              </Text>
              <Money
                value={uncategorizedSpent}
                currency={budget.currencyCode}
                tone="transfer"
                hideSign
                style={styles.breakdownAmount}
              />
            </View>
          )}
        </View>
      )}

      {insight && <Text style={styles.insight}>{insight}</Text>}

      <Text style={styles.accountsText} numberOfLines={1}>
        {accountNames.length > 0
          ? accountNames.join(", ")
          : t("screens.settings.budgets.card.allAccounts")}
      </Text>

      <Text style={styles.transactionsLabel}>
        {t("screens.settings.budgets.detail.transactions")}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={transactionsFull}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="receipt-outline"
              title={t("screens.settings.budgets.detail.noTransactions")}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

/* ------------------------------------------------------------------ */
/* Route component                                                    */
/* ------------------------------------------------------------------ */

export default function BudgetDetailScreen() {
  const { budgetId } = useLocalSearchParams<{ budgetId: string }>()
  if (!budgetId) return null
  return <BudgetDetailInner budgetId={budgetId} />
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 40,
  },

  // Header card
  headerCard: {
    padding: 20,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleLeft: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  budgetName: {
    ...theme.typography.titleLarge,
    fontWeight: "700",
    color: theme.colors.onSurface,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  statusBadge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statusTextRTL: {
    letterSpacing: 0,
  },
  disabledBadge: {
    flexShrink: 0,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  disabledText: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSecondary,
    fontWeight: "600",
  },
  amountColumn: {
    alignItems: "flex-end",
    flexShrink: 0,
    gap: 2,
  },
  spentAmount: {
    fontSize: theme.typography.titleLarge.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  ofLimit: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSecondary,
  },
  segmentTrack: {
    height: 8,
    backgroundColor: theme.colors.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  segmentRow: {
    flexDirection: "row",
    height: "100%",
    gap: 2,
  },
  breakdownList: {
    gap: 10,
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  breakdownName: {
    fontSize: theme.typography.bodyMedium.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    flex: 1,
  },
  breakdownAmount: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
    fontWeight: "600",
  },
  uncategorizedDot: {
    width: 32,
    height: 32,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  accountsText: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSecondary,
  },
  insight: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSecondary,
    fontStyle: "italic",
  },

  // Transactions
  transactionsLabel: {
    ...theme.typography.bodyLarge,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginTop: 6,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
}))

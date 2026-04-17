import { withObservables } from "@nozbe/watermelondb/react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, View as RNView } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { combineLatest, map, of, startWith, switchMap } from "rxjs"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type BudgetModel from "~/database/models/budget"
import type TransactionModel from "~/database/models/transaction"
import { observeAccountNamesByIds } from "~/database/services/account-service"
import {
  observeAccountIdsForBudget,
  observeBudgetById,
  observeBudgetSpent,
  observeBudgetTransactions,
  observeCategoryIdsForBudget,
} from "~/database/services/budget-service"
import { observeCategoryNamesByIds } from "~/database/services/category-service"
import {
  observeTransactionModelsFull,
  type TransactionWithRelations,
} from "~/database/services/transaction-service"
import { modelToBudget } from "~/database/utils/model-to-budget"
import type { TranslationKey } from "~/i18n/config"
import type { Budget } from "~/types/budgets"
import { formatCustomPeriodRange } from "~/utils/time-utils"

/* ------------------------------------------------------------------ */
/* Inner component (receives observed data)                           */
/* ------------------------------------------------------------------ */

const EMPTY_STRINGS: string[] = []
const EMPTY_TRANSACTIONS: TransactionWithRelations[] = []

interface BudgetDetailInnerProps {
  budgetId: string
  budget?: Budget
  spentAmount?: number
  categoryNames?: string[]
  accountNames?: string[]
  transactionsFull?: TransactionWithRelations[]
}

function BudgetDetailInner({
  budgetId,
  budget,
  spentAmount = 0,
  categoryNames = EMPTY_STRINGS,
  accountNames = EMPTY_STRINGS,
  transactionsFull = EMPTY_TRANSACTIONS,
}: BudgetDetailInnerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { theme } = useUnistyles()
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)

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
        onPress={() => handleTransactionPress(item.transaction.id)}
        onDelete={handleDeleteDone}
        onWillOpen={handleWillOpen}
      />
    ),
    [handleTransactionPress, handleDeleteDone, handleWillOpen],
  )

  useLayoutEffect(() => {
    navigation.setOptions({
      title: budget?.name ?? t("screens.settings.budgets.detail.title"),
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
          <IconSvg name="pencil" size={20} />
        </Button>
      ),
    })
  }, [navigation, router, budgetId, budget?.name, t])

  if (!budget) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="default">
            {t("screens.settings.budgets.form.loadingText")}
          </Text>
        </View>
      </View>
    )
  }

  const progress = budget.amount > 0 ? spentAmount / budget.amount : 0
  const clampedProgress = Math.min(progress, 1)
  const isOverBudget = progress > 1
  const remaining = Math.max(budget.amount - spentAmount, 0)

  const progressBarColor = isOverBudget
    ? theme.colors.error
    : theme.colors.primary

  const periodLabel =
    budget.period === "custom"
      ? formatCustomPeriodRange(budget.startDate, budget.endDate)
      : t(`screens.settings.budgets.periods.${budget.period}` as TranslationKey)

  const categoryLabel =
    categoryNames.length > 0
      ? categoryNames.join(", ")
      : t("screens.settings.budgets.card.noCategory")

  const headerContent = (
    <View style={styles.headerCard}>
      {/* Icon + name + period badge */}
      <View style={styles.headerTopRow}>
        <DynamicIcon
          icon={budget.icon || "chart-pie"}
          size={36}
          colorScheme={budget.colorScheme}
          variant="badge"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.budgetName}>{budget.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.periodBadge}>
              <Text style={styles.periodBadgeText}>{periodLabel}</Text>
            </View>
            {isOverBudget ? (
              <View style={styles.overBudgetBadge}>
                <IconSvg
                  name="alert-triangle"
                  size={14}
                  color={theme.colors.error}
                />
                <Text style={styles.overBudgetText}>
                  {t("screens.settings.budgets.card.overBudget")}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Categories */}
      <Text style={styles.categoryText}>{categoryLabel}</Text>

      {/* Accounts */}
      <Text style={styles.accountsText}>
        {accountNames.length > 0
          ? accountNames.join(", ")
          : t("screens.settings.budgets.card.allAccounts")}
      </Text>

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <RNView
            style={[
              styles.progressFill,
              {
                width: `${clampedProgress * 100}%`,
                backgroundColor: progressBarColor,
              },
            ]}
          />
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>
            {t("screens.settings.budgets.card.spent")}:{" "}
            <Money
              value={spentAmount}
              currency={budget.currencyCode}
              tone="transfer"
              hideSign
            />{" "}
            {t("screens.settings.budgets.card.of")}{" "}
            <Money
              value={budget.amount}
              currency={budget.currencyCode}
              tone="transfer"
              hideSign
            />
          </Text>
          <Text style={styles.remainingText}>
            {isOverBudget ? (
              t("screens.settings.budgets.card.overBudget")
            ) : (
              <>
                <Money
                  value={remaining}
                  currency={budget.currencyCode}
                  tone="transfer"
                  hideSign
                />{" "}
                {t("screens.settings.budgets.card.remaining")}
              </>
            )}
          </Text>
        </View>
      </View>

      {/* Transactions section label */}
      <Text style={styles.transactionsLabel}>
        {t("screens.settings.budgets.detail.transactions")}
      </Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={transactionsFull}
        keyExtractor={(item) => item.transaction.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="receipt"
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
/* withObservables enhancement                                        */
/* ------------------------------------------------------------------ */

const EnhancedBudgetDetail = withObservables(
  ["budgetId"],
  ({ budgetId }: { budgetId: string }) => {
    const budgetModel$ = observeBudgetById(budgetId)
    const accountIds$ = observeAccountIdsForBudget(budgetId)
    const categoryIds$ = observeCategoryIdsForBudget(budgetId)

    const budget$ = combineLatest([
      budgetModel$,
      accountIds$,
      categoryIds$,
    ]).pipe(
      map(
        ([model, accountIds, categoryIds]: [BudgetModel, string[], string[]]) =>
          modelToBudget(model, accountIds, categoryIds),
      ),
    )

    const categoryNames$ = categoryIds$.pipe(
      switchMap((ids: string[]) => observeCategoryNamesByIds(ids)),
    )

    const accountNames$ = accountIds$.pipe(
      switchMap((ids: string[]) => observeAccountNamesByIds(ids)),
    )

    const spentAmount$ = combineLatest([
      budgetModel$,
      accountIds$,
      categoryIds$,
    ]).pipe(
      switchMap(
        ([model, accountIds, categoryIds]: [BudgetModel, string[], string[]]) =>
          observeBudgetSpent(
            accountIds,
            categoryIds,
            model.period,
            model.startDate.getTime(),
            model.endDate?.getTime(),
          ),
      ),
    )

    /**
     * transactionsFull$ pipeline:
     *
     * Step 1 — observe raw budget transaction models (ids + accountIds) as
     *           txModels$.  This observable re-emits whenever the budget's
     *           transaction set changes (new tx added, tx deleted, period
     *           updated, etc.).
     *
     * Step 2 — derive uniqueAccountIds$ from txModels$ so the enriched-rows
     *           query always tracks the current account set.
     *
     * Step 3 — combine txModels$ with the enriched-rows observable via
     *           combineLatest so the id-filter Set is ALWAYS regenerated from
     *           the latest txModels emission.  Using a plain closure over
     *           `ids` inside switchMap would make the filter stale: if
     *           observeTransactionModelsFull emits a new snapshot (e.g. an
     *           account name changed) before txModels$ re-emits, the old
     *           closed-over ids array would be used, potentially hiding
     *           transactions that were added in the most recent DB write batch.
     */
    const txModels$ = combineLatest([
      budgetModel$,
      accountIds$,
      categoryIds$,
    ]).pipe(
      switchMap(
        ([model, accountIds, categoryIds]: [BudgetModel, string[], string[]]) =>
          observeBudgetTransactions(
            accountIds,
            categoryIds,
            model.period,
            model.startDate.getTime(),
            model.endDate?.getTime(),
          ),
      ),
      startWith([] as TransactionModel[]),
    )

    const transactionsFull$ = txModels$.pipe(
      switchMap((txModels: TransactionModel[]) => {
        if (txModels.length === 0) return of([] as TransactionWithRelations[])

        // Deduplicate account IDs so observeTransactionModelsFull isn't called
        // with redundant entries (e.g. multiple transactions from same account).
        const uniqueAccountIds = [...new Set(txModels.map((t) => t.accountId))]

        /**
         * combineLatest re-evaluates whenever EITHER source emits, so the
         * id-filter Set is always built from the current txModels snapshot
         * rather than a value captured once at subscribe time.
         *
         * Note: txModels is fixed within this switchMap invocation (the outer
         * switchMap re-subscribes when txModels$ changes), but wrapping it in
         * of() inside combineLatest makes the derivation explicit and keeps the
         * pattern consistent — future refactors that promote txModels$ into
         * the combine will work correctly without further changes.
         */
        return combineLatest([
          of(txModels),
          observeTransactionModelsFull({ accountIds: uniqueAccountIds }),
        ]).pipe(
          map(
            ([currentTxModels, full]: [
              TransactionModel[],
              TransactionWithRelations[],
            ]) => {
              // Rebuild the allowed-id set on every emission so it always reflects
              // the current budget transaction list, never a stale closure.
              const currentIds = new Set(currentTxModels.map((t) => t.id))
              return full.filter((f) => currentIds.has(f.transaction.id))
            },
          ),
        )
      }),
    )

    return {
      budget: budget$,
      spentAmount: spentAmount$.pipe(startWith(0)),
      categoryNames: categoryNames$.pipe(startWith([] as string[])),
      accountNames: accountNames$.pipe(startWith([] as string[])),
      transactionsFull: transactionsFull$.pipe(
        startWith([] as TransactionWithRelations[]),
      ),
    }
  },
)(BudgetDetailInner)

/* ------------------------------------------------------------------ */
/* Route component                                                    */
/* ------------------------------------------------------------------ */

export default function BudgetDetailScreen() {
  const { budgetId } = useLocalSearchParams<{ budgetId: string }>()
  if (!budgetId) return null
  return <EnhancedBudgetDetail budgetId={budgetId} />
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
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  budgetName: {
    ...theme.typography.titleMedium,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  periodBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius,
  },
  periodBadgeText: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  overBudgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${theme.colors.error}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius,
  },
  overBudgetText: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    color: theme.colors.error,
  },
  categoryText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  accountsText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
  },

  // Progress
  progressSection: {
    gap: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  remainingText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
    flexShrink: 0,
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

import { withObservables } from "@nozbe/watermelondb/react"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, View as RNView } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { map, of, startWith, switchMap } from "rxjs"

import { DynamicIcon } from "~/components/dynamic-icon"
import { LoanActionModal } from "~/components/loans/loan-action-modal"
import { Money } from "~/components/money"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type AccountModel from "~/database/models/account"
import type LoanModel from "~/database/models/loan"
import type TransactionModel from "~/database/models/transaction"
import { observeAccountById } from "~/database/services/account-service"
import {
  observeLoanById,
  observeLoanPaymentProgress,
  observeLoanTransactions,
} from "~/database/services/loan-service"
import {
  createTransactionModel,
  observeTransactionModelsFull,
  type TransactionWithRelations,
} from "~/database/services/transaction-service"
import { modelToLoan } from "~/database/utils/model-to-loan"
import type { Loan } from "~/types/loans"
import { LoanTypeEnum } from "~/types/loans"
import { TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

/* ------------------------------------------------------------------ */
/* Inner component (receives observed data)                           */
/* ------------------------------------------------------------------ */

const EMPTY_TRANSACTIONS: TransactionWithRelations[] = []

interface LoanDetailInnerProps {
  loanId: string
  loan?: Loan
  paidAmount?: number
  account?: AccountModel
  transactionsFull?: TransactionWithRelations[]
}

function LoanDetailInner({
  loanId,
  loan,
  paidAmount = 0,
  account,
  transactionsFull = EMPTY_TRANSACTIONS,
}: LoanDetailInnerProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { theme } = useUnistyles()
  const [actionModalVisible, setActionModalVisible] = useState(false)
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false)
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
      title: loan?.name ?? t("screens.settings.loans.detail.title"),
      headerRight: () => (
        <Button
          variant="ghost"
          size="icon"
          onPress={() =>
            router.push({
              pathname: "/settings/loans/[loanId]/modify",
              params: { loanId },
            })
          }
        >
          <IconSvg name="pencil" size={20} />
        </Button>
      ),
    })
  }, [navigation, router, loanId, loan?.name, t])

  if (!loan) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="default">
            {t("screens.settings.loans.form.loadingText")}
          </Text>
        </View>
      </View>
    )
  }

  const isLent = loan.loanType === LoanTypeEnum.LENT
  const paid = paidAmount ?? 0
  const principal = loan.principalAmount
  const progress = principal > 0 ? paid / principal : 0
  const clampedProgress = Math.min(progress, 1)
  const isPaid = progress >= 1
  const remaining = Math.max(principal - paid, 0)

  const progressBarColor = isPaid
    ? theme.colors.customColors.income
    : theme.colors.primary

  const dueDateLabel = (): string | null => {
    if (!loan.dueDate) return t("screens.settings.loans.card.noDueDate")
    return t("screens.settings.loans.card.dueDate", {
      date: loan.dueDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    })
  }

  const currencyCode = account?.currencyCode ?? ""

  const handleFullAction = () => {
    if (!loan || remaining <= 0) return

    const transactionType = isLent
      ? TransactionTypeEnum.INCOME
      : TransactionTypeEnum.EXPENSE

    const transactionTitle = isLent
      ? `${t("screens.settings.loans.actions.collect")}: ${loan.name}`
      : `${t("screens.settings.loans.actions.settle")}: ${loan.name}`

    const successTitle = isLent
      ? t("screens.settings.loans.actions.collectSuccess")
      : t("screens.settings.loans.actions.settleSuccess")

    setIsCreatingTransaction(true)

    Promise.resolve(
      createTransactionModel({
        amount: remaining,
        type: transactionType,
        transactionDate: new Date(),
        accountId: loan.accountId,
        categoryId: loan.categoryId,
        title: transactionTitle,
        description: null,
        isPending: false,
        tags: [],
        loanId: loan.id,
      }),
    )
      .then(() => {
        setActionModalVisible(false)
        Toast.success({ title: successTitle })
      })
      .catch((error) => {
        logger.error("Error creating loan repayment transaction", { error })
        Toast.error({ title: t("common.toast.error") })
      })
      .finally(() => {
        setIsCreatingTransaction(false)
      })
  }

  const handlePartialAction = () => {
    if (!loan) return
    setActionModalVisible(false)
    router.push({
      pathname: "/transaction/[id]",
      params: {
        id: "new",
        type: isLent ? "income" : "expense",
        accountId: loan.accountId,
        categoryId: loan.categoryId,
        loanId: loan.id,
      },
    })
  }

  const headerContent = (
    <View style={styles.headerCard}>
      {/* Icon + name + type badge + overdue badge */}
      <View style={styles.headerTopRow}>
        <DynamicIcon
          icon={loan.icon ?? "hand-coins"}
          size={36}
          colorScheme={loan.colorScheme}
          variant="badge"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.loanName}>{loan.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {isLent
                  ? t("screens.settings.loans.type.lent")
                  : t("screens.settings.loans.type.borrowed")}
              </Text>
            </View>
            {isPaid ? (
              <View style={styles.paidBadge}>
                <IconSvg
                  name="check"
                  size={14}
                  color={theme.colors.customColors.income}
                />
                <Text style={styles.paidBadgeText}>
                  {t("screens.settings.loans.card.completed")}
                </Text>
              </View>
            ) : loan.isOverdue ? (
              <View style={styles.overdueBadge}>
                <IconSvg
                  name="alert-circle"
                  size={14}
                  color={theme.colors.customColors.expense}
                />
                <Text style={styles.overdueText}>
                  {t("screens.settings.loans.card.overdue")}
                </Text>
              </View>
            ) : (
              <Text style={styles.dateText}>{dueDateLabel()}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Description */}
      {loan.description ? (
        <Text style={styles.description}>{loan.description}</Text>
      ) : null}

      {/* Progress bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <RNView
            style={[
              styles.progressFill,
              {
                width: `${(clampedProgress * 100).toFixed(1)}%` as `${number}%`,
                backgroundColor: progressBarColor,
              },
            ]}
          />
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>
            {isLent
              ? t("screens.settings.loans.card.received")
              : t("screens.settings.loans.card.paid")}
            :{" "}
            <Money
              value={paid}
              currency={currencyCode}
              tone="transfer"
              hideSign
            />{" "}
            {t("screens.settings.loans.card.of")}{" "}
            <Money
              value={principal}
              currency={currencyCode}
              tone="transfer"
              hideSign
            />
          </Text>
          <Text style={styles.remainingText}>
            {isPaid ? null : (
              <>
                <Money
                  value={remaining}
                  currency={currencyCode}
                  tone="transfer"
                  hideSign
                />{" "}
                {t("screens.settings.loans.card.remaining")}
              </>
            )}
          </Text>
        </View>
      </View>

      {/* Collect / Settle button */}
      {!isPaid && (
        <Button
          variant="default"
          onPress={() => setActionModalVisible(true)}
          style={styles.collectSettleButton}
        >
          <IconSvg
            name={isLent ? "arrow-down-circle" : "arrow-up-circle"}
            size={18}
            color={styles.collectSettleButtonIcon.color}
          />
          <Text variant="default" style={styles.collectSettleButtonText}>
            {isLent
              ? t("screens.settings.loans.actions.collect")
              : t("screens.settings.loans.actions.settle")}
          </Text>
        </Button>
      )}

      {/* Transactions section label */}
      <Text style={styles.transactionsLabel}>
        {t("screens.settings.loans.detail.transactions")}
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
              title={t("screens.settings.loans.detail.noTransactions")}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <LoanActionModal
        visible={actionModalVisible}
        loanType={loan.loanType}
        isLoading={isCreatingTransaction}
        onFullAction={handleFullAction}
        onPartialAction={handlePartialAction}
        onClose={() => setActionModalVisible(false)}
      />
    </View>
  )
}

/* ------------------------------------------------------------------ */
/* withObservables enhancement                                        */
/* ------------------------------------------------------------------ */

const EnhancedLoanDetail = withObservables(
  ["loanId"],
  ({ loanId }: { loanId: string }) => {
    const loanModel$ = observeLoanById(loanId)

    const loan$ = loanModel$.pipe(map((model: LoanModel) => modelToLoan(model)))

    const paidAmount$ = loanModel$.pipe(
      switchMap((model: LoanModel) =>
        observeLoanPaymentProgress(loanId, model.loanType),
      ),
    )

    const account$ = loanModel$.pipe(
      switchMap((model: LoanModel) => observeAccountById(model.accountId)),
    )

    const transactionsFull$ = observeLoanTransactions(loanId).pipe(
      startWith([] as TransactionModel[]),
      switchMap((txModels: TransactionModel[]) => {
        if (txModels.length === 0) return of([] as TransactionWithRelations[])
        return observeTransactionModelsFull({ loanId })
      }),
    )

    return {
      loan: loan$,
      paidAmount: paidAmount$.pipe(startWith(0)),
      account: account$,
      transactionsFull: transactionsFull$.pipe(
        startWith([] as TransactionWithRelations[]),
      ),
    }
  },
)(LoanDetailInner)

/* ------------------------------------------------------------------ */
/* Route component                                                    */
/* ------------------------------------------------------------------ */

export default function LoanDetailScreen() {
  const { loanId } = useLocalSearchParams<{ loanId: string }>()
  if (!loanId) return null
  return <EnhancedLoanDetail loanId={loanId} />
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
  loanName: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius,
  },
  typeBadgeText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${theme.colors.customColors.income}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius,
  },
  paidBadgeText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.customColors.income,
  },
  overdueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${theme.colors.customColors.expense}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius,
  },
  overdueText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    color: theme.colors.customColors.expense,
  },
  dateText: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  description: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
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
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginTop: 6,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  // Collect / Settle button
  collectSettleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  collectSettleButtonIcon: {
    color: theme.colors.onPrimary,
  },
  collectSettleButtonText: {
    fontWeight: "600",
  },
}))

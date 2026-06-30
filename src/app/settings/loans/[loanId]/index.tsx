import { differenceInDays } from "date-fns"
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, FlatList, View as RNView } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { LoanActionModal } from "~/components/loans/loan-action-modal"
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
import { getLoanProgress } from "~/database/repos/loan-repo"
import { createTransaction } from "~/database/services-sqlite/transaction-service"
import { useAccount } from "~/stores/db/account.store"
import { useLoan } from "~/stores/db/loan.store"
import { useTransactions } from "~/stores/db/transaction.store"
import { useLanguageStore } from "~/stores/language.store"
import { LoanTypeEnum } from "~/types/loans"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { logger } from "~/utils/logger"
import { formatShortMonthDay } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

/* ------------------------------------------------------------------ */
/* Detail screen                                                      */
/* ------------------------------------------------------------------ */

function LoanDetailInner({ loanId }: { loanId: string }) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)
  const [actionModalVisible, setActionModalVisible] = useState(false)
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0)
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)

  const loan = useLoan(loanId)
  const account = useAccount(loan?.accountId ?? "")
  const { items: transactionsFull } = useTransactions(loan ? { loanId } : {})

  useEffect(() => {
    if (!loan) return
    let cancelled = false
    const fetch = () =>
      getLoanProgress(loanId, loan.loanType).then((v) => {
        if (!cancelled) setPaidAmount(v)
      })
    fetch()
    const unsub = on("transactions:dirty", fetch)
    return () => {
      cancelled = true
      unsub()
    }
  }, [loanId, loan])

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
      title: t("screens.settings.loans.detail.title"),
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
          <IconSvg name="pencil-outline" size={20} />
        </Button>
      ),
    })
  }, [navigation, router, loanId, t])

  if (!loan) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
  }

  const isLent = loan.loanType === LoanTypeEnum.LENT
  const paid = paidAmount
  const principal = loan.principalAmount
  const progress = principal > 0 ? paid / principal : 0
  const clampedProgress = Math.min(progress, 1)
  const isPaid = progress >= 1
  const remaining = Math.max(principal - paid, 0)

  const accentColor = loan.colorScheme?.primary ?? theme.colors.primary
  const accentTint = loan.colorScheme?.secondary ?? `${theme.colors.primary}20`
  const mutedColor = theme.colors.onSecondary

  const progressBarColor = isPaid ? mutedColor : accentColor

  const dueText = (): string => {
    if (isPaid) return t("screens.settings.loans.card.settled")
    if (!loan.dueDate) return t("screens.settings.loans.card.noDueDate")
    const diff = differenceInDays(loan.dueDate, new Date())
    if (diff === 0) return t("screens.settings.loans.card.dueToday")
    if (diff === 1) return t("screens.settings.loans.card.dueTomorrow")
    if (diff > 1 && diff <= 14)
      return t("screens.settings.loans.card.dueInDays", { count: diff })
    return t("screens.settings.loans.card.dueDate", {
      date: formatShortMonthDay(loan.dueDate),
    })
  }

  const subtitleParts = [account?.name, dueText()].filter(Boolean)
  const subtitleColor =
    loan.isOverdue && !isPaid ? theme.colors.semantic.expense : mutedColor

  const badgeLabel = isPaid
    ? t("screens.settings.loans.card.statusPaid")
    : isLent
      ? t("screens.settings.loans.type.lent")
      : t("screens.settings.loans.type.borrowed")
  const badgeIcon =
    isLent || isPaid ? "arrow-up-right-outline" : "arrow-down-left-outline"
  const badgeColor = isPaid ? mutedColor : accentColor
  const badgeBg = isPaid ? theme.colors.secondary : accentTint

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
      createTransaction({
        amount: remaining,
        type: transactionType,
        subtype: isLent
          ? TransactionSubTypeEnum.LOAN_RECEIVED
          : TransactionSubTypeEnum.LOAN_REPAYMENT,
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
      <View style={styles.headerTopRow}>
        <DynamicIcon
          icon={loan.icon ?? "hand-coins"}
          size={24}
          colorScheme={loan.colorScheme}
          variant="badge"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.loanName} numberOfLines={1}>
            {loan.name}
          </Text>
          <Text
            style={[styles.subtitle, { color: subtitleColor }]}
            numberOfLines={1}
          >
            {subtitleParts.join(" · ")}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <IconSvg
            name={badgeIcon}
            size={12}
            color={badgeColor}
            style={isRTL ? styles.badgeIconRTL : undefined}
          />
          <Text
            style={[
              styles.badgeText,
              { color: badgeColor },
              isRTL && styles.badgeTextRTL,
            ]}
          >
            {badgeLabel}
          </Text>
        </View>
      </View>

      {loan.description ? (
        <Text style={styles.description}>{loan.description}</Text>
      ) : null}

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <RNView
            style={[
              styles.progressFill,
              {
                width:
                  `${(clampedProgress * 100).toFixed(1)}%` as DimensionValue,
                backgroundColor: progressBarColor,
              },
            ]}
          />
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>
            {isLent
              ? t("screens.settings.loans.card.received")
              : t("screens.settings.loans.card.paidBack")}{" "}
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
          {isPaid ? (
            <Text style={[styles.remainingText, { color: mutedColor }]}>
              {t("screens.settings.loans.card.settled")}
            </Text>
          ) : (
            <Money
              value={remaining}
              currency={currencyCode}
              tone="transfer"
              hideSign
              style={[styles.remainingText, { color: accentColor }]}
            />
          )}
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
            name={
              isLent ? "arrow-down-circle-outline" : "arrow-up-circle-outline"
            }
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
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="receipt-outline"
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
/* Route component                                                    */
/* ------------------------------------------------------------------ */

export default function LoanDetailScreen() {
  const { loanId } = useLocalSearchParams<{ loanId: string }>()
  if (!loanId) return null
  return <LoanDetailInner loanId={loanId} />
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
    gap: 2,
    minWidth: 0,
  },
  loanName: {
    fontSize: theme.typography.titleMedium.fontSize,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  subtitle: {
    fontSize: theme.typography.labelMedium.fontSize,
  },
  badge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  badgeTextRTL: {
    letterSpacing: 0,
  },
  badgeIconRTL: {
    transform: [{ scaleX: -1 }],
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
    flexShrink: 0,
    fontWeight: "600",
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

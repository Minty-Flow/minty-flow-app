import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, FlatList, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { LoanActionSheet } from "~/components/loans/loan-action-sheet"
import { getLoanDisplay } from "~/components/loans/loan-display"
import { Money } from "~/components/money"
import { planningDetailStyles } from "~/components/planning/planning-detail.styles"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useAccount } from "~/database/drizzle/read-models/account-read-model"
import { useLoansQuery } from "~/database/drizzle/read-models/loan-read-model"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import { createTransaction } from "~/database/services/ledger-service"
import { useLoanTermReconcile } from "~/hooks/use-loan-term-reconcile"
import { useSingleOpenSwipeable } from "~/hooks/use-transaction-list-state"
import { useLanguageStore } from "~/stores/language.store"
import { TransactionTypeEnum } from "~/types/transactions"
import { logger } from "~/utils/logger"
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
  const [actionSheetVisible, setActionSheetVisible] = useState(false)
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false)
  const { onWillOpen: handleWillOpen, closeOpen: closeOpenSwipeable } =
    useSingleOpenSwipeable()
  const loansQuery = useLoansQuery()
  const loan = loansQuery.data.find((item) => item.id === loanId)
  const reconcileLoans = useMemo(() => (loan ? [loan] : []), [loan])
  useLoanTermReconcile(reconcileLoans)
  const account = useAccount(loan?.accountId ?? "")
  // Filter by loanId so the list shows only this loan's rows. Progress itself
  // comes from the loan read-model (loan.repaidAmount), not this list.
  const { items: transactionsFull, status: transactionsStatus } =
    useTransactions({ loanId })
  const handleTransactionPress = (id: string) => {
    router.push({ pathname: "/transaction/[id]", params: { id } })
  }
  const handleDeleteDone = () => {
    closeOpenSwipeable()
  }
  const renderTransactionItem = ({
    item,
  }: {
    item: TransactionWithRelations
  }) => (
    <TransactionItem
      transactionWithRelations={item}
      onPress={() => handleTransactionPress(item.id)}
      onDelete={handleDeleteDone}
      onWillOpen={handleWillOpen}
    />
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
  const transactionsPending =
    transactionsStatus !== "ready" && transactionsStatus !== "error"
  if (!loan) {
    return loansQuery.status === "loading" ? (
      <RouteLoadingState />
    ) : (
      <RouteNotFoundState message={t("common.notFound.loan")} />
    )
  }
  if (transactionsPending) return <RouteLoadingState />
  const {
    isLent,
    paid,
    principal,
    clampedProgress,
    isPaid,
    remaining,
    accentColor,
    mutedColor,
    subtitleParts,
    subtitleColor,
    badgeLabel,
    badgeIcon,
    badgeColor,
    badgeBg,
    progressBarColor,
    isLongTerm,
  } = getLoanDisplay(loan, account, t, theme)
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
        kind: loan.loanType,
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
        setActionSheetVisible(false)
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
    setActionSheetVisible(false)
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
    <View style={planningDetailStyles.headerCard}>
      <View style={planningDetailStyles.headerTopRow}>
        <DynamicIcon
          icon={loan.icon ?? "scale-outline"}
          size={24}
          colorScheme={loan.colorScheme}
          variant="badge"
        />
        <View style={planningDetailStyles.headerInfo}>
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
        <Text style={planningDetailStyles.description}>{loan.description}</Text>
      ) : null}

      {isLongTerm ? (
        <View style={planningDetailStyles.progressSection}>
          <View style={planningDetailStyles.progressTrack}>
            <RNView
              style={[
                planningDetailStyles.progressFill,
                {
                  width: `${clampedProgress * 100}%` as DimensionValue,
                  backgroundColor: progressBarColor,
                },
              ]}
            />
          </View>
          <View style={planningDetailStyles.amountRow}>
            <Text style={planningDetailStyles.amountText}>
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
              <Text
                style={[
                  planningDetailStyles.remainingText,
                  { color: mutedColor },
                ]}
              >
                {t("screens.settings.loans.card.settled")}
              </Text>
            ) : (
              <Money
                value={remaining}
                currency={currencyCode}
                tone="transfer"
                hideSign
                style={[
                  planningDetailStyles.remainingText,
                  { color: accentColor },
                ]}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={planningDetailStyles.progressSection}>
          <View style={planningDetailStyles.amountRow}>
            <Text style={planningDetailStyles.amountText}>
              {isLent
                ? t("screens.settings.loans.type.lent")
                : t("screens.settings.loans.type.borrowed")}
            </Text>
            {isPaid ? (
              <Text
                style={[
                  planningDetailStyles.remainingText,
                  { color: mutedColor },
                ]}
              >
                {t("screens.settings.loans.card.settled")}
              </Text>
            ) : (
              <Money
                value={principal}
                currency={currencyCode}
                tone="transfer"
                hideSign
                style={[
                  planningDetailStyles.remainingText,
                  { color: accentColor },
                ]}
              />
            )}
          </View>
        </View>
      )}

      {/* Collect / Settle button */}
      {!isPaid && (
        <Button
          variant="default"
          onPress={() => setActionSheetVisible(true)}
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
    <View style={planningDetailStyles.container}>
      <FlatList
        data={transactionsFull}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={headerContent}
        ListEmptyComponent={
          <View style={planningDetailStyles.emptyContainer}>
            <EmptyState
              icon="receipt-outline"
              title={t("screens.settings.loans.detail.noTransactions")}
            />
          </View>
        }
        contentContainerStyle={planningDetailStyles.listContent}
      />
      <LoanActionSheet
        visible={actionSheetVisible}
        loanType={loan.loanType}
        isLoading={isCreatingTransaction}
        onFullAction={handleFullAction}
        onPartialAction={handlePartialAction}
        onClose={() => setActionSheetVisible(false)}
      />
    </View>
  )
}
/* ------------------------------------------------------------------ */
/* Route component                                                    */
/* ------------------------------------------------------------------ */
export default function LoanDetailScreen() {
  const { loanId } = useLocalSearchParams<{
    loanId: string
  }>()
  if (!loanId) return null
  return <LoanDetailInner loanId={loanId} />
}
/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */
const styles = StyleSheet.create((theme) => ({
  // Header card
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
  // Transactions
  transactionsLabel: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginTop: 6,
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

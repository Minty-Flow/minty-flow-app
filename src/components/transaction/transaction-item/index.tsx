import { useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import Swipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import type { SharedValue } from "react-native-reanimated"
import { useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
import { deleteTransaction } from "~/database/services-sqlite/transaction-service"
import { deleteTransfer } from "~/database/services-sqlite/transfer-service"
import { useIsConfirmable } from "~/hooks/use-time-reactivity"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useTransactionItemAppearanceStore } from "~/stores/transaction-item-appearance.store"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import {
  TransactionSubTypeEnum,
  TransactionTypeEnum,
} from "~/types/transactions"
import { formatFriendlyDate, formatReadableTime } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

import { LeftAction } from "./left-action"
import { RightAction } from "./right-action"
import { transactionItemStyles } from "./styles"
import { TransactionItemLeft } from "./transaction-item-left"
import { TransactionItemRight } from "./transaction-item-right"

const TRASH_ACTION_WIDTH = 100

type TransactionItemVariant = "default" | "upcoming"

interface TransactionItemProps {
  transactionWithRelations: TransactionWithRelations
  onPress?: () => void
  onDelete?: () => void
  /** If provided and returns true, parent handles delete (e.g. shows recurring modal); item will not delete and only close swipe. */
  onBeforeDelete?: (row: TransactionWithRelations) => boolean | Promise<boolean>
  /** Left-swipe restore action. Only shown when the transaction is already deleted (trash). */
  onRestore?: () => void
  onConfirm?: () => void
  onWillOpen?: (methods: SwipeableMethods) => void
  rightActionAccessibilityLabel?: string
  leftActionAccessibilityLabel?: string
  variant?: TransactionItemVariant
}

export const TransactionItem = ({
  transactionWithRelations,
  onPress,
  onDelete,
  onBeforeDelete,
  onRestore,
  onConfirm,
  onWillOpen,
  rightActionAccessibilityLabel,
  leftActionAccessibilityLabel,
  variant = "default",
}: TransactionItemProps) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null)
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const {
    id,
    account,
    category,
    relatedAccount,
    conversionRate,
    isTransfer: txIsTransfer,
    type,
    amount,
    title,
    transactionDate,
    requiresManualConfirmation,
    extra,
    isDeleted,
    transferId,
    subtype,
  } = transactionWithRelations

  const isTransfer = txIsTransfer || type === TransactionTypeEnum.TRANSFER
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)
  const isCombinedTransfer = Boolean(
    isTransfer && transferLayout === "combine" && relatedAccount,
  )
  const isCrossCurrencyTransfer =
    isTransfer &&
    relatedAccount &&
    conversionRate != null &&
    conversionRate > 0 &&
    account?.currencyCode !== relatedAccount.currencyCode
  const otherCurrencyAmount =
    isCrossCurrencyTransfer && conversionRate
      ? amount < 0
        ? Math.abs(amount) * conversionRate
        : amount / conversionRate
      : null
  const icon = isTransfer ? "arrows-right-left-outline" : category?.icon
  const amountTone = isTransfer
    ? amount < 0
      ? TransactionTypeEnum.EXPENSE
      : TransactionTypeEnum.INCOME
    : subtype === TransactionSubTypeEnum.REFUND
      ? TransactionTypeEnum.INCOME
      : type

  // ── Appearance preferences ──────────────────────────────────────────────
  const appearanceVariant = useTransactionItemAppearanceStore((s) => s.variant)
  const showCategoryInSubtitle = useTransactionItemAppearanceStore(
    (s) => s.showCategory,
  )
  const showCategoryForUntitled = useTransactionItemAppearanceStore(
    (s) => s.showCategoryForUntitled,
  )
  const leadingIconPref = useTransactionItemAppearanceStore(
    (s) => s.leadingIcon,
  )

  const untitledLabel = t("common.transaction.untitledTransaction")

  const trimmedTitle = title?.trim()

  const isUntitled = !trimmedTitle

  const displayTitle =
    showCategoryForUntitled && isUntitled
      ? (category?.name ?? untitledLabel)
      : (trimmedTitle ?? untitledLabel)

  const displayIcon =
    leadingIconPref === "account" ? (account?.icon ?? icon) : icon
  const displayColorScheme =
    leadingIconPref === "account" ? account?.colorScheme : category?.colorScheme

  const globalRequireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const requireConfirmation =
    requiresManualConfirmation ?? globalRequireConfirmation

  const isUpcoming = variant === "upcoming"
  const isConfirmable = useIsConfirmable(transactionWithRelations)
  const isAutoRecurring = Boolean(extra?.recurringId)

  const accountLabel =
    isCombinedTransfer && relatedAccount
      ? `${account?.name} → ${relatedAccount.name}`
      : account?.name
  const categorySegment =
    showCategoryInSubtitle && !isTransfer
      ? !category
        ? ` • ${t("common.transaction.uncategorized")}`
        : ` • ${category.name}`
      : ""
  const timeSegment = isUpcoming
    ? ` • ${formatFriendlyDate(transactionDate)}, ${formatReadableTime(transactionDate)}`
    : ` • ${formatReadableTime(transactionDate)}`
  const subtitleText = `${accountLabel}${categorySegment}${timeSegment}`

  const showRecurringBadge = isUpcoming && isAutoRecurring
  const showPendingBadge = isUpcoming && !isAutoRecurring

  const handleRestorePress = useCallback(
    (closeSwipe: () => void) => {
      closeSwipe()
      onRestore?.()
    },
    [onRestore],
  )

  const renderLeftActions = useCallback(
    (
      progress: SharedValue<number>,
      translation: SharedValue<number>,
      swipeableMethods: { close: () => void },
    ) => (
      <LeftAction
        progress={progress}
        translation={translation}
        onRestorePress={() => handleRestorePress(swipeableMethods.close)}
        accessibilityLabel={leftActionAccessibilityLabel}
      />
    ),
    [handleRestorePress, leftActionAccessibilityLabel],
  )

  const handleTrashPress = useCallback(
    async (closeSwipe: () => void) => {
      if (onBeforeDelete) {
        const handled = await Promise.resolve(
          onBeforeDelete(transactionWithRelations),
        )
        if (handled) {
          closeSwipe()
          return
        }
      }
      if (isDeleted) {
        closeSwipe()
        onDelete?.()
        return
      }
      const promise =
        txIsTransfer && transferId ? deleteTransfer(id) : deleteTransaction(id)
      promise
        .then(() =>
          Toast.success({
            title: isUpcoming
              ? t("components.transactionItem.canceled")
              : t("components.transactionForm.toast.movedToTrash"),
          }),
        )
        .catch(() =>
          Toast.error({
            title: isUpcoming
              ? t("components.transactionItem.failedToDelete")
              : t("components.transactionForm.toast.moveToTrashFailed"),
          }),
        )
        .finally(() => {
          closeSwipe()
          onDelete?.()
        })
    },
    [
      id,
      txIsTransfer,
      transferId,
      isDeleted,
      transactionWithRelations,
      isUpcoming,
      onDelete,
      onBeforeDelete,
      t,
    ],
  )

  const renderRightActions = (
    progress: SharedValue<number>,
    translation: SharedValue<number>,
    swipeableMethods: { close: () => void },
  ) => (
    <RightAction
      progress={progress}
      translation={translation}
      onTrashPress={() => handleTrashPress(swipeableMethods.close)}
      accessibilityLabel={rightActionAccessibilityLabel}
    />
  )

  const content = (
    <View style={transactionItemStyles.container}>
      <Pressable
        style={[
          transactionItemStyles.mainTouchable,
          appearanceVariant === "elevated" &&
            transactionItemStyles.mainTouchableElevated,
        ]}
        onPress={onPress}
      >
        <TransactionItemLeft
          displayIcon={displayIcon}
          displayColorScheme={displayColorScheme}
          displayTitle={displayTitle}
          subtitleText={subtitleText}
          isRefund={subtype === TransactionSubTypeEnum.REFUND}
        />
        <TransactionItemRight
          amount={amount}
          currencyCode={account?.currencyCode ?? ""}
          amountTone={amountTone}
          isTransfer={isTransfer}
          isCombinedTransfer={isCombinedTransfer}
          isCrossCurrencyTransfer={isCrossCurrencyTransfer}
          otherCurrencyAmount={otherCurrencyAmount}
          relatedAccountCurrencyCode={relatedAccount?.currencyCode}
          showRecurringBadge={showRecurringBadge}
          showPendingBadge={showPendingBadge}
        />
      </Pressable>

      {isUpcoming && isConfirmable && requireConfirmation && onConfirm && (
        <Pressable
          style={[
            transactionItemStyles.confirmButton,
            { backgroundColor: theme.colors.semantic.success },
          ]}
          onPress={onConfirm}
          accessibilityLabel={t("screens.home.upcoming.a11y.confirm")}
        >
          <IconSvg name="check" size={18} color={theme.colors.onError} />
        </Pressable>
      )}
    </View>
  )

  if (onDelete == null) {
    return content
  }

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      overshootFriction={8}
      // Threshold / friction = raw distance needed. /4 → 50px raw swipe to open (vs /2 → 100px). Reliable on slow swipes.
      rightThreshold={TRASH_ACTION_WIDTH / 4}
      leftThreshold={onRestore ? TRASH_ACTION_WIDTH / 4 : undefined}
      overshootRight={false}
      overshootLeft={false}
      containerStyle={[
        transactionItemStyles.swipeableContainer,
        { backgroundColor: theme.colors.error },
      ]}
      renderRightActions={renderRightActions}
      renderLeftActions={onRestore ? renderLeftActions : undefined}
      onSwipeableWillOpen={() => {
        const methods = swipeableRef.current
        if (methods) onWillOpen?.(methods)
      }}
    >
      {content}
    </Swipeable>
  )
}

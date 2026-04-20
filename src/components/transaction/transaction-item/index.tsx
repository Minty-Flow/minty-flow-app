import { useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import Swipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable"
import type { SharedValue } from "react-native-reanimated"
import { useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import type { TransactionWithRelations } from "~/database/services/transaction-service"
import { deleteTransactionModel } from "~/database/services/transaction-service"
import { deleteTransfer } from "~/database/services/transfer-service"
import { useIsConfirmable } from "~/hooks/use-time-reactivity"
import { usePendingTransactionsStore } from "~/stores/pending-transactions.store"
import { useTransactionItemAppearanceStore } from "~/stores/transaction-item-appearance.store"
import { useTransfersPreferencesStore } from "~/stores/transfers-preferences.store"
import { TransactionTypeEnum } from "~/types/transactions"
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
  const { transaction, account, category, relatedAccount, conversionRate } =
    transactionWithRelations

  const colorScheme = category?.colorScheme ?? account.colorScheme
  const isTransfer =
    transaction.isTransfer || transaction.type === TransactionTypeEnum.TRANSFER
  const transferLayout = useTransfersPreferencesStore((s) => s.layout)
  const isCombinedTransfer = Boolean(
    isTransfer && transferLayout === "combine" && relatedAccount,
  )
  const isCrossCurrencyTransfer =
    isTransfer &&
    relatedAccount &&
    conversionRate != null &&
    conversionRate > 0 &&
    account.currencyCode !== relatedAccount.currencyCode
  const otherCurrencyAmount =
    isCrossCurrencyTransfer && conversionRate
      ? transaction.amount < 0
        ? Math.abs(transaction.amount) * conversionRate
        : transaction.amount / conversionRate
      : null
  const icon = isTransfer ? "transfer" : category?.icon
  const amountTone = isTransfer
    ? transaction.amount < 0
      ? TransactionTypeEnum.EXPENSE
      : TransactionTypeEnum.INCOME
    : transaction.type

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

  const title = transaction.title?.trim()

  const isUntitled = !title

  const displayTitle =
    showCategoryForUntitled && isUntitled
      ? (category?.name ?? untitledLabel)
      : (title ?? untitledLabel)

  const displayIcon =
    leadingIconPref === "account" ? (account.icon ?? icon) : icon
  const displayColorScheme =
    leadingIconPref === "account" ? account.colorScheme : colorScheme

  const globalRequireConfirmation = usePendingTransactionsStore(
    (s) => s.requireConfirmation,
  )
  const requireConfirmation =
    transaction.requiresManualConfirmation ?? globalRequireConfirmation

  const isUpcoming = variant === "upcoming"
  const isConfirmable = useIsConfirmable(transaction)
  const isAutoRecurring = Boolean(transaction.extra?.recurringId)

  const accountLabel =
    isCombinedTransfer && relatedAccount
      ? `${account.name} → ${relatedAccount.name}`
      : account.name
  const categorySegment =
    showCategoryInSubtitle && !isTransfer
      ? category === null
        ? ` · ${t("common.transaction.uncategorized")}`
        : ` · ${category.name}`
      : ""
  const timeSegment = isUpcoming
    ? ` · ${formatFriendlyDate(transaction.transactionDate)}, ${formatReadableTime(transaction.transactionDate)}`
    : ` · ${formatReadableTime(transaction.transactionDate)}`
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
      if (transaction.isDeleted) {
        closeSwipe()
        onDelete?.()
        return
      }
      const promise =
        transaction.isTransfer && transaction.transferId
          ? deleteTransfer(transaction)
          : deleteTransactionModel(transaction)
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
      transaction,
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
        />
        <TransactionItemRight
          amount={transaction.amount}
          currencyCode={account.currencyCode}
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
            { backgroundColor: theme.colors.customColors.success },
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
      rightThreshold={TRASH_ACTION_WIDTH / 2}
      leftThreshold={onRestore ? TRASH_ACTION_WIDTH / 2 : undefined}
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

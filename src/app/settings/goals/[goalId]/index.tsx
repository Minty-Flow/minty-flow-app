import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, FlatList, View as RNView } from "react-native"
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { TransactionItem } from "~/components/transaction/transaction-item"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { EmptyState } from "~/components/ui/empty-state"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { unarchiveGoalById } from "~/database/services/goal-service"
import type { TranslationKey } from "~/i18n/config"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useGoal } from "~/stores/db/goal.store"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/stores/db/transaction.store"
import { useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { getLiveGoalProgress } from "~/utils/live-progress"
import { logger } from "~/utils/logger"
import { roundToSafeInteger } from "~/utils/money"
import { formatMoney } from "~/utils/number-format"
import {
  type GoalStatus,
  getGoalProgressModel,
} from "~/utils/planning-progress"
import { Toast } from "~/utils/toast"

/* ------------------------------------------------------------------ */
/* Detail screen                                                      */
/* ------------------------------------------------------------------ */
function GoalDetailInner({ goalId }: { goalId: string }) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)
  const openSwipeableRef = useRef<SwipeableMethods | null>(null)
  const [unarchiveModalVisible, setUnarchiveModalVisible] = useState(false)
  const goal = useGoal(goalId)
  const allAccounts = useActiveAccounts()
  const { items: transactionsFull } = useTransactions({ goalId })
  const currentAmount = goal ? getLiveGoalProgress(goal, transactionsFull) : 0
  const accountNames = (() => {
    const accountNameById = new Map(allAccounts.map((a) => [a.id, a.name]))
    return (goal?.accountIds ?? []).flatMap((id) => {
      const name = accountNameById.get(id)
      return name ? [name] : []
    })
  })()
  const handleTransactionPress = (id: string) => {
    router.push({ pathname: "/transaction/[id]", params: { id } })
  }
  const handleDeleteDone = () => {
    openSwipeableRef.current?.close()
  }
  const handleWillOpen = (methods: SwipeableMethods) => {
    openSwipeableRef.current?.close()
    openSwipeableRef.current = methods
  }
  const handleUnarchive = async () => {
    try {
      await unarchiveGoalById(goalId)
      Toast.success({ title: t("screens.settings.goals.unarchiveSuccess") })
    } catch (error) {
      logger.error("Error unarchiving goal", { error })
      Toast.error({ title: t("common.toast.error") })
    }
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
  const isArchived = goal?.isArchived ?? false
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t("screens.settings.goals.detail.title"),
      headerRight: () =>
        isArchived ? (
          <Button
            variant="ghost"
            size="icon"
            onPress={() => setUnarchiveModalVisible(true)}
          >
            <IconSvg name="archive-off-outline" size={20} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onPress={() =>
              router.push({
                pathname: "/settings/goals/[goalId]/modify",
                params: { goalId },
              })
            }
          >
            <IconSvg name="pencil-outline" size={20} />
          </Button>
        ),
    })
  }, [navigation, router, goalId, isArchived, t])
  if (!goal) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
  }
  const isExpenseGoal = goal.goalType === "expense"
  const {
    currentAmount: resolved,
    clampedProgress,
    isCompleted,
    remaining,
    daysLeft,
    status,
  } = getGoalProgressModel(goal, currentAmount)
  const statusColors: Record<
    GoalStatus,
    {
      dot: string
      text: string
      bg: string
    }
  > = {
    reached: {
      dot: theme.colors.semantic.income,
      text: theme.colors.semantic.income,
      bg: `${theme.colors.semantic.income}20`,
    },
    onTrack: {
      dot: theme.colors.semantic.income,
      text: theme.colors.semantic.income,
      bg: `${theme.colors.semantic.income}20`,
    },
    behind: {
      dot: theme.colors.semantic.expense,
      text: theme.colors.semantic.expense,
      bg: `${theme.colors.semantic.expense}20`,
    },
    flexible: {
      dot: theme.colors.onSecondary,
      text: theme.colors.onSecondary,
      bg: theme.colors.secondary,
    },
  }
  const badge = statusColors[status]
  const progressBarColor =
    isCompleted || status === "reached"
      ? theme.colors.semantic.income
      : status === "behind"
        ? theme.colors.semantic.expense
        : theme.colors.primary
  const dateSubtitle = (): string => {
    if (isCompleted) return t("screens.settings.goals.card.reachedLabel")
    if (daysLeft === null) return t("screens.settings.goals.card.noDeadline")
    if (daysLeft === 0)
      return t("screens.settings.goals.card.daysLeft", { count: 0 })
    if (daysLeft < 0)
      return t("screens.settings.goals.card.overdue", {
        count: Math.abs(daysLeft),
      })
    return t("screens.settings.goals.card.daysLeft", { count: daysLeft })
  }
  const insightText = (): string => {
    if (isCompleted) return t("screens.settings.goals.card.insight.goalReached")
    if (daysLeft === null) return t("screens.settings.goals.card.noDeadline")
    const daily = remaining / Math.max(daysLeft, 1)
    const raw = formatMoney(roundToSafeInteger(daily), goal.currencyCode, {
      currencyDisplay: currencyLook,
      hideSign: true,
    })
    const amount = privacyMode ? raw.replace(/[\d٠-٩۰-۹]/gu, "⁕") : raw
    const key = isExpenseGoal
      ? "screens.settings.goals.card.insight.spendPerDay"
      : "screens.settings.goals.card.insight.savePerDay"
    return t(key, { amount })
  }
  const progressLabel = isExpenseGoal
    ? t("screens.settings.goals.card.spent")
    : t("screens.settings.goals.card.saved")
  const headerContent = (
    <View style={styles.headerCard}>
      <View style={styles.headerTopRow}>
        <DynamicIcon
          icon={goal.icon || "target-outline"}
          size={24}
          colorScheme={goal.colorScheme}
          variant="badge"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.goalName} numberOfLines={1}>
            {goal.name}
          </Text>
          <Text style={styles.dateSubtitle} numberOfLines={1}>
            {dateSubtitle()}
          </Text>
        </View>
        {isArchived ? (
          <View style={styles.archivedBadge}>
            <IconSvg
              name="archive-outline"
              size={12}
              color={theme.colors.onSecondary}
            />
            <Text
              style={[styles.archivedText, isRTL && styles.archivedTextRTL]}
            >
              {t("screens.settings.goals.card.archived")}
            </Text>
          </View>
        ) : (
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <RNView
              style={[styles.statusDot, { backgroundColor: badge.dot }]}
            />
            <Text
              style={[
                styles.statusText,
                { color: badge.text },
                isRTL && styles.statusTextRTL,
              ]}
            >
              {t(
                `screens.settings.goals.card.status.${status}` as TranslationKey,
              )}
            </Text>
          </View>
        )}
      </View>

      {goal.description ? (
        <Text style={styles.description}>{goal.description}</Text>
      ) : null}

      <Text style={styles.accountsText}>
        {accountNames.length > 0
          ? accountNames.join(", ")
          : t("screens.settings.goals.card.allAccounts")}
      </Text>

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <RNView
            style={[
              styles.progressFill,
              {
                width: `${clampedProgress * 100}%` as DimensionValue,
                backgroundColor: progressBarColor,
              },
            ]}
          />
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>
            {progressLabel}{" "}
            <Money
              value={resolved}
              currency={goal.currencyCode}
              tone="transfer"
              hideSign
            />{" "}
            {t("screens.settings.goals.card.of")}{" "}
            <Money
              value={goal.targetAmount}
              currency={goal.currencyCode}
              tone="transfer"
              hideSign
            />
          </Text>
          {isCompleted ? (
            <Text
              style={[
                styles.remainingText,
                { color: theme.colors.semantic.income },
              ]}
            >
              100%
            </Text>
          ) : (
            <Money
              value={remaining}
              currency={goal.currencyCode}
              tone="income"
              hideSign
              style={[
                styles.remainingText,
                { color: theme.colors.semantic.income },
              ]}
            />
          )}
        </View>
      </View>

      <Text style={styles.insight}>{insightText()}</Text>

      {/* Pending transactions notice — always shown so users know pending txns are excluded */}
      <View style={styles.pendingNoticeRow}>
        <IconSvg
          name="info-circle-outline"
          size={14}
          color={theme.colors.onSecondary}
        />
        <Text style={styles.pendingNoticeText}>
          {t("screens.settings.goals.detail.pendingNotice")}
        </Text>
      </View>

      {/* Transactions section label */}
      <Text style={styles.transactionsLabel}>
        {t("screens.settings.goals.detail.transactions")}
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
              title={t("screens.settings.goals.detail.noTransactions")}
            />
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <ConfirmModal
        visible={unarchiveModalVisible}
        onRequestClose={() => setUnarchiveModalVisible(false)}
        onConfirm={handleUnarchive}
        title={t("screens.settings.goals.form.archiveModal.unarchiveTitle")}
        description={goal.name}
        confirmLabel={t(
          "screens.settings.goals.form.archiveModal.unarchiveConfirm",
        )}
        cancelLabel={t("common.actions.cancel")}
        variant="default"
        icon="archive-off-outline"
      />
    </View>
  )
}
/* ------------------------------------------------------------------ */
/* Route component                                                    */
/* ------------------------------------------------------------------ */
export default function GoalDetailScreen() {
  const { goalId } = useLocalSearchParams<{
    goalId: string
  }>()
  if (!goalId) return null
  return <GoalDetailInner goalId={goalId} />
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
  goalName: {
    ...theme.typography.titleMedium,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  dateSubtitle: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  statusBadge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
  archivedBadge: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    backgroundColor: theme.colors.secondary,
  },
  archivedText: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: theme.colors.onSecondary,
    textTransform: "uppercase",
  },
  archivedTextRTL: {
    letterSpacing: 0,
  },
  description: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    lineHeight: 20,
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
    flexShrink: 0,
    fontWeight: "600",
  },
  insight: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.onSecondary,
    fontStyle: "italic",
  },
  // Pending notice
  pendingNoticeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pendingNoticeText: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.onSecondary,
    flex: 1,
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

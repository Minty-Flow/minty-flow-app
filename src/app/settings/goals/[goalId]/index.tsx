import { useLocalSearchParams, useNavigation, useRouter } from "expo-router"
import { useLayoutEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, FlatList, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { DynamicIcon } from "~/components/dynamic-icon"
import { getGoalDisplay } from "~/components/goals/goal-display"
import { IconSvg } from "~/components/icons"
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
import { useActiveAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useGoalsQuery } from "~/database/drizzle/read-models/goal-read-model"
import {
  type TransactionWithRelations,
  useTransactions,
} from "~/database/drizzle/read-models/transaction-read-model"
import { unarchiveGoalById } from "~/database/services/goal-service"
import { useSingleOpenSwipeable } from "~/hooks/use-transaction-list-state"
import type { TranslationKey } from "~/i18n/config"
import { useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { getLiveGoalProgress } from "~/utils/live-progress"
import { logger } from "~/utils/logger"
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
  const { onWillOpen: handleWillOpen, closeOpen: closeOpenSwipeable } =
    useSingleOpenSwipeable()
  const [unarchiveSheetVisible, setUnarchiveSheetVisible] = useState(false)
  const goalsQuery = useGoalsQuery()
  const goal = goalsQuery.data.find((item) => item.id === goalId)
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
    closeOpenSwipeable()
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
            onPress={() => setUnarchiveSheetVisible(true)}
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
    return goalsQuery.status === "loading" ? (
      <RouteLoadingState />
    ) : (
      <RouteNotFoundState message={t("common.notFound.goal")} />
    )
  }
  const {
    currentAmount: resolved,
    clampedProgress,
    isCompleted,
    remaining,
    status,
    isExpenseGoal,
    badge,
    progressBarColor,
    dateSubtitle,
    insightText,
  } = getGoalDisplay(goal, currentAmount, t, theme, {
    currencyLook,
    privacyMode,
  })
  const progressLabel = isExpenseGoal
    ? t("screens.settings.goals.card.spent")
    : t("screens.settings.goals.card.saved")
  const headerContent = (
    <View style={planningDetailStyles.headerCard}>
      <View style={planningDetailStyles.headerTopRow}>
        <DynamicIcon
          icon={goal.icon || "target-outline"}
          size={24}
          colorScheme={goal.colorScheme}
          variant="badge"
        />
        <View style={planningDetailStyles.headerInfo}>
          <Text style={styles.goalName} numberOfLines={1}>
            {goal.name}
          </Text>
          <Text style={styles.dateSubtitle} numberOfLines={1}>
            {dateSubtitle}
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
        <Text style={planningDetailStyles.description}>{goal.description}</Text>
      ) : null}

      <Text style={styles.accountsText}>
        {accountNames.length > 0
          ? accountNames.join(", ")
          : t("screens.settings.goals.card.allAccounts")}
      </Text>

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
                planningDetailStyles.remainingText,
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
                planningDetailStyles.remainingText,
                { color: theme.colors.semantic.income },
              ]}
            />
          )}
        </View>
      </View>

      <Text style={styles.insight}>{insightText}</Text>

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
              title={t("screens.settings.goals.detail.noTransactions")}
            />
          </View>
        }
        contentContainerStyle={planningDetailStyles.listContent}
      />

      <ConfirmSheet
        visible={unarchiveSheetVisible}
        onRequestClose={() => setUnarchiveSheetVisible(false)}
        onConfirm={handleUnarchive}
        title={t("screens.settings.goals.form.archiveSheet.unarchiveTitle")}
        description={goal.name}
        confirmLabel={t(
          "screens.settings.goals.form.archiveSheet.unarchiveConfirm",
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
  // Header card
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
  accountsText: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSecondary,
  },
  // Progress
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
}))

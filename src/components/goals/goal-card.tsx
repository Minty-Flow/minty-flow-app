import { useTranslation } from "react-i18next"
import { type DimensionValue, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { getGoalDisplay } from "~/components/goals/goal-display"
import { Money } from "~/components/money"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useTransactions } from "~/database/drizzle/read-models/transaction-read-model"
import { useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { Goal } from "~/types/goals"
import { getLiveGoalProgress } from "~/utils/live-progress"

interface GoalCardProps {
  goal: Goal
  onPress: () => void
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const { items: progressTransactions } = useTransactions({ goalId: goal.id })
  const currentAmount = getLiveGoalProgress(goal, progressTransactions)
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)

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

  const progressPercent = Math.round(clampedProgress * 1000) / 10

  return (
    <Pressable
      style={[
        styles.card,
        { borderStyle: goal.isArchived ? "dashed" : "solid" },
      ]}
      onPress={onPress}
      accessibilityLabel={goal.name}
    >
      {/* Row 1: Icon + name/subtitle + status badge */}
      <View style={styles.row1}>
        <View style={styles.row1Left}>
          <DynamicIcon
            icon={goal.icon}
            size={18}
            colorScheme={goal.colorScheme}
          />
          <View style={styles.nameBlock}>
            <Text variant="default" style={styles.name} numberOfLines={1}>
              {goal.name}
            </Text>
            <Text variant="small" style={styles.dateSubtitle} numberOfLines={1}>
              {dateSubtitle}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <RNView style={[styles.statusDot, { backgroundColor: badge.dot }]} />
          <Text
            variant="small"
            style={[
              styles.statusText,
              { color: badge.text },
              isRTL && styles.statusTextRTL,
            ]}
          >
            {t(`screens.settings.goals.card.status.${status}`)}
          </Text>
        </View>
      </View>

      {/* Row 2: Progress bar */}
      <View style={styles.progressTrack}>
        <RNView
          style={[
            styles.progressFill,
            {
              width: `${progressPercent}%` as DimensionValue,
              backgroundColor: progressBarColor,
            },
          ]}
        />
      </View>

      {/* Row 3: Saved / left */}
      <View style={styles.row3}>
        <Text variant="small" style={styles.savedText}>
          {isExpenseGoal
            ? t("screens.settings.goals.card.spent")
            : t("screens.settings.goals.card.saved")}{" "}
          <Money
            value={resolved}
            currency={goal.currencyCode}
            variant="small"
            tone="transfer"
            hideSign
          />{" "}
          {t("screens.settings.goals.card.of")}{" "}
          <Money
            value={goal.targetAmount}
            currency={goal.currencyCode}
            variant="small"
            tone="transfer"
            hideSign
          />
        </Text>
        {isCompleted ? (
          <Text
            variant="small"
            style={[styles.rightText, { color: theme.colors.semantic.income }]}
          >
            100%
          </Text>
        ) : (
          <Text
            variant="small"
            style={[styles.rightText, { color: theme.colors.semantic.income }]}
          >
            <Money
              value={remaining}
              currency={goal.currencyCode}
              variant="small"
              tone="income"
              hideSign
            />{" "}
            {t("screens.settings.goals.card.left")}
          </Text>
        )}
      </View>

      {/* Row 4: Italic insight */}
      <Text variant="small" style={styles.insight}>
        {insightText}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius,
    borderWidth: 1,
    borderColor: t.colors.semantic.semi,
    padding: 14,
    gap: 10,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row1Left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...t.typography.bodyLarge,
    fontWeight: "600",
    color: t.colors.onSurface,
  },
  dateSubtitle: {
    fontSize: t.typography.labelSmall.fontSize,
    color: t.colors.onSecondary,
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
    fontSize: t.typography.labelXSmall.fontSize,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statusTextRTL: {
    letterSpacing: 0,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: t.colors.secondary,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  row3: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savedText: {
    fontSize: t.typography.labelMedium.fontSize,
    color: t.colors.onSecondary,
    flex: 1,
    marginRight: 8,
  },
  rightText: {
    fontSize: t.typography.labelMedium.fontSize,
    flexShrink: 0,
  },
  insight: {
    fontSize: t.typography.labelSmall.fontSize,
    color: t.colors.onSecondary,
    fontStyle: "italic",
  },
}))

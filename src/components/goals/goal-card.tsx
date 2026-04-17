import { withObservables } from "@nozbe/watermelondb/react"
import { differenceInDays } from "date-fns"
import { useTranslation } from "react-i18next"
import { type DimensionValue, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { observeGoalTransactionProgress } from "~/database/services/goal-service"
import type { Goal } from "~/types/goals"

interface GoalCardProps {
  goal: Goal
  onPress: () => void
  currentAmount: number
}

function GoalCardInner({ goal, onPress, currentAmount }: GoalCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const isExpenseGoal = goal.goalType === "expense"
  const resolved = currentAmount
  const progress = goal.targetAmount > 0 ? resolved / goal.targetAmount : 0
  const clampedProgress = Math.min(progress, 1)
  const isCompleted = progress >= 1

  // Target date display logic
  const targetDateLabel = (): string => {
    if (!goal.targetDate) {
      return t("screens.settings.goals.card.noDeadline")
    }
    const today = new Date()
    const diff = differenceInDays(goal.targetDate, today)
    if (diff === 0) {
      // "Due today" — reuse noDeadline slot or show a specific text
      return t("screens.settings.goals.card.daysLeft", { count: 0 })
    }
    if (diff < 0) {
      return t("screens.settings.goals.card.overdue", { count: Math.abs(diff) })
    }
    return t("screens.settings.goals.card.daysLeft", { count: diff })
  }

  const remaining = Math.max(goal.targetAmount - resolved, 0)

  const progressBarColor = isCompleted
    ? theme.colors.customColors.income
    : theme.colors.primary

  const progressPercent = Number((clampedProgress * 100).toFixed(1))

  return (
    <Pressable
      style={[
        styles.card,
        { borderStyle: goal.isArchived ? "dashed" : "solid" },
      ]}
      onPress={onPress}
      accessibilityLabel={goal.name}
    >
      {/* Row 1: Icon + name + badge/date chip */}
      <View style={styles.row1}>
        <View style={styles.row1Left}>
          <DynamicIcon
            icon={goal.icon}
            size={18}
            colorScheme={goal.colorScheme}
          />
          <Text variant="default" style={styles.name} numberOfLines={1}>
            {goal.name}
          </Text>
        </View>

        <View style={styles.row1Right}>
          <View style={styles.typeBadge}>
            <Text variant="small" style={styles.typeBadgeText}>
              {isExpenseGoal
                ? t("screens.settings.goals.card.type.expense")
                : t("screens.settings.goals.card.type.savings")}
            </Text>
          </View>
          {isCompleted ? (
            <View style={styles.completedBadge}>
              <IconSvg
                name="check"
                size={14}
                color={theme.colors.customColors.income}
              />
              <Text variant="small" style={styles.completedText}>
                {t("screens.settings.goals.card.completed")}
              </Text>
            </View>
          ) : (
            <View style={styles.dateChip}>
              <Text variant="small" style={styles.dateChipText}>
                {targetDateLabel()}
              </Text>
            </View>
          )}
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

      {/* Row 3: Saved / remaining amounts */}
      <View style={styles.row3}>
        <Text variant="small" style={styles.savedText}>
          {isExpenseGoal
            ? t("screens.settings.goals.card.spent")
            : t("screens.settings.goals.card.saved")}
          {":\u00a0"}
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
        <Text variant="small" style={styles.remainingText}>
          {isCompleted ? (
            t("screens.settings.goals.card.completed")
          ) : (
            <>
              <Money
                value={remaining}
                currency={goal.currencyCode}
                variant="small"
                tone="transfer"
                hideSign
              />{" "}
              {t("screens.settings.goals.card.remaining")}
            </>
          )}
        </Text>
      </View>
    </Pressable>
  )
}

export const GoalCard = withObservables(
  ["goal"],
  ({ goal }: { goal: Goal }) => ({
    currentAmount: observeGoalTransactionProgress(
      goal.id,
      goal.goalType || "savings",
    ),
  }),
)(GoalCardInner)

const styles = StyleSheet.create((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius,
    borderWidth: 1,
    borderColor: t.colors.customColors.semi,
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
  name: {
    ...t.typography.bodyLarge,
    fontWeight: "600",
    color: t.colors.onSurface,
    flex: 1,
  },
  row1Right: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  typeBadge: {
    backgroundColor: t.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: t.radius,
  },
  typeBadgeText: {
    fontSize: t.typography.labelSmall.fontSize,
    fontWeight: "600",
    color: t.colors.onSecondary,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${t.colors.customColors.income}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: t.radius,
  },
  completedText: {
    ...t.typography.labelXSmall,
    fontWeight: "600",
    color: t.colors.customColors.income,
  },
  dateChip: {
    backgroundColor: t.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: t.radius,
  },
  dateChipText: {
    ...t.typography.labelXSmall,
    fontWeight: "500",
    color: t.colors.onSecondary,
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
  remainingText: {
    fontSize: t.typography.labelMedium.fontSize,
    color: t.colors.onSecondary,
    flexShrink: 0,
  },
}))

import { differenceInDays } from "date-fns"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, View as RNView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { on } from "~/database/events"
import { getGoalProgress } from "~/database/repos/goal-repo"
import { useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { Goal } from "~/types/goals"
import { formatDisplayValue } from "~/utils/number-format"

type GoalStatus = "onTrack" | "behind" | "flexible" | "reached"

function getGoalStatus(goal: Goal, progress: number): GoalStatus {
  if (progress >= 1) return "reached"
  if (!goal.targetDate) return "flexible"
  const today = new Date()
  const daysLeft = differenceInDays(goal.targetDate, today)
  if (daysLeft < 0) return "behind"
  const totalDays = differenceInDays(goal.targetDate, goal.createdAt)
  if (totalDays <= 0) return "onTrack"
  const elapsed = differenceInDays(today, goal.createdAt)
  return progress >= Math.min(elapsed / totalDays, 1) ? "onTrack" : "behind"
}

interface GoalCardProps {
  goal: Goal
  onPress: () => void
}

export function GoalCard({ goal, onPress }: GoalCardProps) {
  const [currentAmount, setCurrentAmount] = useState(0)

  useEffect(() => {
    let cancelled = false
    const fetch = () =>
      getGoalProgress(goal.id, goal.goalType || "savings").then((v) => {
        if (!cancelled) setCurrentAmount(v)
      })
    fetch()
    const unsub = on("transactions:dirty", fetch)
    return () => {
      cancelled = true
      unsub()
    }
  }, [goal.id, goal.goalType])

  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)

  const isExpenseGoal = goal.goalType === "expense"
  const resolved = currentAmount
  const progress = goal.targetAmount > 0 ? resolved / goal.targetAmount : 0
  const clampedProgress = Math.min(progress, 1)
  const isCompleted = progress >= 1
  const remaining = Math.max(goal.targetAmount - resolved, 0)

  const status = getGoalStatus(goal, progress)

  const dateSubtitle = (): string => {
    if (isCompleted) return t("screens.settings.goals.card.reachedLabel")
    if (!goal.targetDate) return t("screens.settings.goals.card.noDeadline")
    const today = new Date()
    const diff = differenceInDays(goal.targetDate, today)
    if (diff === 0)
      return t("screens.settings.goals.card.daysLeft", { count: 0 })
    if (diff < 0)
      return t("screens.settings.goals.card.overdue", { count: Math.abs(diff) })
    return t("screens.settings.goals.card.daysLeft", { count: diff })
  }

  const insightText = (): string => {
    if (isCompleted) return t("screens.settings.goals.card.insight.goalReached")
    if (!goal.targetDate) return t("screens.settings.goals.card.noDeadline")
    const today = new Date()
    const daysLeft = Math.max(differenceInDays(goal.targetDate, today), 1)
    const daily = remaining / daysLeft
    const raw = formatDisplayValue(daily, {
      currency: goal.currencyCode,
      currencyDisplay: currencyLook,
      hideSign: true,
    })
    const amount = privacyMode ? raw.replace(/[\d٠-٩۰-۹]/gu, "⁕") : raw
    const key = isExpenseGoal
      ? "screens.settings.goals.card.insight.spendPerDay"
      : "screens.settings.goals.card.insight.savePerDay"
    return t(key, { amount })
  }

  const statusColors = {
    reached: {
      dot: theme.colors.customColors.income,
      text: theme.colors.customColors.income,
      bg: `${theme.colors.customColors.income}20`,
    },
    onTrack: {
      dot: theme.colors.customColors.income,
      text: theme.colors.customColors.income,
      bg: `${theme.colors.customColors.income}20`,
    },
    behind: {
      dot: theme.colors.customColors.expense,
      text: theme.colors.customColors.expense,
      bg: `${theme.colors.customColors.expense}20`,
    },
    flexible: {
      dot: theme.colors.onSecondary,
      text: theme.colors.onSecondary,
      bg: theme.colors.secondary,
    },
  } satisfies Record<GoalStatus, { dot: string; text: string; bg: string }>

  const badge = statusColors[status]

  const progressBarColor =
    isCompleted || status === "reached"
      ? theme.colors.customColors.income
      : status === "behind"
        ? theme.colors.customColors.expense
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
              {dateSubtitle()}
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
            style={[
              styles.rightText,
              { color: theme.colors.customColors.income },
            ]}
          >
            100%
          </Text>
        ) : (
          <Text
            variant="small"
            style={[
              styles.rightText,
              { color: theme.colors.customColors.income },
            ]}
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
        {insightText()}
      </Text>
    </Pressable>
  )
}

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

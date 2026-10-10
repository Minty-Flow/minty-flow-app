import type { TFunction } from "i18next"

import type { MoneyFormatType } from "~/stores/money-formatting.store"
import type { UnistylesTheme } from "~/styles/theme/types"
import type { Goal } from "~/types/goals"
import { roundToSafeInteger } from "~/utils/money"
import { formatMoney } from "~/utils/number-format"
import {
  type GoalStatus,
  getGoalProgressModel,
} from "~/utils/planning-progress"

/**
 * Progress plus the labels and colors a goal is shown with (card and detail):
 * deadline subtitle, per-day insight, status badge and progress bar colors.
 */
export function getGoalDisplay(
  goal: Goal,
  currentAmount: number,
  t: TFunction,
  theme: UnistylesTheme,
  money: { currencyLook: MoneyFormatType; privacyMode: boolean },
) {
  const model = getGoalProgressModel(goal, currentAmount)
  const { isCompleted, remaining, daysLeft, status } = model
  const isExpenseGoal = goal.goalType === "expense"

  const statusColors = {
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
  } satisfies Record<GoalStatus, { dot: string; text: string; bg: string }>

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
      currencyDisplay: money.currencyLook,
      hideSign: true,
    })
    const amount = money.privacyMode ? raw.replace(/[\d٠-٩۰-۹]/gu, "⁕") : raw
    const key = isExpenseGoal
      ? "screens.settings.goals.card.insight.spendPerDay"
      : "screens.settings.goals.card.insight.savePerDay"
    return t(key, { amount })
  }

  return {
    ...model,
    isExpenseGoal,
    badge: statusColors[status],
    progressBarColor:
      isCompleted || status === "reached"
        ? theme.colors.semantic.income
        : status === "behind"
          ? theme.colors.semantic.expense
          : theme.colors.primary,
    dateSubtitle: dateSubtitle(),
    insightText: insightText(),
  }
}

import {
  differenceInCalendarDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { type DimensionValue, View as RNView } from "react-native"
import { createMMKV } from "react-native-mmkv"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { on } from "~/database/events"
import { getBudgetSpent } from "~/database/repos/budget-repo"
import { useMinuteTick } from "~/hooks/use-time-reactivity"
import type { TranslationKey } from "~/i18n/config"
import { useCategories } from "~/stores/db/category.store"
import { useLanguageStore } from "~/stores/language.store"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import type { Budget } from "~/types/budgets"
import { getWeekStartsOn } from "~/utils/get-week-start-on"
import { formatDisplayValue } from "~/utils/number-format"
import { formatCustomPeriodRange } from "~/utils/time-utils"
import { Toast } from "~/utils/toast"

/**
 * Persisted alert deduplication: fires once per budget per period.
 * Keys are stored as "${budgetId}:${periodKey}" (e.g. "abc123:2026-04").
 * Backed by MMKV so alerts survive app restarts but reset each new period.
 */
const budgetAlertStorage = createMMKV({ id: "budget-alert-storage" })
const ALERTED_STORAGE_KEY = "alertedBudgetKeys"

function loadAlertedKeys(): Set<string> {
  const raw = budgetAlertStorage.getString(ALERTED_STORAGE_KEY)
  if (!raw) return new Set()
  try {
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

type BudgetAlertCtx = Pick<Budget, "id" | "period" | "startDate">

function getBudgetPeriodKey(budget: BudgetAlertCtx): string {
  const now = new Date()
  switch (budget.period) {
    case "daily":
      return format(now, "yyyy-MM-dd")
    case "weekly":
      return format(now, "RRRR-'W'II")
    case "monthly":
      return format(now, "yyyy-MM")
    case "yearly":
      return format(now, "yyyy")
    case "custom":
      // Custom budgets have a fixed range — key on startDate so each unique
      // custom period gets its own alert slot.
      return budget.startDate.toISOString().slice(0, 10)
  }
}

const alertedKeys = loadAlertedKeys()

function hasAlertedInPeriod(budget: BudgetAlertCtx): boolean {
  return alertedKeys.has(`${budget.id}:${getBudgetPeriodKey(budget)}`)
}

function markAlerted(budget: BudgetAlertCtx): void {
  const key = `${budget.id}:${getBudgetPeriodKey(budget)}`
  alertedKeys.add(key)
  budgetAlertStorage.set(ALERTED_STORAGE_KEY, JSON.stringify([...alertedKeys]))
}

type BudgetStatus = "onTrack" | "watch" | "over"

interface BudgetCardProps {
  budget: Budget
  onPress: () => void
}

export function BudgetCard({ budget, onPress }: BudgetCardProps) {
  const [spentAmount, setSpentAmount] = useState(0)
  const allCategories = useCategories()
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const isRTL = useLanguageStore((s) => s.isRTL)
  const privacyMode = useMoneyFormattingStore((s) => s.privacyMode)
  const currencyLook = useMoneyFormattingStore((s) => s.currencyLook)

  const linkedCategories = useMemo(
    () =>
      budget.categoryIds
        .map((id) => allCategories.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [budget.categoryIds, allCategories],
  )

  // Tick every minute so rolling periods (daily/weekly/monthly/yearly) snap
  // to a new window the moment their boundary crosses, even if the app is
  // left open across midnight / week-start / month-start.
  const tick = useMinuteTick()

  const { periodStart, periodEnd } = useMemo(() => {
    // `tick` consumed to make the dep array honest — fires recompute each minute
    // so rolling periods (daily/weekly/monthly/yearly) snap at boundary cross.
    void tick
    const now = new Date()
    const wso = getWeekStartsOn()
    switch (budget.period) {
      case "daily":
        return { periodStart: startOfDay(now), periodEnd: endOfDay(now) }
      case "weekly":
        return {
          periodStart: startOfWeek(now, { weekStartsOn: wso }),
          periodEnd: endOfWeek(now, { weekStartsOn: wso }),
        }
      case "monthly":
        return { periodStart: startOfMonth(now), periodEnd: endOfMonth(now) }
      case "yearly":
        return { periodStart: startOfYear(now), periodEnd: endOfYear(now) }
      default:
        return {
          periodStart: budget.startDate,
          periodEnd: budget.endDate ?? now,
        }
    }
  }, [budget.period, budget.startDate, budget.endDate, tick])

  // Stable ms values: only change when the period boundary actually crosses,
  // so the spent-fetch effect doesn't re-fire every minute.
  const periodStartMs = periodStart.getTime()
  const periodEndMs = periodEnd.getTime()

  useEffect(() => {
    // periodStartMs / periodEndMs read so they enter the dep array honestly —
    // a boundary cross flips one of them, forcing a refetch with the new window.
    void periodStartMs
    void periodEndMs
    let cancelled = false
    const fetch = () =>
      getBudgetSpent(
        budget.accountIds,
        budget.categoryIds,
        budget.period,
        budget.startDate.toISOString(),
        budget.endDate?.toISOString() ?? null,
      ).then((v) => {
        if (!cancelled) setSpentAmount(v)
      })
    fetch()
    const unsub = on("transactions:dirty", fetch)
    return () => {
      cancelled = true
      unsub()
    }
  }, [
    budget.accountIds,
    budget.categoryIds,
    budget.period,
    budget.startDate,
    budget.endDate,
    periodStartMs,
    periodEndMs,
  ])

  const spent = spentAmount
  const limit = budget.amount

  const budgetId = budget.id
  const budgetName = budget.name
  const alertThreshold = budget.alertThreshold
  const budgetPeriod = budget.period
  const budgetStartDateMs = budget.startDate.getTime()

  useEffect(() => {
    if (!alertThreshold || limit <= 0) return
    const ctx: BudgetAlertCtx = {
      id: budgetId,
      period: budgetPeriod,
      startDate: new Date(budgetStartDateMs),
    }
    if (hasAlertedInPeriod(ctx)) return
    if (spent / limit >= alertThreshold / 100) {
      markAlerted(ctx)
      Toast.show({
        type: "info",
        title: budgetName,
        description: t("screens.settings.budgets.card.alertThresholdReached"),
      })
    }
  }, [
    spent,
    limit,
    budgetId,
    alertThreshold,
    budgetPeriod,
    budgetStartDateMs,
    budgetName,
    t,
  ])

  const totalDays =
    Math.max(differenceInCalendarDays(periodEnd, periodStart), 0) + 1
  const elapsedDays = Math.min(
    Math.max(differenceInCalendarDays(new Date(), periodStart), 0) + 1,
    totalDays,
  )
  const daysRemaining = Math.max(totalDays - elapsedDays, 0)
  const timeRatio = totalDays > 0 ? elapsedDays / totalDays : 0
  const spendRatio = limit > 0 ? Math.min(spent / limit, 1) : 0
  const spendPercent = limit > 0 ? (spent / limit) * 100 : 0

  const isOverBudget = spent > limit
  const remaining = limit - spent
  const status: BudgetStatus = isOverBudget
    ? "over"
    : limit > 0 && spent / limit - timeRatio >= 0.1
      ? "watch"
      : "onTrack"

  const statusColor = {
    onTrack: theme.colors.customColors.income,
    watch: theme.colors.customColors.warning,
    over: theme.colors.customColors.expense,
  }[status]
  const statusBg = `${statusColor}20`

  const progressColor = statusColor

  // Insight line: per-day pace remaining, or over-budget summary.
  const insight = (() => {
    const formatAmt = (n: number) => {
      const raw = formatDisplayValue(n.toString(), {
        currency: budget.currencyCode,
        currencyDisplay: currencyLook,
        hideSign: true,
      })
      return privacyMode ? raw.replace(/[\d٠-٩۰-۹]/gu, "⁕") : raw
    }
    if (isOverBudget) {
      return t(
        `screens.settings.budgets.card.insight.over.${budget.period}` as TranslationKey,
        {
          amount: formatAmt(Math.abs(remaining)),
          range:
            budget.period === "custom"
              ? formatCustomPeriodRange(budget.startDate, budget.endDate)
              : "",
        },
      )
    }
    if (daysRemaining <= 0) return null
    const dailyPace = remaining / daysRemaining
    return t("screens.settings.budgets.card.insight.dailyPace", {
      amount: formatAmt(dailyPace),
      count: daysRemaining,
    })
  })()

  // Icons: up to 2 category icons + overflow chip; falls back to budget icon
  // when no categories are linked.
  const visibleCats = linkedCategories.slice(0, 1)
  const overflowCount = Math.max(
    linkedCategories.length - visibleCats.length,
    0,
  )
  const useCategoryIcons = visibleCats.length > 0

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={budget.name}
    >
      <View style={styles.row1}>
        <View style={styles.row1Left}>
          <View style={styles.iconStack}>
            {useCategoryIcons ? (
              <>
                {visibleCats.map((c) => (
                  <DynamicIcon
                    key={c.id}
                    icon={c.icon}
                    colorScheme={c.colorScheme}
                    size={16}
                  />
                ))}
                {overflowCount > 0 && (
                  <View style={styles.overflowChip}>
                    <Text variant="small" style={styles.overflowText}>
                      +{overflowCount}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <DynamicIcon
                icon={budget.icon}
                colorScheme={budget.colorScheme}
                size={20}
              />
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text variant="default" style={styles.name} numberOfLines={1}>
              {budget.name}
            </Text>
            <Text variant="small" style={styles.subtitle} numberOfLines={1}>
              {isOverBudget ? (
                <>
                  <Text
                    variant="small"
                    style={[styles.subtitleAccent, { color: statusColor }]}
                  >
                    +
                    <Money
                      value={Math.abs(remaining)}
                      currency={budget.currencyCode}
                      variant="small"
                      tone="transfer"
                      hideSign
                      style={{ color: statusColor }}
                    />{" "}
                    {t("screens.settings.budgets.card.over")}
                  </Text>{" "}
                  · {t("screens.settings.budgets.card.of")}{" "}
                  <Money
                    value={limit}
                    currency={budget.currencyCode}
                    variant="small"
                    tone="transfer"
                    hideSign
                  />
                </>
              ) : (
                <>
                  <Text
                    variant="small"
                    style={[styles.subtitleAccent, { color: statusColor }]}
                  >
                    <Money
                      value={Math.max(remaining, 0)}
                      currency={budget.currencyCode}
                      variant="small"
                      tone="transfer"
                      hideSign
                      style={{ color: statusColor }}
                    />{" "}
                    {t("screens.settings.budgets.card.left")}
                  </Text>{" "}
                  · {t("screens.settings.budgets.card.of")}{" "}
                  <Money
                    value={limit}
                    currency={budget.currencyCode}
                    variant="small"
                    tone="transfer"
                    hideSign
                  />
                </>
              )}
            </Text>
          </View>
        </View>
        <View style={styles.row1Right}>
          {budget.isActive ? (
            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
              <RNView
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <Text
                variant="small"
                style={[
                  styles.statusText,
                  { color: statusColor },
                  isRTL && styles.statusTextRTL,
                ]}
              >
                {t(
                  `screens.settings.budgets.card.status.${status}` as TranslationKey,
                )}
              </Text>
            </View>
          ) : (
            <View style={styles.disabledBadge}>
              <Text variant="small" style={styles.disabledText}>
                {t("screens.settings.budgets.card.disabled")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.gaugeRow}>
        <Text
          variant="small"
          style={[styles.gaugeLabel, isRTL && styles.gaugeLabelRTL]}
        >
          {t("screens.settings.budgets.card.time")}
        </Text>
        <View style={styles.gaugeTrack}>
          <RNView
            style={[
              styles.gaugeFill,
              {
                width: `${(timeRatio * 100).toFixed(1)}%` as DimensionValue,
                backgroundColor: theme.colors.onSecondary,
              },
            ]}
          />
        </View>
        <Text variant="small" style={styles.gaugeValue}>
          {t("screens.settings.budgets.card.dayOf", {
            current: elapsedDays,
            total: totalDays,
          })}
        </Text>
      </View>

      <View style={styles.gaugeRow}>
        <Text
          variant="small"
          style={[styles.gaugeLabel, isRTL && styles.gaugeLabelRTL]}
        >
          {t("screens.settings.budgets.card.spend")}
        </Text>
        <View style={styles.gaugeTrack}>
          <RNView
            style={[
              styles.gaugeFill,
              {
                width: `${(spendRatio * 100).toFixed(1)}%` as DimensionValue,
                backgroundColor: progressColor,
              },
            ]}
          />
        </View>
        <Text
          variant="small"
          style={[
            styles.gaugeValue,
            { color: progressColor, fontWeight: "700" },
          ]}
        >
          {Math.round(spendPercent)}%
        </Text>
      </View>

      {insight && (
        <Text variant="small" style={styles.insight}>
          {insight}
        </Text>
      )}
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
    marginBottom: 12,
    gap: 10,
  },
  row1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  row1Left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  iconStack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  overflowChip: {
    paddingHorizontal: 6,
    height: 24,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: t.radius,
    backgroundColor: t.colors.secondary,
  },
  overflowText: {
    fontSize: t.typography.labelXSmall.fontSize,
    fontWeight: "700",
    color: t.colors.onSecondary,
  },
  nameContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontWeight: "600",
    color: t.colors.onSurface,
    fontSize: t.typography.bodyLarge.fontSize,
  },
  subtitle: {
    fontSize: t.typography.labelMedium.fontSize,
    color: t.colors.onSecondary,
  },
  subtitleAccent: {
    fontWeight: "700",
  },
  row1Right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  statusBadge: {
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
  gaugeLabelRTL: {
    letterSpacing: 0,
  },
  disabledBadge: {
    backgroundColor: t.colors.secondary,
    borderRadius: t.radius,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  disabledText: {
    fontSize: t.typography.labelSmall.fontSize,
    color: t.colors.onSecondary,
    fontWeight: "600",
  },
  gaugeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gaugeLabel: {
    fontSize: t.typography.labelXSmall.fontSize,
    fontWeight: "700",
    color: t.colors.onSecondary,
    letterSpacing: 0.5,
    width: 48,
  },
  gaugeTrack: {
    flex: 1,
    height: 6,
    backgroundColor: t.colors.secondary,
    borderRadius: 3,
    overflow: "hidden",
  },
  gaugeFill: {
    height: "100%",
    borderRadius: 3,
  },
  gaugeValue: {
    fontSize: t.typography.labelSmall.fontSize,
    color: t.colors.onSecondary,
    minWidth: 60,
    textAlign: "right",
  },
  insight: {
    fontSize: t.typography.labelSmall.fontSize,
    color: t.colors.onSecondary,
    fontStyle: "italic",
  },
}))

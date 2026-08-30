import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { RouteLoadingState } from "~/components/route-load-state"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type RecurringExpense,
  useRecurringExpensesQuery,
} from "~/database/drizzle/read-models/recurring-read-model"
import { formatShortMonthDay } from "~/utils/time-utils"

type GroupBy = "date" | "account" | "category"

export default function RecurringExpensesScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: items, status } = useRecurringExpensesQuery()
  const [groupBy, setGroupBy] = useState<GroupBy>("date")
  const [showPaused, setShowPaused] = useState(false)

  const active = useMemo(() => items.filter((s) => !s.isPaused), [items])
  const paused = useMemo(() => items.filter((s) => s.isPaused), [items])

  const totalsByCurrency = useMemo(() => {
    const map = new Map<string, { monthly: number; yearly: number }>()
    for (const s of active) {
      if (!s.currencyCode) continue
      const cur = map.get(s.currencyCode) ?? { monthly: 0, yearly: 0 }
      cur.monthly += s.monthlyMinor
      cur.yearly += s.yearlyMinor
      map.set(s.currencyCode, cur)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [active])

  const uncategorisedLabel = t("common.transaction.uncategorized")
  const groups = useMemo(
    () => groupItems(active, groupBy, uncategorisedLabel),
    [active, groupBy, uncategorisedLabel],
  )

  if (status === "loading" && items.length === 0) {
    return <RouteLoadingState />
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="repeat-outline"
          title={t("screens.settings.recurring.empty")}
        />
      </View>
    )
  }

  const openItem = (item: RecurringExpense) => {
    if (item.latestInstanceId) {
      router.push(`/transaction/${item.latestInstanceId}`)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.totalsCard}>
        {totalsByCurrency.length === 0 ? (
          <Text variant="small" style={styles.muted}>
            {t("screens.settings.recurring.empty")}
          </Text>
        ) : (
          totalsByCurrency.map(([currency, totals]) => (
            <View key={currency} style={styles.totalsRow}>
              <Text variant="small" style={styles.totalsCurrency}>
                {currency}
              </Text>
              <View style={styles.totalsFigures}>
                <View style={styles.totalsFigure}>
                  <Text variant="small" style={styles.muted}>
                    {t("screens.settings.recurring.monthly")}
                  </Text>
                  <Money
                    value={totals.monthly}
                    currency={currency}
                    tone="expense"
                  />
                </View>
                <View style={styles.totalsFigure}>
                  <Text variant="small" style={styles.muted}>
                    {t("screens.settings.recurring.yearly")}
                  </Text>
                  <Money
                    value={totals.yearly}
                    currency={currency}
                    tone="expense"
                  />
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.groupByRow}>
        <Chip
          label={t("screens.settings.recurring.groupBy.date")}
          selected={groupBy === "date"}
          onPress={() => setGroupBy("date")}
        />
        <Chip
          label={t("screens.settings.recurring.groupBy.account")}
          selected={groupBy === "account"}
          onPress={() => setGroupBy("account")}
        />
        <Chip
          label={t("screens.settings.recurring.groupBy.category")}
          selected={groupBy === "category"}
          onPress={() => setGroupBy("category")}
        />
      </View>

      {groups.map((group) => (
        <View key={group.key} style={styles.group}>
          {group.title.length > 0 && (
            <Text variant="small" style={styles.groupTitle}>
              {group.title}
            </Text>
          )}
          {group.items.map((item) => (
            <RecurringRow
              key={item.id}
              item={item}
              onPress={() => openItem(item)}
            />
          ))}
        </View>
      ))}

      {paused.length > 0 && (
        <View style={styles.group}>
          <Pressable
            style={styles.pausedHeader}
            onPress={() => setShowPaused((v) => !v)}
          >
            <Text variant="small" style={styles.groupTitle}>
              {t("screens.settings.recurring.paused")} ({paused.length})
            </Text>
            <Text variant="small" style={styles.muted}>
              {showPaused
                ? t("screens.settings.recurring.hidePaused")
                : t("screens.settings.recurring.showPaused")}
            </Text>
          </Pressable>
          {showPaused &&
            paused.map((item) => (
              <RecurringRow
                key={item.id}
                item={item}
                onPress={() => openItem(item)}
              />
            ))}
        </View>
      )}
    </ScrollView>
  )
}

function RecurringRow({
  item,
  onPress,
}: {
  item: RecurringExpense
  onPress: () => void
}) {
  const { t } = useTranslation()
  const subtitle = item.nextChargeAt
    ? t("screens.settings.recurring.nextCharge", {
        date: formatShortMonthDay(item.nextChargeAt),
      })
    : (item.categoryName ?? item.accountName)

  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!item.latestInstanceId}
    >
      <DynamicIcon
        icon={item.categoryIcon || "repeat-outline"}
        size={26}
        variant="badge"
        colorScheme={item.categoryColorScheme}
      />
      <View style={styles.rowMain}>
        <Text variant="p" numberOfLines={1} style={styles.rowTitle}>
          {item.title}
        </Text>
        <View style={styles.rowMeta}>
          <Text variant="small" style={styles.muted} numberOfLines={1}>
            {subtitle}
          </Text>
          {item.categoryFromRule && (
            <View style={styles.ruleTag}>
              <IconSvg name="wand-outline" size={12} />
              <Text variant="small" style={styles.ruleTagText}>
                {item.categoryName}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.rowRight}>
        {item.amountIncreased && (
          <View style={styles.increasedChip}>
            <IconSvg name="arrow-up-right-outline" size={12} />
            <Text variant="small" style={styles.increasedText}>
              {t("screens.settings.recurring.increased")}
            </Text>
          </View>
        )}
        <Money
          value={item.amountMinor}
          currency={item.currencyCode}
          tone="expense"
        />
      </View>
    </Pressable>
  )
}

interface Group {
  key: string
  title: string
  items: RecurringExpense[]
}

function groupItems(
  items: RecurringExpense[],
  groupBy: GroupBy,
  uncategorisedLabel: string,
): Group[] {
  if (groupBy === "date") {
    return [{ key: "all", title: "", items }]
  }
  const map = new Map<string, Group>()
  for (const item of items) {
    const key =
      groupBy === "account"
        ? item.accountId
        : (item.categoryId ?? "uncategorised")
    const title =
      groupBy === "account"
        ? item.accountName
        : (item.categoryName ?? uncategorisedLabel)
    const group = map.get(key) ?? { key, title, items: [] }
    group.items.push(item)
    map.set(key, group)
  }
  return [...map.values()].sort((a, b) => a.title.localeCompare(b.title))
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  muted: {
    color: theme.colors.onSurface,
    opacity: 0.6,
  },
  totalsCard: {
    borderWidth: 1,
    borderColor: theme.colors.semantic.semi,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
  },
  totalsRow: {
    gap: 8,
  },
  totalsCurrency: {
    fontWeight: "700",
    opacity: 0.6,
    color: theme.colors.onSurface,
  },
  totalsFigures: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalsFigure: {
    gap: 2,
  },
  groupByRow: {
    flexDirection: "row",
    gap: 8,
  },
  group: {
    gap: 4,
  },
  groupTitle: {
    color: theme.colors.onSecondary,
    fontWeight: "700",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pausedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.semantic.semi,
    gap: 12,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    color: theme.colors.onSurface,
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  ruleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    opacity: 0.6,
  },
  ruleTagText: {
    color: theme.colors.onSurface,
    fontWeight: "600",
  },
  rowRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  increasedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  increasedText: {
    color: theme.colors.semantic.expense,
    fontWeight: "600",
  },
}))

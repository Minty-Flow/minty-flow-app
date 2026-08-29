import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { RouteLoadingState } from "~/components/route-load-state"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  type Subscription,
  useSubscriptionsQuery,
} from "~/database/drizzle/read-models/recurring-read-model"
import { formatShortMonthDay } from "~/utils/time-utils"

type GroupBy = "date" | "account" | "category"

export default function SubscriptionsScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: subscriptions, status } = useSubscriptionsQuery()
  const [groupBy, setGroupBy] = useState<GroupBy>("date")
  const [showPaused, setShowPaused] = useState(false)

  const active = useMemo(
    () => subscriptions.filter((s) => !s.isPaused),
    [subscriptions],
  )
  const paused = useMemo(
    () => subscriptions.filter((s) => s.isPaused),
    [subscriptions],
  )

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
    () => groupSubscriptions(active, groupBy, uncategorisedLabel),
    [active, groupBy, uncategorisedLabel],
  )

  if (status === "loading" && subscriptions.length === 0) {
    return <RouteLoadingState />
  }

  if (subscriptions.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="repeat-outline"
          title={t("screens.settings.subscriptions.empty")}
        />
      </View>
    )
  }

  const openSubscription = (sub: Subscription) => {
    if (sub.latestInstanceId) {
      router.push(`/transaction/${sub.latestInstanceId}`)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.totalsCard}>
        {totalsByCurrency.length === 0 ? (
          <Text variant="small" style={styles.muted}>
            {t("screens.settings.subscriptions.empty")}
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
                    {t("screens.settings.subscriptions.monthly")}
                  </Text>
                  <Money
                    value={totals.monthly}
                    currency={currency}
                    tone="expense"
                  />
                </View>
                <View style={styles.totalsFigure}>
                  <Text variant="small" style={styles.muted}>
                    {t("screens.settings.subscriptions.yearly")}
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
          label={t("screens.settings.subscriptions.groupBy.date")}
          selected={groupBy === "date"}
          onPress={() => setGroupBy("date")}
        />
        <Chip
          label={t("screens.settings.subscriptions.groupBy.account")}
          selected={groupBy === "account"}
          onPress={() => setGroupBy("account")}
        />
        <Chip
          label={t("screens.settings.subscriptions.groupBy.category")}
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
          {group.items.map((sub) => (
            <SubscriptionRow
              key={sub.id}
              sub={sub}
              onPress={() => openSubscription(sub)}
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
              {t("screens.settings.subscriptions.paused")} ({paused.length})
            </Text>
            <Text variant="small" style={styles.muted}>
              {showPaused
                ? t("screens.settings.subscriptions.hidePaused")
                : t("screens.settings.subscriptions.showPaused")}
            </Text>
          </Pressable>
          {showPaused &&
            paused.map((sub) => (
              <SubscriptionRow
                key={sub.id}
                sub={sub}
                onPress={() => openSubscription(sub)}
              />
            ))}
        </View>
      )}
    </ScrollView>
  )
}

function SubscriptionRow({
  sub,
  onPress,
}: {
  sub: Subscription
  onPress: () => void
}) {
  const { t } = useTranslation()
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      disabled={!sub.latestInstanceId}
    >
      <View style={styles.rowMain}>
        <Text variant="p" numberOfLines={1} style={styles.rowTitle}>
          {sub.title}
        </Text>
        <Text variant="small" style={styles.muted}>
          {sub.nextChargeAt
            ? t("screens.settings.subscriptions.nextCharge", {
                date: formatShortMonthDay(sub.nextChargeAt),
              })
            : (sub.categoryName ?? sub.accountName)}
        </Text>
      </View>
      <View style={styles.rowRight}>
        {sub.amountIncreased && (
          <View style={styles.increasedChip}>
            <IconSvg name="arrow-up-right-outline" size={12} />
            <Text variant="small" style={styles.increasedText}>
              {t("screens.settings.subscriptions.increased")}
            </Text>
          </View>
        )}
        <Money
          value={sub.amountMinor}
          currency={sub.currencyCode}
          tone="expense"
        />
      </View>
    </Pressable>
  )
}

interface Group {
  key: string
  title: string
  items: Subscription[]
}

function groupSubscriptions(
  subs: Subscription[],
  groupBy: GroupBy,
  uncategorisedLabel: string,
): Group[] {
  if (groupBy === "date") {
    return [{ key: "all", title: "", items: subs }]
  }
  const map = new Map<string, Group>()
  for (const sub of subs) {
    const key =
      groupBy === "account"
        ? sub.accountId
        : (sub.categoryId ?? "uncategorised")
    const title =
      groupBy === "account"
        ? sub.accountName
        : (sub.categoryName ?? uncategorisedLabel)
    const group = map.get(key) ?? { key, title, items: [] }
    group.items.push(sub)
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
    gap: 24,
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

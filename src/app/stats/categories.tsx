import { Stack } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { DeltaBadge } from "~/components/stats/delta-badge"
import { StatsCategoryPie } from "~/components/stats/stats-category-pie"
import { StatsDetailShell } from "~/components/stats/stats-detail-shell"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { CategoryBreakdownItem } from "~/types/stats"

function BreakdownList({
  breakdown,
  currency,
}: {
  breakdown: CategoryBreakdownItem[]
  currency: string
}) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const items = breakdown.filter((b) => b.totalExpense > 0)
  const total = items.reduce((s, b) => s + b.totalExpense, 0)

  return (
    <View style={styles.listCard}>
      {items.map((item) => {
        const scheme = getThemeStrict(item.categoryColorSchemeName)
        const percent = total > 0 ? (item.totalExpense / total) * 100 : 0
        return (
          <View key={item.categoryId ?? "uncategorized"} style={styles.listRow}>
            <View
              style={[
                styles.listDot,
                { backgroundColor: scheme?.primary ?? theme.colors.primary },
              ]}
            />
            {item.categoryIcon ? (
              <DynamicIcon
                icon={item.categoryIcon}
                size={14}
                colorScheme={scheme}
                variant="raw"
              />
            ) : null}
            <Text variant="small" style={styles.listName} numberOfLines={1}>
              {item.categoryId === null
                ? t("screens.stats.chart.uncategorizedLabel")
                : item.categoryName}
            </Text>
            <Text variant="muted" style={styles.listPercent}>
              {percent.toFixed(1)}%
            </Text>
            <Money
              value={item.totalExpense}
              currency={currency}
              tone="transfer"
              variant="muted"
              compact
            />
            <DeltaBadge
              current={item.totalExpense}
              previous={item.prevTotalExpense}
              invertedSentiment
            />
          </View>
        )
      })}
    </View>
  )
}

export default function StatsCategoriesScreen() {
  const { t } = useTranslation()
  const [listView, setListView] = useState(false)

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => setListView((v) => !v)}>
              <Text style={styles.headerToggle}>
                {listView
                  ? t("screens.stats.categories.chartView")
                  : t("screens.stats.categories.listView")}
              </Text>
            </Pressable>
          ),
        }}
      />
      <StatsDetailShell>
        {({ stats }) =>
          listView ? (
            <BreakdownList
              breakdown={stats.categoryBreakdown}
              currency={stats.currency}
            />
          ) : (
            <StatsCategoryPie
              breakdown={stats.categoryBreakdown}
              currency={stats.currency}
            />
          )
        }
      </StatsDetailShell>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  headerToggle: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: theme.typography.bodyMedium.fontSize,
  },
  listCard: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listName: {
    flex: 1,
  },
  listPercent: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
    minWidth: 40,
    textAlign: "right",
  },
}))

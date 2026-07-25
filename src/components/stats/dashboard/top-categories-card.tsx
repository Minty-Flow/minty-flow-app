import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Money } from "~/components/money"
import { getCategoryColor } from "~/components/stats/stats-category-pie"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeVariantPalette, shuffleArray } from "~/styles/theme/utils"
import type { CategoryBreakdownItem } from "~/types/stats"

import { StatCard } from "./stat-card"

interface TopCategoriesCardProps {
  breakdown: CategoryBreakdownItem[]
  currency: string
  onPress: () => void
}

export function TopCategoriesCard({
  breakdown,
  currency,
  onPress,
}: TopCategoriesCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const top = breakdown.filter((b) => b.totalExpense > 0).slice(0, 3)
  const maxExpense = top[0]?.totalExpense ?? 0

  const fallbackPalette = useMemo(
    () => shuffleArray(getThemeVariantPalette(theme.name)),
    [theme.name],
  )

  return (
    <StatCard
      title={t("screens.stats.dashboard.topCategories")}
      icon="chart-donut"
      onPress={onPress}
    >
      {top.length === 0 ? (
        <Text variant="muted">{t("screens.stats.pieToggle.noData")}</Text>
      ) : (
        <View style={styles.list}>
          {top.map((item, index) => {
            const color = getCategoryColor(item, index, fallbackPalette)
            const ratio = maxExpense > 0 ? item.totalExpense / maxExpense : 0
            return (
              <View key={item.categoryId ?? "uncategorized"} style={styles.row}>
                <View style={styles.rowTop}>
                  <Text variant="small" style={styles.name} numberOfLines={1}>
                    {item.categoryId === null
                      ? t("screens.stats.chart.uncategorizedLabel")
                      : item.categoryName}
                  </Text>
                  <Money
                    value={item.totalExpense}
                    currency={currency}
                    tone="transfer"
                    variant="muted"
                    compact
                    style={styles.amount}
                  />
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        backgroundColor: color,
                        width: `${Math.max(4, ratio * 100)}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )
          })}
        </View>
      )}
    </StatCard>
  )
}

const styles = StyleSheet.create((theme) => ({
  list: {
    gap: 12,
  },
  row: {
    gap: 6,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.onSurface,
  },
  amount: {
    fontSize: theme.typography.bodyMedium.fontSize,
    color: theme.colors.semantic.semi,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: `${theme.colors.onSurface}14`,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
}))

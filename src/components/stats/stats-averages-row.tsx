import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { CurrencyPeriodStats } from "~/types/stats"

import { DeltaBadge } from "./delta-badge"

interface StatsAveragesRowProps {
  current: CurrencyPeriodStats
  previous: CurrencyPeriodStats | null
  currency: string
}

export function StatsAveragesRow({
  current,
  previous,
  currency,
}: StatsAveragesRowProps) {
  const { t } = useTranslation()

  return (
    <View style={styles.row}>
      <AverageCard
        label={t("screens.stats.averages.expense")}
        value={current.avgDailyExpense}
        previousValue={previous?.avgDailyExpense ?? null}
        currency={currency}
        invertedSentiment
      />
      <AverageCard
        label={t("screens.stats.averages.income")}
        value={current.avgDailyIncome}
        previousValue={previous?.avgDailyIncome ?? null}
        currency={currency}
      />
      <AverageCard
        label={t("screens.stats.averages.net")}
        value={current.avgDailyNet}
        previousValue={previous?.avgDailyNet ?? null}
        currency={currency}
      />
    </View>
  )
}

function AverageCard({
  label,
  value,
  previousValue,
  currency,
  invertedSentiment = false,
}: {
  label: string
  value: number
  previousValue: number | null
  currency: string
  invertedSentiment?: boolean
}) {
  return (
    <View style={styles.card}>
      <Text variant="muted" style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Money
        value={value}
        currency={currency}
        tone="transfer"
        variant="small"
        compact
      />
      <DeltaBadge
        current={value}
        previous={previousValue}
        invertedSentiment={invertedSentiment}
        size="sm"
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 12,
    gap: 4,
    borderCurve: "continuous",
  },
  label: {
    fontSize: theme.typography.labelXSmall.fontSize,
  },
}))

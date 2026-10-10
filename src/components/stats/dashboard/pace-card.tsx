import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { CurrencyPeriodStats } from "~/types/stats"

import { DeltaBadge } from "../delta-badge"
import { StatCard } from "./stat-card"

interface PaceCardProps {
  current: CurrencyPeriodStats
  previous: CurrencyPeriodStats | null
  currency: string
  onPress: () => void
}

export function PaceCard({
  current,
  previous,
  currency,
  onPress,
}: PaceCardProps) {
  const { t } = useTranslation()

  return (
    <StatCard
      title={t("screens.stats.dashboard.pace")}
      icon="dashboard"
      onPress={onPress}
    >
      <View style={styles.body}>
        <Text variant="muted" style={styles.label}>
          {t("screens.stats.dashboard.totalSpent")}
        </Text>
        <View style={styles.totalRow}>
          <Money
            value={current.totalExpense}
            currency={currency}
            tone="transfer"
            visualTone="expense"
            compact
            fit
            variant="h4"
            style={styles.totalAmount}
          />
          <DeltaBadge
            current={current.totalExpense}
            previous={previous?.totalExpense}
            invertedSentiment
          />
        </View>
        <View style={styles.avgRow}>
          <Text variant="muted" style={styles.label}>
            {t("screens.stats.dashboard.avgPerDay")}
          </Text>
          <Money
            value={current.avgDailyExpense}
            currency={currency}
            tone="transfer"
            visualTone="expense"
            compact
            fit
            variant="small"
            style={styles.avgAmount}
          />
        </View>
      </View>
    </StatCard>
  )
}

const styles = StyleSheet.create((theme) => ({
  body: {
    gap: 8,
  },
  label: {
    fontSize: theme.typography.labelXSmall.fontSize,
  },
  // The delta badge drops to its own line when the amount leaves no room.
  totalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  totalAmount: {
    flexShrink: 1,
    fontWeight: "700",
    fontSize: theme.typography.titleSmall.fontSize,
  },
  avgRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  avgAmount: {
    flexShrink: 1,
    fontWeight: "600",
    fontSize: theme.typography.bodyMedium.fontSize,
    textAlign: "right",
  },
}))

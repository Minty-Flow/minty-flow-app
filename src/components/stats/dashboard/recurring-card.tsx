import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useRecurringSpend } from "~/database/drizzle/read-models/stats-read-model"
import type { StatsDateRange } from "~/types/stats"

import { StatCard } from "./stat-card"

interface RecurringCardProps {
  dateRange: StatsDateRange
  currency: string
  onPress: () => void
}

export function RecurringCard({
  dateRange,
  currency,
  onPress,
}: RecurringCardProps) {
  const { t } = useTranslation()
  const { total, count } = useRecurringSpend(dateRange, currency)

  return (
    <StatCard
      title={t("screens.stats.dashboard.recurring")}
      icon="repeat-outline"
      onPress={onPress}
    >
      {count > 0 ? (
        <View style={styles.body}>
          <Money
            value={total}
            currency={currency}
            tone="transfer"
            visualTone="expense"
            variant="h4"
            compact
            fit
            style={styles.amount}
          />
          <Text variant="muted">
            {t("screens.stats.dashboard.recurringCount", { count })}
          </Text>
        </View>
      ) : (
        <Text variant="muted">{t("screens.stats.dashboard.noRecurring")}</Text>
      )}
    </StatCard>
  )
}

const styles = StyleSheet.create(() => ({
  body: {
    gap: 4,
  },
  amount: {
    fontWeight: "700",
  },
}))

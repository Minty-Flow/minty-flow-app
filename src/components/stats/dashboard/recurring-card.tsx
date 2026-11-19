import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useRecurringSummary } from "~/database/drizzle/read-models/stats-read-model"

import { StatCard } from "./stat-card"

interface RecurringCardProps {
  currency: string
  onPress: () => void
}

export function RecurringCard({ currency, onPress }: RecurringCardProps) {
  const { t } = useTranslation()
  const summary = useRecurringSummary(currency)
  const count =
    (summary?.subscriptions.length ?? 0) + (summary?.repetitive.length ?? 0)

  return (
    <StatCard
      title={t("screens.stats.dashboard.recurring")}
      icon="repeat-outline"
      onPress={onPress}
    >
      {count > 0 && summary ? (
        <View style={styles.body}>
          <View style={styles.amountRow}>
            <Money
              value={summary.monthlyTotal}
              currency={currency}
              tone="transfer"
              visualTone="expense"
              variant="h4"
              compact
              fit
              style={styles.amount}
            />
            <Text variant="muted">{t("screens.stats.dashboard.perMonth")}</Text>
          </View>
          <Text variant="muted">
            {t("screens.stats.dashboard.recurringActive", { count })}
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
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  amount: {
    flexShrink: 1,
    fontWeight: "700",
  },
}))

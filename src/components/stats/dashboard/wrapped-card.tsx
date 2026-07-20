import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { CurrencyStats } from "~/types/stats"

interface WrappedCardProps {
  stats: CurrencyStats
  monthLabel: string
  onPress: () => void
}

export function WrappedCard({ stats, monthLabel, onPress }: WrappedCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const biggest = stats.topTransactions[0]?.amount ?? 0

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <IconSvg name="sparkles" size={28} color={theme.colors.primary} />
      <View style={styles.body}>
        <Text variant="h4" style={styles.title} numberOfLines={1}>
          {t("screens.stats.dashboard.wrappedTitle", { month: monthLabel })}
        </Text>
        <View style={styles.subtitleRow}>
          <Text variant="muted" style={styles.subtitle}>
            {t("screens.stats.dashboard.wrappedEntries", {
              count: stats.current.transactionCount,
            })}
            {" · "}
            {t("screens.stats.dashboard.wrappedBiggest")}{" "}
          </Text>
          <Money
            value={biggest}
            currency={stats.currency}
            tone="transfer"
            variant="muted"
            compact
          />
        </View>
      </View>
      <IconSvg
        name="chevron-right-outline"
        size={18}
        color={theme.colors.semantic.semi}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: `${theme.colors.primary}14`,
    borderRadius: theme.radius,
    padding: 16,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: "700",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: theme.typography.bodySmall.fontSize,
  },
}))

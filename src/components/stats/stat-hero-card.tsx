import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { DeltaBadge } from "./delta-badge"

interface StatHeroCardProps {
  label: string
  value: number
  currency: string
  previous: number | null
  invertedSentiment?: boolean
  transactionCount?: number
  forecast?: number
}

export function StatHeroCard({
  label,
  value,
  currency,
  previous,
  invertedSentiment = false,
  transactionCount,
  forecast,
}: StatHeroCardProps) {
  const { t } = useTranslation()
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text variant="small" style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <DeltaBadge
          current={value}
          previous={previous}
          invertedSentiment={invertedSentiment}
        />
      </View>
      <Money
        value={value}
        currency={currency}
        tone="transfer"
        variant="h4"
        compact
      />
      {transactionCount !== undefined && transactionCount > 0 && (
        <Text variant="muted" style={styles.subline}>
          {t("screens.stats.hero.transactionCount", {
            count: transactionCount,
          })}
        </Text>
      )}
      {forecast !== undefined && forecast > 0 && (
        <Text variant="muted" style={styles.subline}>
          {t("screens.stats.hero.onPaceFor", {
            amount: Math.round(forecast).toLocaleString(),
          })}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    minWidth: 160,
    gap: 8,
    borderCurve: "continuous",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  label: {
    color: theme.colors.customColors.semi,
    flexShrink: 1,
  },
  subline: {
    fontSize: theme.typography.labelXSmall.fontSize,
    color: theme.colors.customColors.semi,
    marginTop: -4,
  },
}))

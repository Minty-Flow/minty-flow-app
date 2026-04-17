import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

type EmptyScenario =
  | "noData"
  | "allPending"
  | "allTransfers"
  | "noTransactionsEver"

interface StatsEmptyStateProps {
  currency?: string
  rangeLabel: string
  scenario?: EmptyScenario
}

export function StatsEmptyState({
  currency,
  rangeLabel,
  scenario,
}: StatsEmptyStateProps) {
  const { t } = useTranslation()

  const getTitle = () => {
    if (scenario === "allPending")
      return t("screens.stats.emptyState.allPending")
    if (scenario === "allTransfers")
      return t("screens.stats.emptyState.allTransfers")
    if (scenario === "noTransactionsEver")
      return t("screens.stats.emptyState.noTransactionsEver")
    const base = t("screens.stats.emptyState.title")
    return currency ? `${base} (${currency})` : base
  }

  const getDescription = () => {
    if (scenario === "noTransactionsEver")
      return t("screens.stats.emptyState.addFirst")
    return t("screens.stats.emptyState.description")
  }

  return (
    <View style={styles.container}>
      <IconSvg name="chart-histogram" size={48} style={styles.icon} />
      <Text variant="default" style={styles.title}>
        {getTitle()}
      </Text>
      <Text variant="muted" style={styles.subtitle}>
        {rangeLabel}
      </Text>
      <Text variant="muted" style={styles.hint}>
        {getDescription()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  icon: {
    color: theme.colors.customColors.semi,
    marginBottom: 8,
  },
  title: {
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  hint: {
    textAlign: "center",
    fontSize: theme.typography.bodyMedium.fontSize,
  },
}))

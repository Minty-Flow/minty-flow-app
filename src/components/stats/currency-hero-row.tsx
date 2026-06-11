import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { View } from "~/components/ui/view"
import type { CurrencyStats, ForecastSummary } from "~/types/stats"

import { StatHeroCard } from "./stat-hero-card"

interface CurrencyHeroRowProps {
  stats: CurrencyStats
  forecast?: ForecastSummary | null
}

export function CurrencyHeroRow({ stats, forecast }: CurrencyHeroRowProps) {
  const { t } = useTranslation()
  const { current, previous, currency } = stats

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <StatHeroCard
        label={t("screens.stats.hero.totalExpense")}
        value={current.totalExpense}
        currency={currency}
        previous={previous?.totalExpense ?? null}
        invertedSentiment
        transactionCount={current.transactionCount}
        forecast={forecast?.isActive ? forecast.forecastedExpense : undefined}
      />
      <StatHeroCard
        label={t("screens.stats.hero.totalIncome")}
        value={current.totalIncome}
        currency={currency}
        previous={previous?.totalIncome ?? null}
      />
      <StatHeroCard
        label={t("screens.stats.hero.netFlow")}
        value={current.net}
        currency={currency}
        previous={previous?.net ?? null}
      />
      <View style={styles.trailingSpacer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create(() => ({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },
  trailingSpacer: {
    width: 4,
  },
}))

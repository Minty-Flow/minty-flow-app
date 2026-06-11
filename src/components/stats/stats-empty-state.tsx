import { useTranslation } from "react-i18next"

import { EmptyState } from "~/components/ui/empty-state"

import { View } from "../ui/view"

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
    <View style={{ marginInline: 20 }}>
      <EmptyState
        icon="chart-histogram-outline"
        title={getTitle()}
        description={`${rangeLabel}\n\n${getDescription()}`}
      />
    </View>
  )
}

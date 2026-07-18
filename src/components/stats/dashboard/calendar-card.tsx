import { useTranslation } from "react-i18next"

import { Text } from "~/components/ui/text"
import type { DailyDataPoint } from "~/types/stats"

import { SpendingHeatmap } from "../spending-heatmap"
import { StatCard } from "./stat-card"

interface CalendarCardProps {
  dailyData: DailyDataPoint[]
  from: Date
  to: Date
  onPress: () => void
}

export function CalendarCard({
  dailyData,
  from,
  to,
  onPress,
}: CalendarCardProps) {
  const { t } = useTranslation()
  const hasSpending = dailyData.some((d) => d.expense > 0)

  return (
    <StatCard
      title={t("screens.stats.dashboard.calendar")}
      icon="calendar-outline"
      onPress={onPress}
    >
      {hasSpending ? (
        <SpendingHeatmap dailyData={dailyData} from={from} to={to} compact />
      ) : (
        <Text variant="muted">
          {t("screens.stats.dashboard.noSpendingWindow")}
        </Text>
      )}
    </StatCard>
  )
}

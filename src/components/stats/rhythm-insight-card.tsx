import { useTranslation } from "react-i18next"

import type { DayOfWeekPoint } from "~/types/stats"
import { getWeekdayLabel } from "~/utils/time-utils"

import { InsightCard } from "./insight-card"
import { MiniBars } from "./mini-bars"

interface RhythmInsightCardProps {
  days: DayOfWeekPoint[]
}

export function RhythmInsightCard({ days }: RhythmInsightCardProps) {
  const { t } = useTranslation()

  const max = Math.max(...days.map((d) => d.avgExpense), 0)
  if (max === 0) return null

  const priciest = days.reduce((a, b) => (b.avgExpense > a.avgExpense ? b : a))

  return (
    <InsightCard
      icon="calendar-outline"
      badge={t("screens.stats.wrapped.badgeRhythm")}
      sentence={t("screens.stats.wrapped.rhythmSentence", {
        day: getWeekdayLabel(priciest.day),
      })}
    >
      <MiniBars
        bars={days.map((d) => ({
          label: getWeekdayLabel(d.day, "narrow"),
          value: d.avgExpense,
          active: d.day === priciest.day,
        }))}
      />
    </InsightCard>
  )
}

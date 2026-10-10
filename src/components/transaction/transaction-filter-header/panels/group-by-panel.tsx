import { useTranslation } from "react-i18next"

import type { GroupByOption } from "~/types/transaction-filters"

import { ChipOptionsPanel } from "./chip-options-panel"

interface GroupByPanelProps {
  value: GroupByOption
  onSelect: (v: GroupByOption) => void
  onDone: () => void
}

export function GroupByPanel({ value, onSelect, onDone }: GroupByPanelProps) {
  const { t } = useTranslation()
  const options: { id: GroupByOption; label: string }[] = [
    { id: "hour", label: t("components.filters.groupByOptions.hour") },
    { id: "day", label: t("components.filters.groupByOptions.day") },
    { id: "week", label: t("components.filters.groupByOptions.week") },
    { id: "month", label: t("components.filters.groupByOptions.month") },
    { id: "year", label: t("components.filters.groupByOptions.year") },
    { id: "allTime", label: t("components.filters.groupByOptions.allTime") },
  ]

  return (
    <ChipOptionsPanel
      options={options}
      isSelected={(id) => value === id}
      onPress={onSelect}
      onDone={onDone}
    />
  )
}

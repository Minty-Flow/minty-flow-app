import { useTranslation } from "react-i18next"
import { View } from "react-native"

import { Chip } from "~/components/ui/chips"
import type { GroupByOption } from "~/types/transaction-filters"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk } from "../utils"

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
    <View>
      {chunk(options, CHIPS_PER_ROW).map((row) => (
        <View
          key={row.map((o) => o.id).join(",")}
          style={[
            filterHeaderStyles.chipScrollRow,
            filterHeaderStyles.categoryRow,
          ]}
        >
          {row.map((opt) => (
            <Chip
              key={opt.id}
              label={opt.label}
              selected={value === opt.id}
              onPress={() => onSelect(opt.id)}
            />
          ))}
        </View>
      ))}
      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}

import { useTranslation } from "react-i18next"
import { View } from "react-native"

import { Chip } from "~/components/ui/chips"
import { PendingOptionsEnum } from "~/types/transaction-filters"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk } from "../utils"

interface PendingPanelProps {
  value: "all" | "pending" | "notPending"
  onSelect: (v: "all" | "pending" | "notPending") => void
  onDone: () => void
}

export function PendingPanel({ value, onSelect, onDone }: PendingPanelProps) {
  const { t } = useTranslation()
  const options = [
    {
      id: PendingOptionsEnum.ALL,
      label: t("components.filters.pendingOptions.all"),
    },
    {
      id: PendingOptionsEnum.PENDING,
      label: t("components.filters.pendingOptions.pending"),
    },
    {
      id: PendingOptionsEnum.NOT_PENDING,
      label: t("components.filters.pendingOptions.notPending"),
    },
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

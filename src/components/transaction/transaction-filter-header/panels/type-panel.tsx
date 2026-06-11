import { useTranslation } from "react-i18next"
import { View } from "react-native"

import { Chip } from "~/components/ui/chips"
import type { TransactionType } from "~/types/transactions"
import { TransactionTypeEnum } from "~/types/transactions"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk } from "../utils"

interface TypePanelProps {
  value: TransactionType[]
  onToggle: (type: TransactionType) => void
  onClear: () => void
  onDone: () => void
}

export function TypePanel({
  value,
  onToggle,
  onClear,
  onDone,
}: TypePanelProps) {
  const { t } = useTranslation()
  const options: { id: TransactionType; label: string }[] = [
    {
      id: TransactionTypeEnum.EXPENSE,
      label: t("components.categories.types.expense"),
    },
    {
      id: TransactionTypeEnum.INCOME,
      label: t("components.categories.types.income"),
    },
    {
      id: TransactionTypeEnum.TRANSFER,
      label: t("components.categories.types.transfer"),
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
              selected={value.includes(opt.id)}
              onPress={() => onToggle(opt.id)}
            />
          ))}
        </View>
      ))}
      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelClearButton onPress={onClear} disabled={value.length === 0} />
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}

import { useTranslation } from "react-i18next"

import type { TransactionType } from "~/types/transactions"
import { TransactionTypeEnum } from "~/types/transactions"

import { ChipOptionsPanel } from "./chip-options-panel"

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
  const selectedValueSet = new Set(value)
  const options: { id: TransactionType; label: string }[] = [
    {
      id: TransactionTypeEnum.EXPENSE,
      label: t("common.transaction.types.expense"),
    },
    {
      id: TransactionTypeEnum.INCOME,
      label: t("common.transaction.types.income"),
    },
    {
      id: TransactionTypeEnum.TRANSFER,
      label: t("common.transaction.types.transfer"),
    },
  ]

  return (
    <ChipOptionsPanel
      options={options}
      isSelected={(id) => selectedValueSet.has(id)}
      onPress={onToggle}
      onClear={onClear}
      clearDisabled={value.length === 0}
      onDone={onDone}
    />
  )
}

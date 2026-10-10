import { useTranslation } from "react-i18next"

import { PendingOptionsEnum } from "~/types/transaction-filters"

import { ChipOptionsPanel } from "./chip-options-panel"

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
    <ChipOptionsPanel
      options={options}
      isSelected={(id) => value === id}
      onPress={onSelect}
      onDone={onDone}
    />
  )
}

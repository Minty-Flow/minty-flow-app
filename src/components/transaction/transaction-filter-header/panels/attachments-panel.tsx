import { useTranslation } from "react-i18next"

import {
  AttachmentsOptionsEnum,
  type AttachmentsOptionsType,
} from "~/types/transaction-filters"

import { ChipOptionsPanel } from "./chip-options-panel"

interface AttachmentsPanelProps {
  value: AttachmentsOptionsType
  onSelect: (v: AttachmentsOptionsType) => void
  onDone: () => void
}

export function AttachmentsPanel({
  value,
  onSelect,
  onDone,
}: AttachmentsPanelProps) {
  const { t } = useTranslation()
  const options = [
    {
      id: AttachmentsOptionsEnum.ALL,
      label: t("components.filters.chips.attachments"),
    },
    {
      id: AttachmentsOptionsEnum.HAS,
      label: t("components.filters.attachmentOptions.has"),
    },
    {
      id: AttachmentsOptionsEnum.NONE,
      label: t("components.filters.attachmentOptions.none"),
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

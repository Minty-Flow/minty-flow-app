import { useTranslation } from "react-i18next"
import { View } from "react-native"

import { Chip } from "~/components/ui/chips"
import {
  AttachmentsOptionsEnum,
  type AttachmentsOptionsType,
} from "~/types/transaction-filters"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelDoneButton } from "../panel-done-button"

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
    <View>
      <View
        style={[filterHeaderStyles.chipWrap, filterHeaderStyles.categoryRow]}
      >
        {options.map((opt) => (
          <Chip
            key={opt.id}
            label={opt.label}
            selected={value === opt.id}
            onPress={() => onSelect(opt.id)}
          />
        ))}
      </View>
      <View style={filterHeaderStyles.panelHeader}>
        <View />
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}

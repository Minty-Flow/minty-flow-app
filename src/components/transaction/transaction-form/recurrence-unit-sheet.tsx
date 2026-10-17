import { useTranslation } from "react-i18next"

import { sheetStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import {
  SingleSelectItem,
  SingleSelectLabel,
} from "~/components/ui/single-select-item"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { RecurrenceUnit } from "~/types/transactions"

const UNITS: RecurrenceUnit[] = ["day", "week", "month", "year"]

type Props = {
  visible: boolean
  value: RecurrenceUnit
  onSelect: (u: RecurrenceUnit) => void
  onClose: () => void
}

export function RecurrenceUnitSheet({
  visible,
  value,
  onSelect,
  onClose,
}: Props) {
  const { t } = useTranslation()
  return (
    <BottomSheet isPresented={visible} onDismiss={onClose}>
      <View>
        <Text variant="default" style={sheetStyles.headerTitle}>
          {t("components.transactionForm.recurrence.unitTitle")}
        </Text>
        {UNITS.map((u) => (
          <SingleSelectItem
            key={u}
            selected={u === value}
            style={sheetStyles.item}
            onPress={() => {
              onSelect(u)
              onClose()
            }}
          >
            {/* count:2 so the label reads as a plural noun ("weeks"), not "every 2 week" */}
            <SingleSelectLabel variant="large">
              {t(`components.transactionForm.recurrence.unit.${u}`, {
                count: 2,
              })}
            </SingleSelectLabel>
          </SingleSelectItem>
        ))}
      </View>
    </BottomSheet>
  )
}

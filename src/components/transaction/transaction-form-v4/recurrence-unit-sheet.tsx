import { useTranslation } from "react-i18next"

import { sheetStyles } from "~/components/selectors/styles"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { ListItem } from "~/components/ui/list-item"
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
          <ListItem
            key={u}
            style={[sheetStyles.item, u === value && sheetStyles.itemSelected]}
            onPress={() => {
              onSelect(u)
              onClose()
            }}
          >
            {/* count:2 so the label reads as a plural noun ("weeks"), not "every 2 week" */}
            <Text variant="large">
              {t(`components.transactionForm.recurrence.unit.${u}`, {
                count: 2,
              })}
            </Text>
          </ListItem>
        ))}
      </View>
    </BottomSheet>
  )
}

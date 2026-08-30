import { useTranslation } from "react-i18next"
import { Modal } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { modalStyles } from "~/components/selector-modals/styles"
import { Button } from "~/components/ui/button"
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

export function RecurrenceUnitModal({
  visible,
  value,
  onSelect,
  onClose,
}: Props) {
  const { t } = useTranslation()
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <SafeAreaView
        style={modalStyles.modalContainer}
        edges={["top", "bottom"]}
      >
        <View style={modalStyles.header}>
          <Text variant="default" style={modalStyles.headerTitle}>
            {t("components.transactionForm.recurrence.unitTitle")}
          </Text>
          <Button variant="ghost" onPress={onClose}>
            <Text variant="default">{t("common.actions.cancel")}</Text>
          </Button>
        </View>
        <View style={modalStyles.listWrapper}>
          {UNITS.map((u) => (
            <ListItem
              key={u}
              style={[
                modalStyles.item,
                u === value && modalStyles.itemSelected,
              ]}
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
      </SafeAreaView>
    </Modal>
  )
}

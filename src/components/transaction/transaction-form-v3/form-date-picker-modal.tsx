import type { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTranslation } from "react-i18next"
import { Modal, Platform } from "react-native"
import { useUnistyles } from "react-native-unistyles"

import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { transactionFormStyles } from "./form.styles"

type Props = {
  visible: boolean
  mode: "date" | "time"
  tempDate: Date
  onClose: () => void
  onConfirm: () => void
  onChange: (evt: DateTimePickerEvent, date?: Date) => void
}

export function FormDatePickerModal({
  visible,
  mode,
  tempDate,
  onClose,
  onConfirm,
  onChange,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  if (Platform.OS !== "ios" || !visible) return null

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        style={transactionFormStyles.datePickerOverlay}
        onPress={onClose}
      />
      <View
        style={[
          transactionFormStyles.datePickerModal,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View
          style={[
            transactionFormStyles.datePickerHeader,
            { borderBottomColor: `${theme.colors.customColors.semi}20` },
          ]}
        >
          <Pressable
            onPress={onClose}
            style={transactionFormStyles.datePickerCancel}
          >
            <Text
              style={[
                transactionFormStyles.datePickerCancelText,
                { color: theme.colors.onSurface },
              ]}
            >
              {t("common.actions.cancel")}
            </Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={transactionFormStyles.datePickerDone}
          >
            <Text
              style={[
                transactionFormStyles.datePickerDoneText,
                { color: theme.colors.primary },
              ]}
            >
              {mode === "date"
                ? t("common.actions.next")
                : t("common.actions.add")}
            </Text>
          </Pressable>
        </View>
        <View style={transactionFormStyles.datePickerBody}>
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            onChange={onChange}
            textColor={theme.colors.onSurface}
          />
        </View>
      </View>
    </Modal>
  )
}

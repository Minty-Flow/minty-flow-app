import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useUnistyles } from "react-native-unistyles"

import type { TranslationKey } from "~/i18n/config"

import { Pressable } from "../pressable"
import { Text } from "../text"
import { View } from "../view"
import { DateTimePicker } from "./date-time-picker"
import { datePickerModalStyles } from "./styles"

/**
 * iOS-only bottom sheet date/time picker.
 * On Android, use the `useDateTimePicker` hook which opens the native dialog
 * imperatively — no JSX needed.
 */
type Props = {
  visible: boolean
  mode?: "date" | "time"
  value: Date
  onClose: () => void
  onConfirm: (date: Date) => void
  confirmLabel?: TranslationKey
  title?: string
}

export function DateTimePickerModal({ visible, ...rest }: Props) {
  if (!visible) return null
  return <DateTimePickerModalInner {...rest} />
}

// Mounted only while visible — useState(value) initializes fresh on each open,
// so no useEffect sync is needed.
function DateTimePickerModalInner({
  mode = "date",
  value,
  onClose,
  onConfirm,
  confirmLabel = "common.actions.done",
  title,
}: Omit<Props, "visible">) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()
  const [tempDate, setTempDate] = useState(() => value)

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={datePickerModalStyles.overlay} onPress={onClose}>
        <Pressable
          style={[
            datePickerModalStyles.sheet,
            {
              backgroundColor: theme.colors.surface,
              paddingBottom: insets.bottom + 8,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              datePickerModalStyles.header,
              { borderBottomColor: `${theme.colors.onSurface}20` },
            ]}
          >
            <Pressable
              onPress={onClose}
              style={datePickerModalStyles.cancelButton}
            >
              <Text
                style={[
                  datePickerModalStyles.cancelText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {t("common.actions.cancel")}
              </Text>
            </Pressable>

            <View style={datePickerModalStyles.titleContainer}>
              {title != null && (
                <Text
                  style={[
                    datePickerModalStyles.titleText,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {title}
                </Text>
              )}
            </View>

            <Pressable
              onPress={() => onConfirm(tempDate)}
              style={datePickerModalStyles.doneButton}
            >
              <Text
                style={[
                  datePickerModalStyles.doneText,
                  { color: theme.colors.primary },
                ]}
              >
                {t(confirmLabel)}
              </Text>
            </Pressable>
          </View>

          <View style={datePickerModalStyles.body}>
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="spinner"
              onValueChange={(_, date) => {
                if (date) setTempDate(date)
              }}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

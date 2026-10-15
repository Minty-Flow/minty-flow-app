import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { useSheetOpenKey } from "~/hooks/use-sheet-open-key"
import type { TranslationKey } from "~/i18n/config"

import { BottomSheet } from "../bottom-sheet"
import { Pressable } from "../pressable"
import { Text } from "../text"
import { View } from "../view"
import { DateTimePicker } from "./date-time-picker"
import { datePickerSheetStyles } from "./styles"

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

export function DateTimePickerSheet(props: Props) {
  // A new key per open starts from the current value, while the sheet stays
  // mounted to animate out.
  const openKey = useSheetOpenKey(props.visible)
  return <DateTimePickerSheetInner key={openKey} {...props} />
}

function DateTimePickerSheetInner({
  visible,
  mode = "date",
  value,
  onClose,
  onConfirm,
  confirmLabel = "common.actions.done",
  title,
}: Props) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [tempDate, setTempDate] = useState(() => value)

  return (
    <BottomSheet isPresented={visible} onDismiss={onClose} contentPadding={0}>
      <View>
        <View
          style={[
            datePickerSheetStyles.header,
            { borderBottomColor: `${theme.colors.onSurface}20` },
          ]}
        >
          <Pressable
            onPress={onClose}
            style={datePickerSheetStyles.cancelButton}
          >
            <Text
              style={[
                datePickerSheetStyles.cancelText,
                { color: theme.colors.onSurface },
              ]}
            >
              {t("common.actions.cancel")}
            </Text>
          </Pressable>

          <View style={datePickerSheetStyles.titleContainer}>
            {title != null && (
              <Text
                style={[
                  datePickerSheetStyles.titleText,
                  { color: theme.colors.onSurface },
                ]}
              >
                {title}
              </Text>
            )}
          </View>

          <Pressable
            onPress={() => onConfirm(tempDate)}
            style={datePickerSheetStyles.doneButton}
          >
            <Text
              style={[
                datePickerSheetStyles.doneText,
                { color: theme.colors.primary },
              ]}
            >
              {t(confirmLabel)}
            </Text>
          </Pressable>
        </View>

        <View style={datePickerSheetStyles.body}>
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            onValueChange={(_, date) => {
              if (date) setTempDate(date)
            }}
          />
        </View>
      </View>
    </BottomSheet>
  )
}

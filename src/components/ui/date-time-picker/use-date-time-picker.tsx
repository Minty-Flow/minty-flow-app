import { useRef, useState } from "react"
import { Platform } from "react-native"

import { DateTimePicker } from "./date-time-picker"

type UseDatePickerOptions = {
  mode?: "date" | "time"
  onConfirm: (date: Date) => void
}

/**
 * Manages a date/time picker across platforms.
 *
 * - Android: renders @expo/ui DateTimePicker with presentation="dialog" via
 *   `pickerElement`. Consumers must render `{picker.pickerElement}`.
 * - iOS: tracks visibility + starting value and returns `modalProps` to spread
 *   onto a <DateTimePickerModal />.
 *
 * Usage:
 *   const picker = useDateTimePicker({ onConfirm: (date) => doSomething(date) })
 *   <Pressable onPress={() => picker.open(currentDate)} />
 *   {picker.pickerElement}
 *   <DateTimePickerModal {...picker.modalProps} />
 */
export function useDateTimePicker({
  mode = "date",
  onConfirm,
}: UseDatePickerOptions) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState(new Date())
  const [androidPicker, setAndroidPicker] = useState<{
    visible: boolean
    value: Date
  } | null>(null)

  const onConfirmRef = useRef(onConfirm)
  onConfirmRef.current = onConfirm

  const open = (initialDate = new Date()) => {
    if (Platform.OS === "android") {
      setAndroidPicker({ visible: true, value: initialDate })
    } else {
      setValue(initialDate)
      setVisible(true)
    }
  }

  const close = () => setVisible(false)

  const pickerElement =
    Platform.OS === "android" && androidPicker?.visible ? (
      <DateTimePicker
        value={androidPicker.value}
        mode={mode}
        presentation="dialog"
        onValueChange={(_, date) => {
          setAndroidPicker(null)
          if (date) onConfirmRef.current(date)
        }}
        onDismiss={() => setAndroidPicker(null)}
      />
    ) : null

  return {
    open,
    pickerElement,
    modalProps: {
      visible,
      mode,
      value,
      onClose: close,
      onConfirm: (date: Date) => {
        close()
        onConfirmRef.current(date)
      },
    },
  }
}

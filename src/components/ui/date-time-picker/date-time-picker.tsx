import ExpoDateTimePicker, {
  type DateTimePickerProps as ExpoDateTimePickerProps,
} from "@expo/ui/community/datetime-picker"
import { getLocales } from "expo-localization"

import { useLanguageStore } from "~/stores/language.store"

type DateTimePickerProps = ExpoDateTimePickerProps

/**
 * Project-wide DateTimePicker wrapper around `@expo/ui/community/datetime-picker`.
 * Defaults `is24Hour=false`, and forwards the active i18n
 * locale. All defaults are overridable per-call.
 */
export function DateTimePicker({
  is24Hour = false,
  locale,
  ...rest
}: DateTimePickerProps) {
  const languageCode = useLanguageStore((s) => s.languageCode)

  return (
    <ExpoDateTimePicker
      is24Hour={is24Hour}
      locale={locale ?? resolveLocale(languageCode)}
      {...rest}
    />
  )
}

/**
 * Build a locale identifier (e.g. "en_US") from the active i18n language code,
 * preferring the device region from expo-localization when languages match.
 */
function resolveLocale(languageCode: string): string {
  const device = getLocales()[0]
  if (device?.languageCode === languageCode && device.regionCode) {
    return `${languageCode}_${device.regionCode}`
  }
  return languageCode
}

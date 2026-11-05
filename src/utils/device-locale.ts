import { getLocales } from "expo-localization"

import {
  type LangCodeType,
  SupportedLanguages,
} from "~/i18n/language.constants"
import { currencyRegistryService } from "~/services/currency-registry"

/**
 * The device language when the app supports it, otherwise null. Only used to
 * pre-select an option on the first onboarding screen; the user still confirms.
 */
export function getSupportedDeviceLanguage(): LangCodeType | null {
  const code = getLocales()[0]?.languageCode
  return SupportedLanguages.find((l) => l.code === code)?.code ?? null
}

/**
 * The currency of the device's first locale when the registry knows it, else
 * null. This follows the locale, not the user's location: most Android devices
 * have no separate region setting, so `en-US` gives USD in any country. Only
 * used to pre-fill the currency row; the user can change it there.
 */
export function getDeviceCurrency(): string | null {
  const code = getLocales()[0]?.currencyCode
  return code && currencyRegistryService.isCurrencyCodeValid(code) ? code : null
}

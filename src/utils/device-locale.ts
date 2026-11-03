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

/** The currency of the device region when the registry knows it, else null. */
export function getDeviceCurrency(): string | null {
  const code = getLocales()[0]?.currencyCode
  return code && currencyRegistryService.isCurrencyCodeValid(code) ? code : null
}

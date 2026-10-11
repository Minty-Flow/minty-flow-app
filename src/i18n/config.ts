import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { LangCodeEnum } from "~/i18n/language.constants"

import en from "./translation/en.json" with { type: "json" }

type Primitive = string | number | boolean | bigint | symbol | null | undefined

type IsPlainObject<T> = T extends Primitive
  ? false
  : T extends readonly unknown[]
    ? false
    : T extends object
      ? true
      : false

type NestedKeyOf<T> = {
  [K in keyof T & string]: IsPlainObject<T[K]> extends true
    ? `${K}.${NestedKeyOf<T[K]>}`
    : T[K] extends string
      ? K
      : never
}[keyof T & string]

type TranslationShape = typeof en
export type TranslationKey = NestedKeyOf<TranslationShape>

// ✅ Enforce other languages have the same keys as English
const En = en satisfies TranslationShape

// ✅ Same check for Arabic, without importing the file at startup
type ArabicShape = typeof import("./translation/ar.json")
const _arabicMatchesEnglish: ArabicShape extends TranslationShape
  ? true
  : never = true
void _arabicMatchesEnglish

// ✅ English ships at startup; other languages load on first use
const LanguageResources = {
  [LangCodeEnum.EN]: { translation: En },
}

/** Load a language's strings before switching to it (no-op if already loaded). */
export function ensureLanguageLoaded(code: string): void {
  if (i18n.hasResourceBundle(code, "translation")) return
  if (code === LangCodeEnum.AR) {
    i18n.addResourceBundle(
      code,
      "translation",
      require("./translation/ar.json"),
    )
  }
}

// ✅ Update i18next typing for full IntelliSense
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation"
    resources: {
      translation: TranslationShape
    }
  }
}

// English first, always: a saved choice (applied on rehydrate) is the only way to
// get another language. The device language is deliberately not consulted.
const initialLanguage = LangCodeEnum.EN

i18n.use(initReactI18next).init({
  resources: LanguageResources,
  lng: initialLanguage,
  fallbackLng: LangCodeEnum.EN,

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },

  showSupportNotice: false,
})

export default i18n

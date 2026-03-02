import { getLocales } from "expo-localization"
import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { LangCodeEnum } from "~/i18n/language.constants"

import ar from "./translation/ar.json" with { type: "json" }
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

export type TranslationShape = typeof en
export type TranslationKey = NestedKeyOf<TranslationShape>

// ✅ Enforce other languages have the same keys as English
const _en = en satisfies TranslationShape

const _ar = ar satisfies TranslationShape

// ✅ Resources for i18next
export const LanguageResources = {
  [LangCodeEnum.EN]: { translation: _en },
  [LangCodeEnum.AR]: { translation: _ar },
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

const deviceLocale = getLocales()[0]
const initialLanguage = deviceLocale?.languageCode ?? LangCodeEnum.EN

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

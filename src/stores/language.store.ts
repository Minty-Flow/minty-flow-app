import { I18nManager } from "react-native"
import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import i18n from "~/i18n/config"
import {
  DirectionEnum,
  type DirectionType,
  LangCodeEnum,
  type LangCodeType,
} from "~/i18n/language.constants"

const LanguageStorage = createMMKV({
  id: "language-preferences-storage",
})

interface LanguageStore {
  languageCode: LangCodeType
  direction: DirectionType

  // Derived
  isRTL: boolean
  isLTR: boolean

  setLanguageCode: (value: LangCodeType) => void
  setDirection: (value: DirectionType) => void
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => {
      // English first, always: only an explicit saved choice changes this.
      const initialLang: LangCodeType = LangCodeEnum.EN
      const initialDirection: DirectionType = DirectionEnum.LTR

      return {
        /* ───────── State ───────── */
        languageCode: initialLang,
        direction: initialDirection,

        /* ───────── Derived ───────── */
        isRTL: false,
        isLTR: true,

        /* ───────── Actions ───────── */
        setLanguageCode: (value) => {
          const newDirection =
            value === LangCodeEnum.AR ? DirectionEnum.RTL : DirectionEnum.LTR
          const shouldBeRTL = newDirection === DirectionEnum.RTL

          i18n.changeLanguage(value)
          i18n.dir(newDirection)

          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.allowRTL(true)
            I18nManager.forceRTL(shouldBeRTL)
          }

          set({
            languageCode: value,
            direction: newDirection,
            isRTL: shouldBeRTL,
            isLTR: !shouldBeRTL,
          })
        },

        setDirection: (value) => {
          const shouldBeRTL = value === DirectionEnum.RTL
          i18n.dir(value)
          if (I18nManager.isRTL !== shouldBeRTL) {
            I18nManager.forceRTL(shouldBeRTL)
          }
          set({
            direction: value,
            isRTL: shouldBeRTL,
            isLTR: !shouldBeRTL,
          })
        },
      }
    },
    {
      name: "language-preferences-store",
      storage: createJSONStorage(() => ({
        getItem: (name) => LanguageStorage.getString(name) ?? null,
        setItem: (name, value) => LanguageStorage.set(name, value),
        removeItem: (name) => LanguageStorage.remove(name),
      })),
      onRehydrateStorage: () => (state) => {
        if (state?.languageCode) {
          // Validate that the rehydrated language code is actually supported
          const validCodes = Object.values(LangCodeEnum)
          if (!validCodes.includes(state.languageCode)) {
            // Reset to default if corrupted MMKV data
            state.languageCode = LangCodeEnum.EN
            state.direction = DirectionEnum.LTR
            state.isRTL = false
            state.isLTR = true
          }

          i18n.changeLanguage(state.languageCode)

          const isRTL = state.direction === DirectionEnum.RTL
          I18nManager.allowRTL(true)

          if (I18nManager.isRTL !== isRTL) {
            I18nManager.forceRTL(isRTL)
          }

          state.isRTL = isRTL
          state.isLTR = !isRTL
        }
      },
    },
  ),
)

export const DirectionEnum = {
  LTR: "ltr",
  RTL: "rtl",
} as const

export type DirectionType = (typeof DirectionEnum)[keyof typeof DirectionEnum]

export const LangCodeEnum = {
  EN: "en",
  AR: "ar",
} as const

export type LangCodeType = (typeof LangCodeEnum)[keyof typeof LangCodeEnum]

/**
 * Every language the app ships. Add a new language here (plus its translation
 * file and loader in `config.ts`) and the pickers and device detection pick it
 * up. `nativeName` is always written in the language's own script.
 */
export const SupportedLanguages: readonly {
  code: LangCodeType
  nativeName: string
  direction: DirectionType
}[] = [
  {
    code: LangCodeEnum.EN,
    nativeName: "English",
    direction: DirectionEnum.LTR,
  },
  {
    code: LangCodeEnum.AR,
    nativeName: "العربية",
    direction: DirectionEnum.RTL,
  },
]

export function getLanguageDirection(code: LangCodeType): DirectionType {
  return (
    SupportedLanguages.find((l) => l.code === code)?.direction ??
    DirectionEnum.LTR
  )
}

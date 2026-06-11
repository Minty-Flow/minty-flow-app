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

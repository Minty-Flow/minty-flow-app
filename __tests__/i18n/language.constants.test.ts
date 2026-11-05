import { describe, expect, it } from "vitest"

import {
  DirectionEnum,
  getLanguageDirection,
  LangCodeEnum,
  type LangCodeType,
} from "~/i18n/language.constants"

describe("getLanguageDirection", () => {
  it("returns LTR for English", () => {
    expect(getLanguageDirection(LangCodeEnum.EN)).toBe(DirectionEnum.LTR)
  })

  it("returns RTL for Arabic", () => {
    expect(getLanguageDirection(LangCodeEnum.AR)).toBe(DirectionEnum.RTL)
  })

  it("falls back to LTR for a language outside the registry", () => {
    expect(getLanguageDirection("xx" as LangCodeType)).toBe(DirectionEnum.LTR)
  })
})

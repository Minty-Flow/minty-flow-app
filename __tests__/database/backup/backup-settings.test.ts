import { describe, expect, it } from "vitest"

import {
  PORTABLE_SETTINGS,
  pickSettings,
  sanitizeSettings,
} from "~/database/backup/backup-settings"

const section = (key: string, state: Record<string, unknown>) => ({
  [key]: { version: PORTABLE_SETTINGS[key].version, state },
})

describe("sanitizeSettings", () => {
  it("keeps valid fields of known stores", () => {
    const out = sanitizeSettings({
      ...section("weekStart", { weekStart: "monday" }),
      ...section("toastStyle", { position: "bottom", showCloseIcon: false }),
    })
    expect(out.weekStart.state).toEqual({ weekStart: "monday" })
    expect(out.toastStyle.state).toEqual({
      position: "bottom",
      showCloseIcon: false,
    })
  })

  it("drops unknown stores and device-specific ones", () => {
    const out = sanitizeSettings({
      appLock: { version: 0, state: { enabled: false } },
      profile: { version: 0, state: { imageUri: "file:///x.jpg" } },
      exportHistory: { version: 0, state: { records: [] } },
      ...section("weekStart", { weekStart: "sunday" }),
    })
    expect(Object.keys(out)).toEqual(["weekStart"])
  })

  it("drops unknown fields and invalid values, keeps the valid ones", () => {
    const out = sanitizeSettings(
      section("moneyFormatting", {
        preferredCurrency: "USD",
        currencyLook: "emoji",
        hideOnStartup: "yes",
        maskOnShake: true,
        privacyMode: true,
      }),
    )
    expect(out.moneyFormatting.state).toEqual({
      preferredCurrency: "USD",
      maskOnShake: true,
    })
  })

  it("rejects an unknown currency and a malformed button order", () => {
    const out = sanitizeSettings({
      ...section("moneyFormatting", { preferredCurrency: "ZZZ9" }),
      ...section("buttonPlacement", { order: ["income", "income", "expense"] }),
    })
    expect(out).toEqual({})
  })

  it("ignores a section saved at another store version", () => {
    const out = sanitizeSettings({
      weekStart: { version: 99, state: { weekStart: "monday" } },
    })
    expect(out).toEqual({})
  })

  it("never throws on garbage", () => {
    for (const bad of [null, undefined, 5, "x", [], { weekStart: 3 }]) {
      expect(() => sanitizeSettings(bad)).not.toThrow()
      expect(sanitizeSettings(bad)).toEqual({})
    }
  })
})

describe("round trip", () => {
  it("keeps portable fields and leaves out everything else a store holds", () => {
    const state = {
      preferredCurrency: "EUR",
      currencyLook: "code",
      hideOnStartup: true,
      maskOnShake: false,
      privacyMode: true, // not persisted, not portable
      setCurrency: () => {},
    }
    const exported = { moneyFormatting: pickSettings("moneyFormatting", state) }
    expect(exported.moneyFormatting.state).toEqual({
      preferredCurrency: "EUR",
      currencyLook: "code",
      hideOnStartup: true,
      maskOnShake: false,
    })
    // What was exported is accepted whole on import.
    expect(sanitizeSettings(JSON.parse(JSON.stringify(exported)))).toEqual(
      exported,
    )
  })
})

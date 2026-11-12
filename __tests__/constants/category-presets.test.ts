import { describe, expect, it } from "vitest"

import {
  type CategoryPreset,
  getPresetGroups,
  isPresetAdded,
} from "~/constants/pre-sets-categories"
import type { CategoryType } from "~/types/categories"

const allPresets = (type: CategoryType): CategoryPreset[] => {
  const { core, packs } = getPresetGroups(type)
  return [...core, ...packs.flatMap((p) => p.presets)]
}

describe("category presets", () => {
  it("offers everything on a fresh install", () => {
    const all = (["expense", "income"] as const).flatMap(allPresets)
    expect(all.filter((p) => !isPresetAdded(p, []))).toHaveLength(40)
  })

  it("treats a category with a retired preset icon as custom", () => {
    const eatingOut = allPresets("expense").find((p) =>
      p.name.endsWith(".eatingOut"),
    )
    if (!eatingOut) throw new Error("no eatingOut preset")
    expect(
      isPresetAdded(eatingOut, [{ type: "expense", icon: "tools-kitchen-2" }]),
    ).toBe(false)
    expect(
      isPresetAdded(eatingOut, [{ type: "expense", icon: eatingOut.icon }]),
    ).toBe(true)
  })

  it("matches by type: an expense icon does not mark an income preset", () => {
    const gifts = allPresets("income").find((p) => p.icon === "gift")
    if (!gifts) throw new Error("no income gifts preset")
    expect(isPresetAdded(gifts, [{ type: "expense", icon: "gift" }])).toBe(
      false,
    )
    expect(isPresetAdded(gifts, [{ type: "income", icon: "gift" }])).toBe(true)
  })

  it("gives every preset a unique icon within its type", () => {
    for (const type of ["expense", "income"] as const) {
      const icons = allPresets(type).map((p) => p.icon)
      expect(new Set(icons).size).toBe(icons.length)
    }
  })
})

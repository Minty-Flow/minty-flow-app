import { describe, expect, it } from "vitest"

import {
  type CategoryPreset,
  getPresetGroups,
  isPresetAdded,
} from "~/constants/pre-sets-categories"
import type { CategoryType } from "~/types/categories"

/** Every icon/type pair a released preset could have created. */
const SHIPPED = {
  // v0.0.11 (core and packs)
  "v0.0.11": [
    "expense:basket",
    "expense:pizza",
    "expense:car",
    "expense:building-outline",
    "expense:plug-outline",
    "expense:shopping-cart",
    "expense:heart",
    "expense:headphones",
    "expense:school",
    "expense:baby-carriage",
    "expense:shield",
    "expense:gas-station",
    "expense:car-suv",
    "expense:paw-print-outline",
    "expense:briefcase",
    "expense:receipt-outline",
    "expense:plane",
    "expense:home",
    "expense:heart-handshake-outline",
    "income:wallet-outline",
    "income:briefcase",
    "income:trending-up-outline",
    "income:gift",
    "income:coins-outline",
    "income:cash-banknote",
    "income:building-bank-outline",
    "income:home-share-outline",
    "income:clock",
  ],
  // v0.0.12 and v0.0.13
  "v0.0.13": [
    "expense:tools-kitchen-2",
    "expense:basket",
    "expense:mug",
    "expense:school",
    "expense:shield",
    "expense:bus",
    "expense:gas-station",
    "expense:shopping-cart",
    "expense:ball-bowling",
    "expense:cloud",
    "expense:gift",
    "expense:home-dollar-outline",
    "expense:plug-outline",
    "expense:building-bank-outline",
    "expense:shield-check",
    "expense:paw",
    "expense:mood-happy",
    "expense:barbell",
    "expense:device-mobile",
    "expense:headset",
    "expense:cookie",
    "expense:pencil",
    "expense:hand-sanitizer-outline",
    "expense:plane",
    "expense:ping-pong-outline",
    "expense:perfume-outline",
    "expense:heart-handshake-outline",
    "income:wallet-outline",
    "income:trophy",
    "income:briefcase",
    "income:building-bank-outline",
    "income:trending-up-outline",
    "income:percentage-outline",
    "income:home-share-outline",
    "income:cash-banknote",
    "income:gift",
    "income:coins-outline",
    "income:clock",
    "income:receipt-refund-outline",
  ],
} as const

const toCategories = (pairs: readonly string[]) =>
  pairs.map((pair) => {
    const [type, icon] = pair.split(":")
    return { type, icon }
  })

const allPresets = (type: CategoryType): CategoryPreset[] => {
  const { core, packs } = getPresetGroups(type)
  return [...core, ...packs.flatMap((p) => p.presets)]
}

/** The presets the picker would still offer, by translation key suffix. */
const offered = (categories: { type: string; icon: string }[]) =>
  (["expense", "income"] as const).flatMap((type) =>
    allPresets(type)
      .filter((p) => !isPresetAdded(p, categories))
      .map((p) => p.name.split(".").slice(-2).join(".")),
  )

describe("category presets", () => {
  it("offers everything on a fresh install", () => {
    expect(offered([])).toHaveLength(40)
  })

  it("does not offer again what a v0.0.12-0.0.13 account already has", () => {
    // Only the presets that are new since then are left.
    expect(offered(toCategories(SHIPPED["v0.0.13"]))).toEqual([
      "expense.carMaintenance",
      "expense.parking",
    ])
  })

  it("does not offer again what a v0.0.11 account already has", () => {
    expect(offered(toCategories(SHIPPED["v0.0.11"]))).toEqual([
      "expense.subscriptions",
      "expense.gifts",
      "expense.parking",
      "expense.insurance",
      "expense.fitness",
      "expense.beauty",
      "expense.hygiene",
      "expense.drinks",
      "expense.snacks",
      "expense.gadgets",
      "expense.services",
      "expense.stationery",
      "expense.hobbies",
      "income.refunds",
      "income.interest",
    ])
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
      const icons = allPresets(type).flatMap((p) => [p.icon, ...p.oldIcons])
      expect(new Set(icons).size).toBe(icons.length)
    }
  })
})

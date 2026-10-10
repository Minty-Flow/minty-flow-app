import type { IconSvgName } from "~/components/icons"
import type { TranslationKey } from "~/i18n/config"
import type { CategoryType } from "~/types/categories"

export type CategoryPreset = {
  name: TranslationKey
  type: CategoryType
  icon: IconSvgName
  colorSchemeName: string
}

export type CategoryPresetPack = {
  id: string
  name: TranslationKey
  icon: IconSvgName
  presets: CategoryPreset[]
}

/**
 * A preset is identified by icon + type: that is how an already-created
 * category is recognised, so a retained preset must keep its icon.
 */
export const presetKey = (preset: CategoryPreset) =>
  `${preset.icon}:${preset.type}`

const expense = (key: string, icon: IconSvgName): CategoryPreset => ({
  name: `components.categories.presets.expense.${key}` as TranslationKey,
  type: "expense",
  icon,
  colorSchemeName: "",
})

const income = (key: string, icon: IconSvgName): CategoryPreset => ({
  name: `components.categories.presets.income.${key}` as TranslationKey,
  type: "income",
  icon,
  colorSchemeName: "",
})

/** The broad categories almost everyone needs. Pre-selected in onboarding. */
const CORE_PRESETS: CategoryPreset[] = [
  expense("groceries", "basket"),
  expense("dining", "pizza"),
  expense("transportation", "car"),
  expense("housing", "building-outline"),
  expense("utilities", "plug-outline"),
  expense("shopping", "shopping-cart"),
  expense("healthcare", "heart"),
  expense("entertainment", "headphones"),

  income("salary", "wallet-outline"),
  income("freelance", "briefcase"),
  income("investment", "trending-up-outline"),
  income("gift", "gift"),
  income("cashback", "coins-outline"),
]

/** Optional extras grouped by life situation. Each preset is in one pack. */
const PRESET_PACKS: CategoryPresetPack[] = [
  {
    id: "student",
    name: "components.categories.presets.packs.student",
    icon: "school",
    presets: [
      expense("education", "school"),
      income("allowance", "cash-banknote"),
    ],
  },
  {
    id: "family",
    name: "components.categories.presets.packs.family",
    icon: "users-outline",
    presets: [expense("kids", "baby-carriage"), expense("insurance", "shield")],
  },
  {
    id: "car",
    name: "components.categories.presets.packs.car",
    icon: "car",
    presets: [
      expense("fuel", "gas-station"),
      expense("carMaintenance", "car-suv"),
    ],
  },
  {
    id: "pets",
    name: "components.categories.presets.packs.pets",
    icon: "paw-print-outline",
    presets: [expense("pets", "paw-print-outline")],
  },
  {
    id: "selfEmployed",
    name: "components.categories.presets.packs.selfEmployed",
    icon: "briefcase",
    presets: [
      expense("businessExpenses", "briefcase"),
      expense("taxes", "receipt-outline"),
      income("business", "building-bank-outline"),
    ],
  },
  {
    id: "traveler",
    name: "components.categories.presets.packs.traveler",
    icon: "plane",
    presets: [expense("travel", "plane")],
  },
  {
    id: "landlord",
    name: "components.categories.presets.packs.landlord",
    icon: "home-share-outline",
    presets: [
      expense("homeMaintenance", "home"),
      income("rental", "home-share-outline"),
    ],
  },
  {
    id: "retired",
    name: "components.categories.presets.packs.retired",
    icon: "clock",
    presets: [income("pension", "clock")],
  },
  {
    id: "giving",
    name: "components.categories.presets.packs.giving",
    icon: "heart-handshake-outline",
    presets: [expense("charity", "heart-handshake-outline")],
  },
]

/** Core presets and the packs (with at least one preset) for one type. */
export function getPresetGroups(type: CategoryType): {
  core: CategoryPreset[]
  packs: CategoryPresetPack[]
} {
  return {
    core: CORE_PRESETS.filter((p) => p.type === type),
    packs: PRESET_PACKS.map((pack) => ({
      ...pack,
      presets: pack.presets.filter((p) => p.type === type),
    })).filter((pack) => pack.presets.length > 0),
  }
}

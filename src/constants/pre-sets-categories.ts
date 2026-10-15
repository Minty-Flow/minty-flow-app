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

/** The presets offered when adding categories; pre-selected in onboarding. */
const CORE_PRESETS: CategoryPreset[] = [
  expense("eatingOut", "tools-kitchen-2"),
  expense("groceries", "basket"),
  expense("drinks", "mug"),
  expense("education", "school"),
  expense("health", "shield"),
  expense("transport", "bus"),
  expense("gas", "gas-station"),
  expense("shopping", "shopping-cart"),
  expense("entertainment", "ball-bowling"),
  expense("subscriptions", "cloud"),
  expense("gifts", "gift"),
  expense("rent", "home-dollar-outline"),
  expense("utils", "plug-outline"),
  expense("taxes", "building-bank-outline"),
  expense("insurance", "shield-check"),
  expense("petCare", "paw"),
  expense("childCare", "mood-happy"),
  expense("fitness", "barbell"),
  expense("gadgets", "device-mobile"),
  expense("services", "headset"),
  expense("snacks", "cookie"),
  expense("stationery", "pencil"),
  expense("hygiene", "hand-sanitizer-outline"),
  expense("travel", "plane"),
  expense("hobbies", "ping-pong-outline"),
  expense("beauty", "perfume-outline"),

  income("paycheck", "wallet-outline"),
  income("bonus", "trophy"),
  income("freelance", "briefcase"),
  income("business", "building-bank-outline"),
  income("investments", "trending-up-outline"),
  income("interest", "percentage-outline"),
  income("rental", "home-share-outline"),
  income("allowance", "cash-banknote"),
  income("gifts", "gift"),
  income("cashback", "coins-outline"),
  income("pension", "clock"),
]

/** Optional extras grouped by life situation. Empty for now. */
const PRESET_PACKS: CategoryPresetPack[] = []

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

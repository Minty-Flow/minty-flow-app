import type { IconSvgName } from "~/components/icons"
import type { TranslationKey } from "~/i18n/config"
import type { CategoryType } from "~/types/categories"

export type CategoryPreset = {
  name: TranslationKey
  type: CategoryType
  icon: IconSvgName
  colorSchemeName: string
  /**
   * Icons this preset shipped with in earlier releases. A category using one
   * of them counts as this preset already added, so it is not offered twice.
   */
  oldIcons: readonly string[]
}

export type CategoryPresetPack = {
  id: string
  name: TranslationKey
  icon: IconSvgName
  presets: CategoryPreset[]
}

/** Identifies a preset in the picker's selection. */
export const presetKey = (preset: CategoryPreset) =>
  `${preset.icon}:${preset.type}`

/**
 * Whether the user already has this preset: a category of the same type
 * with its current icon or one it used to have. Names are not compared, since
 * users rename categories and names follow the app language.
 */
export function isPresetAdded(
  preset: CategoryPreset,
  categories: readonly { icon?: string | null; type: string }[],
): boolean {
  return categories.some(
    (c) =>
      c.type === preset.type &&
      !!c.icon &&
      (c.icon === preset.icon || preset.oldIcons.includes(c.icon)),
  )
}

const expense = (
  key: string,
  icon: IconSvgName,
  oldIcons: readonly string[] = [],
): CategoryPreset => ({
  name: `components.categories.presets.expense.${key}` as TranslationKey,
  type: "expense",
  icon,
  colorSchemeName: "",
  oldIcons,
})

const income = (
  key: string,
  icon: IconSvgName,
  oldIcons: readonly string[] = [],
): CategoryPreset => ({
  name: `components.categories.presets.income.${key}` as TranslationKey,
  type: "income",
  icon,
  colorSchemeName: "",
  oldIcons,
})

const pack = (
  id: string,
  icon: IconSvgName,
  presets: CategoryPreset[],
): CategoryPresetPack => ({
  id,
  name: `components.categories.presets.packs.${id}` as TranslationKey,
  icon,
  presets,
})

// Old icons come from the presets shipped in v0.0.11 and v0.0.12-0.0.13.
// `shield` was Insurance in v0.0.11 and Health since v0.0.12; it is matched
// to Health, the newer and more common meaning.

/** What nearly everyone spends and earns on; pre-selected in onboarding. */
const CORE_PRESETS: CategoryPreset[] = [
  expense("groceries", "basket"),
  expense("eatingOut", "tools-kitchen-3-outline", ["tools-kitchen-2", "pizza"]),
  expense("transport", "bus", ["car"]),
  expense("housing", "home-dollar-outline", ["building-outline"]),
  expense("utilities", "plug-outline"),
  expense("health", "first-aid-kit-outline", ["shield", "heart"]),
  expense("shopping", "shopping-cart"),
  expense("entertainment", "movie-outline", ["ball-bowling", "headphones"]),
  expense("subscriptions", "repeat-outline", ["cloud"]),
  expense("gifts", "gift"),

  income("salary", "wallet-outline"),
  income("gifts", "gift"),
  income("refunds", "receipt-refund-outline"),
  income("cashback", "coins-outline"),
]

/** Optional extras grouped by life situation; added from onboarding or Settings. */
const PRESET_PACKS: CategoryPresetPack[] = [
  pack("car", "car", [
    expense("fuel", "gas-station"),
    expense("carMaintenance", "tool-outline", ["car-suv"]),
    expense("parking", "parking-outline"),
  ]),
  pack("kids", "baby-carriage", [
    expense("childCare", "baby-carriage", ["mood-happy"]),
    expense("education", "school"),
  ]),
  pack("pets", "paw", [expense("petCare", "paw", ["paw-print-outline"])]),
  pack("homeBills", "home", [
    expense("insurance", "shield-check"),
    expense("taxes", "building-bank-outline", ["receipt-outline"]),
  ]),
  pack("selfCare", "sparkles", [
    expense("fitness", "barbell"),
    expense("beauty", "perfume-outline"),
    expense("hygiene", "hand-sanitizer-outline"),
  ]),
  pack("foodExtras", "mug", [
    expense("drinks", "mug"),
    expense("snacks", "cookie"),
  ]),
  pack("workTech", "device-mobile", [
    expense("gadgets", "device-mobile"),
    expense("services", "headset"),
    expense("stationery", "pencil"),
  ]),
  pack("lifestyle", "plane", [
    expense("travel", "plane"),
    expense("hobbies", "device-gamepad-2", ["ping-pong-outline"]),
    expense("donations", "heart-handshake-outline"),
  ]),

  pack("investing", "trending-up-outline", [
    income("investments", "trending-up-outline"),
    income("interest", "percentage-outline"),
    income("rental", "home-share-outline"),
  ]),
  pack("business", "briefcase", [
    income("business", "building-bank-outline"),
    income("freelance", "briefcase"),
  ]),
  pack("support", "heart-handshake-outline", [
    income("allowance", "cash-banknote"),
    income("pension", "clock"),
  ]),
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

import type { TranslationKey } from "~/i18n/config"
import type { Category } from "~/types/categories"

export type CategoryPreset = Omit<
  Category,
  "id" | "colorScheme" | "isArchived" | "name"
> & {
  name: TranslationKey // translation key
}

/**
 * Preset expense categories for quick setup.
 *
 * @remarks
 * These are default categories that users can use when setting up their account.
 */
export const ExpensePresets: CategoryPreset[] = [
  {
    name: "components.categories.presets.expense.groceries",
    type: "expense",
    icon: "basket-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.expense.transportation",
    type: "expense",
    icon: "car-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.expense.healthcare",
    type: "expense",
    icon: "heart-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.expense.education",
    type: "expense",
    icon: "school-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.expense.shopping",
    type: "expense",
    icon: "shopping-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

/**
 * Preset income categories for quick setup.
 *
 * @remarks
 * These are default categories that users can use when setting up their account.
 */
export const IncomePresets: CategoryPreset[] = [
  {
    name: "components.categories.presets.income.salary",
    type: "income",
    icon: "wallet",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.income.freelance",
    type: "income",
    icon: "briefcase-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.income.investment",
    type: "income",
    icon: "trending-up",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.income.business",
    type: "income",
    icon: "office-building-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "components.categories.presets.income.gift",
    type: "income",
    icon: "gift-outline",
    colorSchemeName: "",
    transactionCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

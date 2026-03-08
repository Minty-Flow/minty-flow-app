import type { Account } from "~/types/accounts"

import type AccountModel from "../models/account"

/**
 * Convert AccountModel to Account domain type
 */
export const modelToAccount = (model: AccountModel): Account => {
  return {
    id: model.id,
    name: model.name,
    type: model.type,
    icon: model.icon,
    colorSchemeName: model.colorSchemeName,
    colorScheme: model.colorScheme, // Computed getter from model
    balance: model.balance,
    currencyCode: model.currencyCode,
    excludeFromBalance: model.excludeFromBalance,
    isPrimary: model.isPrimary,
    isArchived: model.isArchived,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
    sortOrder: model.sortOrder,
  }
}

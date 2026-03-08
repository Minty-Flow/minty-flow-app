import type { Tag } from "~/types/tags"

import type TagModel from "../models/tag"

/**
 * Convert TagModel to Tag domain type
 */
export const modelToTag = (model: TagModel): Tag => {
  return {
    id: model.id,
    name: model.name,
    type: model.type,
    icon: model.icon,
    colorSchemeName: model.colorSchemeName,
    colorScheme: model.colorScheme,
    transactionCount: model.transactionCount,
    createdAt: model.createdAt,
    updatedAt: model.updatedAt,
  }
}

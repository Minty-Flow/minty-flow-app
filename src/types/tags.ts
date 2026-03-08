/**
 * Tag type definitions
 *
 * Pure domain types with no database dependencies.
 * These represent the business logic and UI contracts.
 * The WatermelonDB model implements these types, not the other way around.
 */

import type { MintyColorScheme } from "~/styles/theme"

/**
 * Tag domain type for UI/API usage.
 *
 * This is the single source of truth for the Tag shape.
 * The WatermelonDB model implements this interface, ensuring
 * the persistence layer conforms to the domain model.
 *
 * Icon can be:
 * - MaterialCommunityIcons name
 * - Single emoji
 * - Single letter
 * - (Future) Image URL or path
 */
export const TagKindEnum = {
  GENERIC: "generic",
  LOCATION: "location",
  CONTACT: "contact",
} as const

export type TagKindType = (typeof TagKindEnum)[keyof typeof TagKindEnum]

export interface Tag {
  id: string
  name: string
  type: TagKindType
  colorSchemeName: string | null
  colorScheme: MintyColorScheme | null // Computed from colorSchemeName via registry
  icon: string | null
  transactionCount: number
  createdAt: Date
  updatedAt: Date
}

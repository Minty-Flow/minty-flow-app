import type { MintyColorScheme } from "./types"

/**
 * Create a copy of a color scheme with overrides
 */
export const copyWith = (
  base: MintyColorScheme,
  overrides: Partial<MintyColorScheme>,
): MintyColorScheme => ({
  ...base,
  ...overrides,
  semantic: {
    ...base.semantic,
    ...(overrides.semantic || {}),
  },
})

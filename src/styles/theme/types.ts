// ============================================================================
// Minty Theming System - Type Definitions
// ============================================================================

/**
 * Custom colors (income, expense, semi + success/warning/info for compatibility)
 */
export interface MintyCustomColors {
  income: string // Green for income transactions (#32CC70 default)
  expense: string // Red for expense transactions (#FF4040 default)
  semi: string // Muted/secondary text labels (dark: #97919B, light: #6A666D)
  success: string // Green for success states
  warning: string // Orange/yellow for warning states
  info: string // Blue for info states
}

/**
 * Pure color tokens — every field is a color value or color-derived string.
 * Extended by MintyColorScheme which adds non-color metadata.
 */
export interface MintyThemeColors {
  surface: string // Page/screen background
  onSurface: string // Primary text, icons on surface
  primary: string // Accent (buttons, active states, highlights)
  onPrimary: string // Text/icons on primary
  secondary: string // Card backgrounds, nav bar, chip selected bg
  onSecondary: string // Text on secondary surfaces
  error: string // Error states (#FF4040 default)
  onError: string // Text on error (#F5F6FA default)
  customColors: MintyCustomColors
  rippleColor: string // Ripple/highlight = onSurface at 8.6%
  shadow: string // Shadow color
  boxShadow: string // Box shadow for web
}

/**
 * Core color scheme structure — raw source data for each theme.
 * Extends MintyThemeColors with non-color metadata used by the registry.
 */
export interface MintyColorScheme extends MintyThemeColors {
  name: string // Unique theme identifier
  iconName?: string // iOS app icon variant name
  isDark: boolean // Light/dark mode flag
  radius: number // Border radius (8px)
}

/**
 * Theme group structure for organizing related themes
 */
export interface ThemeGroup {
  name: string
  icon?: string
  schemes: MintyColorScheme[]
}

/**
 * Unistyles theme structure.
 * - colors: only color tokens (MintyThemeColors)
 * - non-color metadata (name, iconName, radius) lives at the top level alongside isDark
 */
export interface UnistylesTheme {
  colors: MintyThemeColors
  isDark: boolean
  name: string
  iconName?: string
  radius: number
}

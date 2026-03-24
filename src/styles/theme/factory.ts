// ============================================================================
// Minty Theming System - Theme Factory
// Builds Unistyles theme from MintyColorScheme with derived tokens
// ============================================================================

import type { MintyColorScheme, UnistylesTheme } from "./types"

/**
 * Append hex alpha to 6-char hex (0-255 scale, e.g. 0x16 = 8.6%)
 */
function hexWithAlpha(hex: string, alpha255: number): string {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return hex
  const a = Math.round(alpha255).toString(16).padStart(2, "0")
  return `#${clean}${a}`
}

/**
 * Theme factory for converting MintyColorScheme to Unistyles theme.
 * Separates pure color tokens (→ colors) from metadata (→ top level).
 */
export class ThemeFactory {
  mintyColorScheme: MintyColorScheme

  constructor(mintyColorScheme: MintyColorScheme) {
    this.mintyColorScheme = mintyColorScheme
  }

  /**
   * Build the colors object — only color tokens, no metadata.
   */
  get colors(): UnistylesTheme["colors"] {
    const s = this.mintyColorScheme

    const rippleColor = hexWithAlpha(s.onSurface, 0x16) // 8.6%

    return {
      // MintyThemeColors
      primary: s.primary,
      onPrimary: s.onPrimary,
      secondary: s.secondary,
      onSecondary: s.onSecondary,
      surface: s.surface,
      onSurface: s.onSurface,
      error: s.error,
      onError: s.onError,
      customColors: s.customColors,
      rippleColor,
      shadow: s.shadow,
      boxShadow: s.boxShadow,
    }
  }

  get isDark(): boolean {
    return this.mintyColorScheme.isDark
  }

  get name(): string {
    return this.mintyColorScheme.name
  }

  get iconName(): string | undefined {
    return this.mintyColorScheme.iconName
  }

  /**
   * Build complete Unistyles theme.
   * colors = color tokens only; metadata lives at the top level.
   */
  buildTheme(): UnistylesTheme {
    return {
      colors: this.colors,
      isDark: this.isDark,
      name: this.name,
      iconName: this.iconName,
      radius: this.mintyColorScheme.radius,
    }
  }
}

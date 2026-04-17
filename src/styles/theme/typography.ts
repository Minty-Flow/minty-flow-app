// ============================================================================
// Minty Theming System - Typography Tokens
// Material Design 3 scale — injected into UnistylesTheme as `theme.typography`
// ============================================================================

/**
 * Single style entry: fontSize + fontWeight
 */
export interface MintyTextStyle {
  fontSize: number
  fontWeight: "100" | "200" | "300" | "400" | "500" | "600" | "700"
}

/**
 * Minty typography scale
 * Font family: Poppins (primary), fallback: SF Pro Display → Helvetica → Roboto → sans-serif
 */
export interface MintyTypographyTokens {
  fontFamily: string
  fontFamilyFallback: string[]
  fontFamilyMono: string

  displayLarge: MintyTextStyle
  displayMedium: MintyTextStyle
  displaySmall: MintyTextStyle
  headlineLarge: MintyTextStyle
  headlineMedium: MintyTextStyle
  headlineSmall: MintyTextStyle
  titleLarge: MintyTextStyle
  titleMedium: MintyTextStyle
  titleSmall: MintyTextStyle
  bodyLarge: MintyTextStyle
  bodyMedium: MintyTextStyle
  bodySmall: MintyTextStyle
  labelLarge: MintyTextStyle
  labelMedium: MintyTextStyle
  labelSmall: MintyTextStyle
  labelXSmall: MintyTextStyle
}

export const typography: MintyTypographyTokens = {
  fontFamily: "Poppins",
  fontFamilyFallback: ["SF Pro Display", "Helvetica", "Roboto", "sans-serif"],
  fontFamilyMono: "monospace",

  // Display (hero / big numbers)
  displayLarge: { fontSize: 48, fontWeight: "600" },
  displayMedium: { fontSize: 40, fontWeight: "600" },
  displaySmall: { fontSize: 32, fontWeight: "600" },

  // Headlines (section titles)
  headlineLarge: { fontSize: 28, fontWeight: "700" },
  headlineMedium: { fontSize: 24, fontWeight: "700" },
  headlineSmall: { fontSize: 20, fontWeight: "700" },

  // Titles (cards, dialogs)
  titleLarge: { fontSize: 20, fontWeight: "600" },
  titleMedium: { fontSize: 18, fontWeight: "600" },
  titleSmall: { fontSize: 16, fontWeight: "600" },

  // Body (main readable text)
  bodyLarge: { fontSize: 16, fontWeight: "400" },
  bodyMedium: { fontSize: 14, fontWeight: "400" },
  bodySmall: { fontSize: 12, fontWeight: "400" },

  // Labels (UI, buttons, metadata)
  labelLarge: { fontSize: 14, fontWeight: "500" },
  labelMedium: { fontSize: 12, fontWeight: "500" },
  labelSmall: { fontSize: 11, fontWeight: "500" },
  labelXSmall: { fontSize: 10, fontWeight: "500" },
}

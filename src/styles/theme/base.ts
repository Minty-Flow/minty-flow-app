// ============================================================================
// Minty Theming System - Base Theme Definitions
// ============================================================================

import type { MintyColorScheme } from "./types"

/**
 * Minty Light base (Minty Light theme group default)
 * surface #F5F6FA, primary #8600A5 (shadeOfViolet), secondary #F5CCFF
 */
export const DEFAULT_LIGHT_BASE: MintyColorScheme = {
  name: "defaultLightBase",
  isDark: false,
  surface: "#F5F6FA",
  onSurface: "#111111",
  primary: "#8600A5",
  onPrimary: "#F5F6FA",
  secondary: "#F5CCFF",
  onSecondary: "#33004F",
  error: "#FF4040",
  onError: "#F5F6FA",
  customColors: {
    income: "#32CC70",
    expense: "#FF4040",
    semi: "#6A666D",
    success: "#32CC70",
    warning: "#FFA500",
    info: "#4A90E2",
  },
  rippleColor: "rgba(0, 0, 0, 0.086)",
  shadow: "rgba(0, 0, 0, 0.08)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  radius: 8,
}

/**
 * Minty Dark base (default dark mode)
 * surface #141414, secondary #050505 — distinct from OLED
 * primary #F2C0FF (electricLavender)
 */
export const DEFAULT_DARK_BASE: MintyColorScheme = {
  name: "defaultDarkBase",
  isDark: true,
  surface: "#141414",
  onSurface: "#F5F6FA",
  primary: "#F2C0FF",
  onPrimary: "#141414",
  secondary: "#050505",
  onSecondary: "#F5F6FA",
  error: "#FF4040",
  onError: "#F5F6FA",
  customColors: {
    income: "#32CC70",
    expense: "#FF4040",
    semi: "#97919B",
    success: "#32CC70",
    warning: "#FFA500",
    info: "#4A90E2",
  },
  rippleColor: "rgba(245, 246, 250, 0.086)",
  shadow: "rgba(0, 0, 0, 0.6)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  radius: 8,
}

/**
 * Minty OLED base — true black for OLED
 * surface #000000, secondary #101010
 */
export const DEFAULT_OLED_BASE: MintyColorScheme = {
  ...DEFAULT_DARK_BASE,
  name: "defaultOledBase",
  surface: "#000000",
  onPrimary: "#000000",
  secondary: "#101010",
  onSecondary: "#F5F6FA",
  customColors: {
    ...DEFAULT_DARK_BASE.customColors,
    semi: "#606060",
  },
  shadow: "rgba(0, 0, 0, 0.7)",
}

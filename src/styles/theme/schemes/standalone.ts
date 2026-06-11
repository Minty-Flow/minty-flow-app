// ============================================================================
// Minty Theming System - Standalone Theme Schemes
// Palenight & Monochrome
// ============================================================================

import type { MintyColorScheme } from "../types"

/**
 * Palenight — dark (Material Theme Palenight)
 * Exact from guide: surface #292D3E, primary #F5F6FA, onPrimary #444267
 */
export const palenight: MintyColorScheme = {
  name: "palenight",
  iconName: "palenight",
  isDark: true,
  surface: "#292D3E",
  onSurface: "#F5F6FA",
  primary: "#F5F6FA",
  onPrimary: "#444267",
  secondary: "#202331",
  onSecondary: "#F5F6FA",
  error: "#FF4040",
  onError: "#F5F6FA",
  customColors: {
    income: "#C3E88D",
    expense: "#F07178",
    semi: "#676E95",
    success: "#C3E88D",
    warning: "#FFCB6B",
    info: "#82AAFF",
  },
  rippleColor: "rgba(245, 246, 250, 0.086)",
  shadow: "rgba(0, 0, 0, 0.6)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  radius: 8,
}

/**
 * Monochrome — light (pure B&W style)
 * Exact from guide: surface #F7F8FA, onSurface #101828, primary #444444
 */
export const monochrome: MintyColorScheme = {
  name: "monochrome",
  iconName: "monochrome",
  isDark: false,
  surface: "#F7F8FA",
  onSurface: "#101828",
  primary: "#444444",
  onPrimary: "#F7F8FA",
  secondary: "#F1F2F4",
  onSecondary: "#101828",
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
 * Nord — kept for compatibility
 */
export const nord: MintyColorScheme = {
  name: "nord",
  iconName: "nord",
  isDark: true,
  surface: "#2e3440",
  onSurface: "#eceff4",
  primary: "#88c0d0",
  onPrimary: "#2e3440",
  secondary: "#3b4252",
  onSecondary: "#eceff4",
  error: "#bf616a",
  onError: "#f5f6fa",
  customColors: {
    income: "#a3be8c",
    expense: "#bf616a",
    semi: "#4c566a",
    success: "#a3be8c",
    warning: "#ebcb8b",
    info: "#81a1c1",
  },
  rippleColor: "rgba(255, 255, 255, 0.25)",
  shadow: "rgba(0, 0, 0, 0.6)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  radius: 8,
}

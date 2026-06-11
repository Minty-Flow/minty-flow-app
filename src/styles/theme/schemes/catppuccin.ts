// ============================================================================
// Minty Theming System - Catppuccin Theme Schemes
// Mocha, Macchiato, Frappé bases
// ============================================================================

import type { MintyColorScheme } from "../types"
import { copyWith } from "../utils"

/**
 * Catppuccin Mocha base (guide)
 * surface #1E1E2E, primary #F2CDCD (flamingo default)
 */
const CATPPUCCIN_MOCHA_BASE: MintyColorScheme = {
  name: "catppuccinMochaBase",
  isDark: true,
  surface: "#1E1E2E",
  onSurface: "#CDD6F4",
  primary: "#F2CDCD",
  onPrimary: "#11111B",
  secondary: "#11111B",
  onSecondary: "#CDD6F4",
  error: "#F38BA8",
  onError: "#F5F6FA",
  customColors: {
    income: "#A6E3A1",
    expense: "#F38BA8",
    semi: "#9399B2",
    success: "#A6E3A1",
    warning: "#FAB387",
    info: "#89B4FA",
  },
  rippleColor: "rgba(205, 214, 244, 0.086)",
  shadow: "rgba(0, 0, 0, 0.7)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.4)",
  radius: 8,
}

/**
 * Catppuccin Macchiato base (guide)
 * surface #24273A, primary #F0C6C6
 */
const CATPPUCCIN_MACCHIATO_BASE: MintyColorScheme = {
  name: "catppuccinMacchiatoBase",
  isDark: true,
  surface: "#24273A",
  onSurface: "#CAD3F5",
  primary: "#F0C6C6",
  onPrimary: "#181926",
  secondary: "#181926",
  onSecondary: "#CAD3F5",
  error: "#ED8796",
  onError: "#F5F6FA",
  customColors: {
    income: "#A6DA95",
    expense: "#ED8796",
    semi: "#5B6078",
    success: "#A6DA95",
    warning: "#F5A97F",
    info: "#8AADF4",
  },
  rippleColor: "rgba(202, 211, 245, 0.086)",
  shadow: "rgba(0, 0, 0, 0.6)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  radius: 8,
}

/**
 * Catppuccin Frappé base (guide)
 * surface #303446, primary #EEBEBE
 */
const CATPPUCCIN_FRAPPE_BASE: MintyColorScheme = {
  name: "catppuccinFrappeBase",
  isDark: true,
  surface: "#303446",
  onSurface: "#C6D0F5",
  primary: "#EEBEBE",
  onPrimary: "#232634",
  secondary: "#232634",
  onSecondary: "#C6D0F5",
  error: "#E78284",
  onError: "#F5F6FA",
  customColors: {
    income: "#A6D189",
    expense: "#E78284",
    semi: "#949CBB",
    success: "#A6D189",
    warning: "#EF9F76",
    info: "#8CAAEE",
  },
  rippleColor: "rgba(198, 208, 245, 0.086)",
  shadow: "rgba(0, 0, 0, 0.6)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
  radius: 8,
}

/**
 * Catppuccin Mocha color variants (guide: flamingo default, then rosewater, mauve, ...)
 */
export const catppuccinMochaSchemes: MintyColorScheme[] = [
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinFlamingoMocha",
    primary: "#F2CDCD",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinRosewaterMocha",
    primary: "#F5E0DC",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinMauveMocha",
    primary: "#CBA6F7",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinPinkMocha",
    primary: "#F5C2E7",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinRedMocha",
    primary: "#F38BA8",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinMaroonMocha",
    primary: "#EBA0AC",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinPeachMocha",
    primary: "#FAB387",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinYellowMocha",
    primary: "#F9E2AF",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinGreenMocha",
    primary: "#A6E3A1",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinTealMocha",
    primary: "#94E2D5",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinSkyMocha",
    primary: "#89DCEB",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinSapphireMocha",
    primary: "#74C7EC",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinBlueMocha",
    primary: "#89B4FA",
  }),
  copyWith(CATPPUCCIN_MOCHA_BASE, {
    name: "catppuccinLavenderMocha",
    primary: "#B4BEFE",
  }),
]

/**
 * Catppuccin Macchiato color variants
 */
export const catppuccinMacchiatoSchemes: MintyColorScheme[] = [
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinFlamingoMacchiato",
    primary: "#F0C6C6",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinRosewaterMacchiato",
    primary: "#F4DBD6",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinMauveMacchiato",
    primary: "#C6A0F6",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinPinkMacchiato",
    primary: "#F5BDE6",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinRedMacchiato",
    primary: "#ED8796",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinMaroonMacchiato",
    primary: "#EE99A0",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinPeachMacchiato",
    primary: "#F5A97F",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinYellowMacchiato",
    primary: "#EED49F",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinGreenMacchiato",
    primary: "#A6DA95",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinTealMacchiato",
    primary: "#8BD5CA",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinSkyMacchiato",
    primary: "#91D7E3",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinSapphireMacchiato",
    primary: "#7DC4E4",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinBlueMacchiato",
    primary: "#8AADF4",
  }),
  copyWith(CATPPUCCIN_MACCHIATO_BASE, {
    name: "catppuccinLavenderMacchiato",
    primary: "#B7BDF8",
  }),
]

/**
 * Catppuccin Frappé color variants
 */
export const catppuccinFrappeSchemes: MintyColorScheme[] = [
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinFlamingoFrappe",
    primary: "#EEBEBE",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinRosewaterFrappe",
    primary: "#F2D5CF",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinMauveFrappe",
    primary: "#CA9EE6",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinPinkFrappe",
    primary: "#F4B8E4",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinRedFrappe",
    primary: "#E78284",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinMaroonFrappe",
    primary: "#EA999C",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinPeachFrappe",
    primary: "#EF9F76",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinYellowFrappe",
    primary: "#E5C890",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinGreenFrappe",
    primary: "#A6D189",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinTealFrappe",
    primary: "#81C8BE",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinSkyFrappe",
    primary: "#99D1DB",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinSapphireFrappe",
    primary: "#85C1DC",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinBlueFrappe",
    primary: "#8CAAEE",
  }),
  copyWith(CATPPUCCIN_FRAPPE_BASE, {
    name: "catppuccinLavenderFrappe",
    primary: "#BABBF1",
  }),
]

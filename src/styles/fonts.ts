import { Platform } from "react-native"

/**
 * Minty app primary font: Poppins.
 * Load Poppins via expo-font; fallback to system sans if not loaded.
 */

// Cross-platform font family + weights
export const Fonts = Platform.select({
  ios: {
    sans: {
      thin: "System", // 100
      extraLight: "System", // 200
      light: "System", // 300
      regular: "System", // 400
      medium: "System", // 500-ish
      semibold: "System", // 600-ish
      bold: "System", // 700
    },
    /**
     * TODO: download Poppins font and use it here instead of the system font
     *  Minty theme primary (Poppins when loaded) */
    // minty: {
    //   thin: typography.fontFamily,
    //   extraLight: typography.fontFamily,
    //   light: typography.fontFamily,
    //   regular: typography.fontFamily,
    //   medium: typography.fontFamily,
    //   semibold: typography.fontFamily,
    //   bold: typography.fontFamily,
    // },
    mono: {
      thin: "monospace",
      extraLight: "monospace",
      light: "monospace",
      regular: "monospace",
      medium: "monospace",
      semibold: "monospace",
      bold: "monospace",
    },
  },
  default: {
    sans: {
      thin: "sans-serif",
      extraLight: "sans-serif",
      light: "sans-serif",
      regular: "sans-serif",
      medium: "sans-serif-medium", // Android supports this variant
      semibold: "sans-serif-medium",
      bold: "sans-serif-bold",
    },
    // minty: {
    //   thin: typography.fontFamily,
    //   extraLight: typography.fontFamily,
    //   light: typography.fontFamily,
    //   regular: typography.fontFamily,
    //   medium: typography.fontFamily,
    //   semibold: typography.fontFamily,
    //   bold: typography.fontFamily,
    // },
    mono: {
      thin: "monospace",
      extraLight: "monospace",
      light: "monospace",
      regular: "monospace",
      medium: "monospace",
      semibold: "monospace",
      bold: "monospace",
    },
  },
  web: {
    sans: {
      thin: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      extraLight:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      light:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      regular:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      medium:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      semibold:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      bold: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    // minty: {
    //   thin: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    //   extraLight: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    //   light: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    //   regular: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    //   medium: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    //   semibold: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    //   bold: `Poppins, "SF Pro Display", Helvetica, Roboto, sans-serif`,
    // },
    mono: {
      thin: "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      extraLight:
        "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      light:
        "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      regular:
        "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      medium:
        "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      semibold:
        "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      bold: "SFMono-Regular, monospace, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  },
})

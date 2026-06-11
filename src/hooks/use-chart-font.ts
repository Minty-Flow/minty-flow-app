import { matchFont } from "@shopify/react-native-skia"

import { Fonts } from "~/styles/fonts"
import { typography } from "~/styles/theme/typography"

let chartFont: ReturnType<typeof matchFont> | null = null

export function useChartFont() {
  if (!chartFont) {
    chartFont = matchFont({
      fontFamily: Fonts.sans.regular,
      fontSize: typography.labelSmall.fontSize,
      fontWeight: typography.labelSmall.fontWeight,
      fontStyle: "normal",
    })
  }
  return chartFont
}

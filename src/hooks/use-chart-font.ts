import { matchFont } from "@shopify/react-native-skia"

import { Fonts } from "~/styles/fonts"

let chartFont: ReturnType<typeof matchFont> | null = null

export function useChartFont() {
  if (!chartFont) {
    chartFont = matchFont({
      fontFamily: Fonts.sans.regular,
      fontSize: 11,
      fontStyle: "normal",
      fontWeight: "400",
    })
  }
  return chartFont
}

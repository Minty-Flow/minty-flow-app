import type { ReactNode } from "react"

import { View } from "~/components/ui/view"

import { footerBarStyles } from "./footer-bar.styles"

/**
 * The pinned action row at the bottom of a screen (Cancel / Save). Give its
 * buttons `size="lg"` and `footerBarStyles.button`, so they share the width
 * evenly. Wrap it in `KeyboardStickyFooter` on screens with text inputs.
 */
export function FooterBar({ children }: { children: ReactNode }) {
  return <View style={footerBarStyles.bar}>{children}</View>
}

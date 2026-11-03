import type { ReactNode } from "react"

import { KeyboardStickyViewMinty } from "~/components/keyboard-sticky-view-minty"
import { View } from "~/components/ui/view"

interface KeyboardStickyFooterProps {
  children: ReactNode
  /**
   * Reports the footer's height. Hand it to `ScrollIntoViewProvider` as
   * `keyboardInset` so the footer never covers the focused field.
   */
  onHeightChange?: (height: number) => void
}

/** A footer that rides on top of the keyboard, so its actions stay reachable. */
export function KeyboardStickyFooter({
  children,
  onHeightChange,
}: KeyboardStickyFooterProps) {
  return (
    <KeyboardStickyViewMinty>
      <View onLayout={(e) => onHeightChange?.(e.nativeEvent.layout.height)}>
        {children}
      </View>
    </KeyboardStickyViewMinty>
  )
}

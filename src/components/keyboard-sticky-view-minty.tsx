import type { ReactNode } from "react"
import { useMemo } from "react"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const KeyboardStickyViewMinty = ({
  children,
}: {
  children?: ReactNode | undefined
}) => {
  const insets = useSafeAreaInsets()

  const offset = useMemo(() => {
    // Root layout uses paddingBottom: insets.bottom, so our "closed" position
    // is already above the nav bar — use 0 so we don't double-apply or fight it.
    // When keyboard is open, the library positions above the keyboard but the
    // same root padding creates a gap; add insets.bottom so we sit flush.
    return {
      closed: 0,
      opened: insets.bottom,
    }
  }, [insets.bottom])

  return <KeyboardStickyView offset={offset}>{children}</KeyboardStickyView>
}

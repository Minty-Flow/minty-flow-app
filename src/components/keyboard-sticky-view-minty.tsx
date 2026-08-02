import type { ReactNode } from "react"
import { KeyboardStickyView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"
export const KeyboardStickyViewMinty = ({
  children,
}: {
  children?: ReactNode | undefined
}) => {
  const insets = useSafeAreaInsets()
  const offset = {
    closed: 0,
    opened: insets.bottom,
  }
  return <KeyboardStickyView offset={offset}>{children}</KeyboardStickyView>
}

import {
  type BottomSheetMethods,
  BottomSheet as NativeBottomSheet,
} from "@expo/ui/community/bottom-sheet"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { ScrollView, useWindowDimensions, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useUnistyles } from "react-native-unistyles"

type Padding = number | { horizontal?: number; top?: number; bottom?: number }

interface BottomSheetProps {
  isPresented: boolean
  onDismiss: () => void
  /**
   * Fires once the sheet has finished closing (after the exit animation on iOS).
   * Run navigation or other work that would tear the sheet down here.
   */
  onDismissed?: () => void
  children: ReactNode
  /** Gorhom-style, e.g. ["50%", "90%"]. Omit to size to content. */
  snapPoints?: (string | number)[]
  showDragIndicator?: boolean
  /** Inset around children. Number = all sides; 0 for full-bleed content. */
  contentPadding?: Padding
  /** false blocks swipe-down, back press and scrim tap (e.g. while saving). */
  dismissable?: boolean
  /**
   * Default true: content sizes to its height, then scrolls. Set false for
   * sheets that own a virtualized list (FlatList). Give the list a bounded height:
   * either `snapPoints` + `flex: 1` content, or (no snapPoints, the only way to
   * get an exact height on Android) a content wrapper with an explicit `height`.
   */
  scrollable?: boolean
  /**
   * Fixed sheet height as a fraction of the window (e.g. 0.75), the standard
   * for sheets that replaced full-screen modals. Native Android sheets only
   * snap half/full, so the height lives on the content. Implies
   * `scrollable={false}`: children fill the height (`flex: 1`) and own any
   * scrolling (ScrollView / FlatList).
   */
  heightFraction?: number
}

function resolvePadding(p: Padding = {}) {
  if (typeof p === "number") {
    return { paddingHorizontal: p, paddingTop: p, paddingBottom: p }
  }
  return {
    paddingHorizontal: p.horizontal ?? 16,
    paddingTop: p.top ?? 0,
    paddingBottom: p.bottom ?? 16,
  }
}

/** Room kept for the drag handle and a little air under the status bar. */
const SHEET_CHROME = 48

/**
 * Project-wide native bottom sheet: Material ModalBottomSheet on Android, SwiftUI
 * sheet on iOS (via `@expo/ui/community/bottom-sheet`, which hosts React Native
 * children correctly — the universal `BottomSheet` does not). Controlled: set
 * `isPresented` false in `onDismiss`. Height follows content up to the screen,
 * then scrolls — callers must not add their own outer ScrollView.
 *
 * Closing goes through the sheet's own `close()` (animated hide) rather than
 * `index={-1}`: on Android `index={-1}` unmounts the content at once while the
 * native sheet is still sliding out, leaving an empty sheet. The sheet stays at
 * index 0 until the native `onDismiss` fires, and the last presented children
 * stay on screen until then, so callers can clear the state behind the content
 * without the sheet emptying mid-animation.
 */
export function BottomSheet({
  isPresented,
  onDismiss,
  onDismissed,
  children,
  snapPoints,
  showDragIndicator = true,
  contentPadding,
  dismissable = true,
  scrollable = true,
  heightFraction,
}: BottomSheetProps) {
  const { theme } = useUnistyles()
  const { height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  // The sheet sizes to its content; once that exceeds the screen the content
  // scrolls inside this cap instead of the sheet growing off-screen.
  const maxHeight = height - insets.top - insets.bottom - SHEET_CHROME
  const sheetRef = useRef<BottomSheetMethods>(null)
  const retainedChildren = useRef<ReactNode>(children)
  if (isPresented) retainedChildren.current = children
  const content = isPresented ? children : retainedChildren.current
  // Open from the first presentation until the native dismiss completes.
  const [open, setOpen] = useState(isPresented)
  if (isPresented && !open) setOpen(true)
  useEffect(() => {
    if (!isPresented) sheetRef.current?.close()
  }, [isPresented])
  const handleDismiss = () => {
    setOpen(false)
    retainedChildren.current = null
    onDismiss()
    onDismissed?.()
  }

  return (
    <NativeBottomSheet
      ref={sheetRef}
      index={open ? 0 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={dismissable}
      handleComponent={showDragIndicator ? undefined : null}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      onDismiss={handleDismiss}
    >
      {heightFraction ? (
        <View
          style={[
            { height: height * heightFraction },
            resolvePadding(contentPadding),
          ]}
        >
          {content}
        </View>
      ) : scrollable ? (
        <ScrollView
          style={{ maxHeight }}
          contentContainerStyle={resolvePadding(contentPadding)}
          bounces={false}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View
          style={[
            snapPoints ? { flex: 1 } : null,
            resolvePadding(contentPadding),
          ]}
        >
          {content}
        </View>
      )}
    </NativeBottomSheet>
  )
}

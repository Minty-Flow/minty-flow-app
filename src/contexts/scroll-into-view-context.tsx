import { createContext, type ReactNode, useContext, useRef } from "react"
import {
  View as RNView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller"

/** Gap kept between the focused field and the keyboard. */
const KEYBOARD_BOTTOM_OFFSET = 24

interface ScrollIntoViewContextValue {
  scrollRef: React.RefObject<KeyboardAwareScrollViewRef | null>
  scrollContainerRef: React.RefObject<RNView | null>
  scrollYRef: React.RefObject<number>
}

const ScrollIntoViewContext = createContext<ScrollIntoViewContextValue | null>(
  null,
)

interface ScrollIntoViewProviderProps {
  children: ReactNode
  /** Optional style for the ScrollView. */
  scrollViewStyle?: StyleProp<ViewStyle>
  /** Optional contentContainerStyle for the ScrollView. */
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"]
  /** Optional other ScrollView props (keyboardShouldPersistTaps, etc.). */
  scrollViewProps?: Omit<
    ScrollViewProps,
    | "ref"
    | "onScroll"
    | "scrollEventThrottle"
    | "style"
    | "contentContainerStyle"
    | "children"
  >
}

export function ScrollIntoViewProvider({
  children,
  scrollViewStyle,
  contentContainerStyle,
  scrollViewProps,
}: ScrollIntoViewProviderProps) {
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null)
  const scrollContainerRef = useRef<RNView>(null)
  const scrollYRef = useRef(0)

  return (
    <ScrollIntoViewContext.Provider
      value={{ scrollRef, scrollContainerRef, scrollYRef }}
    >
      <RNView ref={scrollContainerRef} style={{ flex: 1 }}>
        {/* Scrolls the focused field above the keyboard and pads the bottom
            while it is open, so the lower half of a form stays reachable. */}
        <KeyboardAwareScrollView
          ref={scrollRef}
          bottomOffset={KEYBOARD_BOTTOM_OFFSET}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y
          }}
          scrollEventThrottle={16}
          style={scrollViewStyle}
          contentContainerStyle={contentContainerStyle}
          {...scrollViewProps}
        >
          {children}
        </KeyboardAwareScrollView>
      </RNView>
    </ScrollIntoViewContext.Provider>
  )
}

export function useScrollIntoViewContext() {
  return useContext(ScrollIntoViewContext)
}

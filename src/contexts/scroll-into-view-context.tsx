import { createContext, type ReactNode, useContext, useRef } from "react"
import {
  View as RNView,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from "react-native"

interface ScrollIntoViewContextValue {
  scrollRef: React.RefObject<ScrollView | null>
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
  const scrollRef = useRef<ScrollView>(null)
  const scrollContainerRef = useRef<RNView>(null)
  const scrollYRef = useRef(0)

  return (
    <ScrollIntoViewContext.Provider
      value={{ scrollRef, scrollContainerRef, scrollYRef }}
    >
      <RNView ref={scrollContainerRef} style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y
          }}
          scrollEventThrottle={16}
          style={scrollViewStyle}
          contentContainerStyle={contentContainerStyle}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </RNView>
    </ScrollIntoViewContext.Provider>
  )
}

export function useScrollIntoViewContext() {
  return useContext(ScrollIntoViewContext)
}

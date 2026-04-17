import * as Haptics from "expo-haptics"
import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Platform,
  type PressableProps,
  View as RNView,
  useWindowDimensions,
} from "react-native"
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"
import { scheduleOnUI } from "react-native-worklets"

import { useLanguageStore } from "~/stores/language.store"
import { logger } from "~/utils/logger"

import { Text } from "./text"

type ExitPositionType = "top" | "bottom"

type TooltipData = {
  text: string
  x: number
  y: number
  width: number
  height: number
  position?: ExitPositionType
}

type TooltipContextType = {
  showTooltip: (data: TooltipData) => void
  hideTooltip: () => void
}

const TooltipContext = createContext<TooltipContextType | null>(null)

const TOOLTIP_BOTTOM_SPACING = 30
const TOOLTIP_TOP_SPACING = 10
const SCREEN_EDGE_PADDING = 12

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  const { width: screenWidth } = useWindowDimensions()
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [tooltipWidth, setTooltipWidth] = useState(0)
  const isRTL = useLanguageStore((s) => s.isRTL)
  // Track the position for exit animation - only updates when tooltip is visible
  const exitPositionRef = useRef<ExitPositionType>("top")
  const exitPosition = useSharedValue<ExitPositionType>("top")

  // Track exit position for animation; update ref and shared value when tooltip changes
  useEffect(() => {
    const currentPosition = tooltip?.position || "top"
    if (tooltip && currentPosition !== exitPositionRef.current) {
      exitPositionRef.current = currentPosition
      scheduleOnUI(() => {
        "worklet"
        exitPosition.value = currentPosition
      })
    }
  }, [tooltip, exitPosition])

  // Memoize position calculation
  const position = useMemo(() => {
    if (!tooltip || tooltipWidth === 0)
      return { top: 0, left: 0, translateX: 0 }

    const tooltipPosition = tooltip.position || "top"

    // Logical start anchor
    const anchorX = isRTL
      ? tooltip.x + tooltip.width // right edge in RTL
      : tooltip.x // left edge in LTR

    const left = anchorX
    let translateX = isRTL ? -tooltipWidth : 0

    // Physical clamping (screen coordinates never change)
    const physicalLeft = left + translateX
    const physicalRight = physicalLeft + tooltipWidth

    if (physicalLeft < SCREEN_EDGE_PADDING) {
      translateX += SCREEN_EDGE_PADDING - physicalLeft
    }

    if (physicalRight > screenWidth - SCREEN_EDGE_PADDING) {
      translateX -= physicalRight - (screenWidth - SCREEN_EDGE_PADDING)
    }

    const top =
      tooltipPosition === "bottom"
        ? tooltip.y + tooltip.height + TOOLTIP_BOTTOM_SPACING
        : tooltip.y - TOOLTIP_TOP_SPACING

    return {
      top,
      left,
      translateX,
    }
  }, [tooltip, tooltipWidth, screenWidth, isRTL])

  // Extract tooltip position for use in worklets
  const tooltipPosition = tooltip?.position || "top"

  // Derive animated values based on tooltip state
  const isVisible = useDerivedValue(() => {
    return tooltip !== null && tooltipWidth > 0
  }, [tooltip, tooltipWidth])

  const animatedOpacity = useDerivedValue(() => {
    return withTiming(isVisible.value ? 1 : 0, { duration: 150 })
  }, [isVisible])

  const animatedTranslateY = useDerivedValue(() => {
    // Use current position when visible, stored exit position when hidden
    const position = isVisible.value ? tooltipPosition : exitPosition.value

    if (!isVisible.value) {
      // Exit animation
      const exitOffset =
        position === "bottom" ? -TOOLTIP_BOTTOM_SPACING : TOOLTIP_TOP_SPACING
      return withTiming(exitOffset, { duration: 150 })
    }
    // Enter animation: from offset to 0
    return withTiming(0, { duration: 150 })
  }, [isVisible, tooltipPosition, exitPosition])

  const animatedTranslateX = useDerivedValue(() => {
    return position.translateX
  }, [position.translateX])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
    transform: [
      { translateX: animatedTranslateX.value },
      { translateY: animatedTranslateY.value },
    ],
  }))

  const showTooltip = useCallback((data: TooltipData) => {
    setTooltip(data)
  }, [])

  const hideTooltip = useCallback(() => {
    setTooltip(null)
  }, [])

  const styles = StyleSheet.create((t) => ({
    tooltip: {
      position: "absolute",
      backgroundColor: t.colors.secondary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: t.radius,
      shadowColor: t.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      maxWidth: 200,
      zIndex: 10000,
    },
    tooltipText: {
      color: t.colors.onSecondary,
      fontSize: t.typography.labelMedium.fontSize,
      textAlign: "center",
    },
  }))

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip && (
        <RNView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          collapsable={false}
          accessible={false}
        >
          <Animated.View
            onLayout={(e) => {
              const { width } = e.nativeEvent.layout
              if (width > 0 && width !== tooltipWidth) {
                setTooltipWidth(width)
              }
            }}
            style={[
              styles.tooltip,
              {
                top: position.top,
                left: position.left,
              },
              animatedStyle,
            ]}
            pointerEvents="none"
          >
            <Text style={styles.tooltipText}>{tooltip.text}</Text>
          </Animated.View>
        </RNView>
      )}
    </TooltipContext.Provider>
  )
}

type TooltipProps = {
  text: string
  children: ReactElement<PressableProps>
  delayLongPress?: number
  hapticFeedback?: boolean
  position?: ExitPositionType
}

type PressEvent = Parameters<NonNullable<PressableProps["onLongPress"]>>[0]

export const Tooltip = ({
  text,
  children,
  delayLongPress = 350,
  hapticFeedback = true,
  position = "top",
}: TooltipProps) => {
  const context = useContext(TooltipContext)
  const pressableRef = useRef<RNView>(null)

  const handleLongPress = useCallback(() => {
    if (!pressableRef.current || !context) return

    pressableRef.current.measureInWindow((x, y, width, height) => {
      context.showTooltip({ text, x, y, width, height, position })

      if (hapticFeedback && Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    })
  }, [text, context, hapticFeedback, position])

  const handlePressOut = useCallback(() => {
    if (!context) return
    context.hideTooltip()
  }, [context])

  if (!context) {
    logger.warn("Tooltip must be used within TooltipProvider")
    return children
  }

  const childRef = (children as { ref?: Ref<RNView> })?.ref

  const childWithHandlers = cloneElement(children, {
    ...children.props,
    onLongPress: (e: PressEvent) => {
      handleLongPress()
      children.props.onLongPress?.(e)
    },
    onPressOut: (e: PressEvent) => {
      handlePressOut()
      children.props.onPressOut?.(e)
    },
    delayLongPress,
    ref: (node: RNView | null) => {
      pressableRef.current = node
      if (childRef) {
        if (typeof childRef === "function") {
          childRef(node)
        } else if (
          childRef &&
          typeof childRef === "object" &&
          "current" in childRef
        ) {
          ;(childRef as { current: RNView | null }).current = node
        }
      }
    },
  } as Partial<PressableProps>)

  return childWithHandlers
}

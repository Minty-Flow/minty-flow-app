import * as Haptics from "expo-haptics"
import { type RefObject, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useWindowDimensions } from "react-native"
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler"
import Animated, {
  Easing,
  interpolateColor,
  ReduceMotion,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { scheduleOnRN } from "react-native-worklets"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { InfoBanner } from "~/components/ui/info-banner"
import { View } from "~/components/ui/view"
import { FAB_BUTTON_SIZE, FAB_BUTTON_STYLE } from "~/constants/fab-button"
import {
  type ButtonPlacementOrder,
  type FabButtonType,
  useButtonPlacementStore,
} from "~/stores/button-placement.store"

const BUTTON_SIZE = FAB_BUTTON_SIZE
const CONTAINER_HEIGHT = 230
type SlotPos = {
  id: string
  x: number
  y: number
}
// Slot 0 = center/top, Slot 1 = right, Slot 2 = left
// These match FAB_OPTION_POSITIONS indices in _layout.tsx
function getSlotPositions(containerWidth: number): SlotPos[] {
  const cx = (containerWidth - BUTTON_SIZE) / 2
  const sideX = Math.round(containerWidth * 0.14)
  return [
    { id: "center", x: cx, y: 14 },
    { id: "right", x: containerWidth - sideX - BUTTON_SIZE, y: 114 },
    { id: "left", x: sideX, y: 114 },
  ]
}
interface ButtonConfig {
  icon: IconSvgName
  color: string
  iconColor: string
}
/** Settling into a slot: short and ease-out, no bounce. Honors Reduce Motion. */
const SETTLE = {
  duration: 180,
  easing: Easing.out(Easing.cubic),
  reduceMotion: ReduceMotion.System,
}
const PRESS = { duration: 120, reduceMotion: ReduceMotion.System }
const HIGHLIGHT = { duration: 120, reduceMotion: ReduceMotion.System }

type Tick = "pickup" | "select" | "drop"

function tick(kind: Tick) {
  if (kind === "select") {
    void Haptics.selectionAsync()
  } else {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }
}

/** How much closer another slot must be before the hover moves to it (dp). */
const HOVER_HYSTERESIS = 14

/**
 * Slot whose centre is closest to a button at (x, y). `current` is the slot
 * already hovered (or -1): it is kept until another slot is clearly closer, so
 * a finger resting between two slots does not make the buttons flicker.
 */
function nearestSlotIndex(
  x: number,
  y: number,
  slots: SlotPos[],
  current: number,
): number {
  "worklet"
  let nearest = 0
  let minDist = Number.POSITIVE_INFINITY
  let currentDist = Number.POSITIVE_INFINITY
  for (let i = 0; i < slots.length; i++) {
    const dx = x - slots[i].x
    const dy = y - slots[i].y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < minDist) {
      minDist = dist
      nearest = i
    }
    if (i === current) currentDist = dist
  }
  if (
    current >= 0 &&
    nearest !== current &&
    minDist > currentDist - HOVER_HYSTERESIS
  ) {
    return current
  }
  return nearest
}

function SlotPlaceholder({
  pos,
  index,
  nearestSlot,
}: {
  pos: SlotPos
  index: number
  /** Slot under the dragged button, or -1 when nothing is being dragged. */
  nearestSlot: SharedValue<number>
}) {
  const { theme } = useUnistyles()
  const idle = theme.colors.semantic.semi
  const active = theme.colors.primary
  const progress = useDerivedValue(() =>
    withTiming(nearestSlot.value === index ? 1 : 0, HIGHLIGHT),
  )
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], [idle, active]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [`${active}00`, `${active}1F`],
    ),
    opacity: 0.5 + progress.value * 0.5,
  }))
  return (
    <Animated.View
      style={[
        styles.slotPlaceholder,
        { position: "absolute", left: pos.x - 6, top: pos.y - 6 },
        animatedStyle,
      ]}
    />
  )
}

function DraggableButton({
  config,
  buttonType,
  slotIndex,
  slotPositions,
  scrollRef,
  dragged,
  dragFrom,
  nearestSlot,
  onSwap,
}: {
  config: ButtonConfig
  buttonType: FabButtonType
  slotIndex: number
  slotPositions: SlotPos[]
  /** The page's scroll view: a drag on a button must win over scrolling it. */
  scrollRef: RefObject<ScrollView | null>
  /** The button being dragged ("" when none), the slot it left, and the slot it hovers. */
  dragged: SharedValue<string>
  dragFrom: SharedValue<number>
  nearestSlot: SharedValue<number>
  onSwap: (from: number, to: number) => void
}) {
  const slotPos = slotPositions[slotIndex]
  const x = useSharedValue(slotPos.x)
  const y = useSharedValue(slotPos.y)
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const scale = useSharedValue(1)

  // Glide to the slot whenever it changes: after a drop, or a layout change.
  useEffect(() => {
    x.value = withTiming(slotPos.x, SETTLE)
    y.value = withTiming(slotPos.y, SETTLE)
  }, [slotPos.x, slotPos.y, x, y])

  // While another button is dragged over this one's slot, make room: move into
  // the slot that button left. The dragged button itself follows the finger.
  useAnimatedReaction(
    () => {
      if (dragged.value === buttonType) return -1
      if (dragged.value === "") return slotIndex
      return nearestSlot.value === slotIndex && dragFrom.value !== slotIndex
        ? dragFrom.value
        : slotIndex
    },
    (target, previous) => {
      if (target === -1 || target === previous) return
      x.value = withTiming(slotPositions[target].x, SETTLE)
      y.value = withTiming(slotPositions[target].y, SETTLE)
    },
    [slotIndex, slotPositions],
  )

  const pan = Gesture.Pan()
    .blocksExternalGesture(scrollRef)
    .onStart(() => {
      "worklet"
      startX.value = x.value
      startY.value = y.value
      dragged.value = buttonType
      dragFrom.value = slotIndex
      nearestSlot.value = slotIndex
      scale.value = withTiming(1.08, PRESS)
      scheduleOnRN(tick, "pickup")
    })
    .onUpdate((e) => {
      "worklet"
      x.value = startX.value + e.translationX
      y.value = startY.value + e.translationY
      const near = nearestSlotIndex(
        x.value,
        y.value,
        slotPositions,
        nearestSlot.value,
      )
      if (near !== nearestSlot.value) {
        nearestSlot.value = near
        scheduleOnRN(tick, "select")
      }
    })
    .onEnd(() => {
      "worklet"
      const target = nearestSlot.value
      scale.value = withTiming(1, PRESS)
      scheduleOnRN(tick, "drop")
      if (target !== slotIndex) {
        // The other button is already in place; this one glides to its new slot
        // once the swap re-renders, and the screen then clears the drag state.
        scheduleOnRN(onSwap, slotIndex, target)
      } else {
        x.value = withTiming(slotPos.x, SETTLE)
        y.value = withTiming(slotPos.y, SETTLE)
        dragged.value = ""
        dragFrom.value = -1
        nearestSlot.value = -1
      }
    })
    .onFinalize((_e, success) => {
      "worklet"
      // Only a cancelled drag (no onEnd) needs undoing here.
      if (success || dragged.value !== buttonType) return
      dragged.value = ""
      dragFrom.value = -1
      nearestSlot.value = -1
      scale.value = withTiming(1, PRESS)
      x.value = withTiming(slotPos.x, SETTLE)
      y.value = withTiming(slotPos.y, SETTLE)
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    zIndex: dragged.value === buttonType ? 100 : 2,
    elevation: dragged.value === buttonType ? 12 : 3,
  }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.button,
          {
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: config.color,
          },
          animatedStyle,
        ]}
      >
        <IconSvg name={config.icon} size={24} color={config.iconColor} />
      </Animated.View>
    </GestureDetector>
  )
}

export default function ButtonPlacementScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const { width } = useWindowDimensions()
  const order = useButtonPlacementStore((s) => s.order)
  const setOrder = useButtonPlacementStore((s) => s.setOrder)
  const containerWidth = width - 48
  const slotPositions = getSlotPositions(containerWidth)
  const buttonConfigs: Record<FabButtonType, ButtonConfig> = {
    income: {
      icon: "chevrons-down-outline",
      color: theme.colors.semantic.income,
      iconColor: theme.colors.onError,
    },
    expense: {
      icon: "chevrons-up-outline",
      color: theme.colors.semantic.expense,
      iconColor: theme.colors.onError,
    },
    transfer: {
      icon: "arrows-right-left-outline",
      color: theme.colors.secondary,
      iconColor: theme.colors.onSecondary,
    },
  }
  const scrollRef = useRef<ScrollView>(null)
  const dragged = useSharedValue("")
  const dragFrom = useSharedValue(-1)
  const nearestSlot = useSharedValue(-1)
  // A swap re-rendered the buttons into their new slots: the drag is over.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when the order changes
  useEffect(() => {
    dragged.value = ""
    dragFrom.value = -1
    nearestSlot.value = -1
  }, [order, dragged, dragFrom, nearestSlot])
  const handleSwap = (from: number, to: number) => {
    const newOrder = [...order] as ButtonPlacementOrder
    const temp = newOrder[from]
    newOrder[from] = newOrder[to]
    newOrder[to] = temp
    setOrder(newOrder)
  }
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* Top info */}
      <InfoBanner
        text={t(
          "screens.settings.preferences.appearance.buttonPlacement.subtitle",
        )}
      />

      {/* Drag area */}
      <View
        style={[
          styles.dragArea,
          { width: containerWidth, height: CONTAINER_HEIGHT },
        ]}
      >
        {/* Dashed slot placeholders behind buttons */}
        {slotPositions.map((pos, index) => (
          <SlotPlaceholder
            key={pos.id}
            pos={pos}
            index={index}
            nearestSlot={nearestSlot}
          />
        ))}

        {/* Draggable buttons */}
        {order.map((buttonType, slotIndex) => (
          <DraggableButton
            key={buttonType}
            config={buttonConfigs[buttonType]}
            buttonType={buttonType}
            slotIndex={slotIndex}
            slotPositions={slotPositions}
            scrollRef={scrollRef}
            dragged={dragged}
            dragFrom={dragFrom}
            nearestSlot={nearestSlot}
            onSwap={handleSwap}
          />
        ))}
      </View>

      {/* Footer info */}
      <InfoBanner
        text={t("screens.settings.preferences.appearance.buttonPlacement.info")}
      />
    </ScrollView>
  )
}
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 48,
    alignItems: "center",
    gap: 28,
  },
  dragArea: {
    position: "relative",
  },
  slotPlaceholder: {
    width: BUTTON_SIZE + 12,
    height: BUTTON_SIZE + 12,
    borderRadius: (BUTTON_SIZE + 12) / 2,
    borderWidth: 2,
    borderStyle: "dashed",
    opacity: 0.5,
  },
  button: {
    ...FAB_BUTTON_STYLE,
    shadowColor: theme.colors.shadow,
  },
}))

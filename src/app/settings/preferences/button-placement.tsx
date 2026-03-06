import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView, useWindowDimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { scheduleOnRN } from "react-native-worklets"

import { IconSymbol, type IconSymbolName } from "~/components/ui/icon-symbol"
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

type SlotPos = { x: number; y: number }

// Slot 0 = center/top, Slot 1 = right, Slot 2 = left
// These match FAB_OPTION_POSITIONS indices in _layout.tsx
function getSlotPositions(containerWidth: number): SlotPos[] {
  const cx = (containerWidth - BUTTON_SIZE) / 2
  const sideX = Math.round(containerWidth * 0.14)
  return [
    { x: cx, y: 14 },
    { x: containerWidth - sideX - BUTTON_SIZE, y: 114 },
    { x: sideX, y: 114 },
  ]
}

interface ButtonConfig {
  icon: IconSymbolName
  color: string
  iconColor: string
}

function DraggableButton({
  config,
  slotIndex,
  slotPositions,
  onSwap,
}: {
  config: ButtonConfig
  slotIndex: number
  slotPositions: SlotPos[]
  onSwap: (from: number, to: number) => void
}) {
  const tx = useSharedValue(0)
  const ty = useSharedValue(0)
  const scale = useSharedValue(1)
  const isDragging = useSharedValue(false)

  const triggerSwap = useCallback(
    (from: number, to: number) => onSwap(from, to),
    [onSwap],
  )

  const pan = Gesture.Pan()
    .onStart(() => {
      "worklet"
      isDragging.value = true
      scale.value = withTiming(1.08, { duration: 120 })
    })
    .onUpdate((e) => {
      "worklet"
      tx.value = e.translationX
      ty.value = e.translationY
    })
    .onEnd(() => {
      "worklet"
      const myPos = slotPositions[slotIndex]
      const fingerX = myPos.x + BUTTON_SIZE / 2 + tx.value
      const fingerY = myPos.y + BUTTON_SIZE / 2 + ty.value

      let nearestSlot = slotIndex
      let minDistSq = Number.POSITIVE_INFINITY

      for (let i = 0; i < slotPositions.length; i++) {
        const p = slotPositions[i]
        const dx = fingerX - (p.x + BUTTON_SIZE / 2)
        const dy = fingerY - (p.y + BUTTON_SIZE / 2)
        const distSq = dx * dx + dy * dy
        if (distSq < minDistSq) {
          minDistSq = distSq
          nearestSlot = i
        }
      }

      if (nearestSlot !== slotIndex) {
        scheduleOnRN(triggerSwap, slotIndex, nearestSlot)
      }

      isDragging.value = false
      scale.value = withTiming(1, { duration: 120 })
      tx.value = 0
      ty.value = 0
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 100 : 2,
    elevation: isDragging.value ? 12 : 3,
  }))

  const slotPos = slotPositions[slotIndex]

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.button,
          {
            position: "absolute",
            left: slotPos.x,
            top: slotPos.y,
            backgroundColor: config.color,
          },
          animatedStyle,
        ]}
      >
        <IconSymbol name={config.icon} size={24} color={config.iconColor} />
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
      icon: "chevron-double-down",
      color: theme.colors.customColors.income,
      iconColor: theme.colors.onError,
    },
    expense: {
      icon: "chevron-double-up",
      color: theme.colors.customColors.expense,
      iconColor: theme.colors.onError,
    },
    transfer: {
      icon: "swap-horizontal",
      color: theme.colors.secondary,
      iconColor: theme.colors.onSecondary,
    },
  }

  const handleSwap = useCallback(
    (from: number, to: number) => {
      const newOrder = [...order] as ButtonPlacementOrder
      const temp = newOrder[from]
      newOrder[from] = newOrder[to]
      newOrder[to] = temp
      setOrder(newOrder)
    },
    [order, setOrder],
  )

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      scrollEnabled={false}
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
        {slotPositions.map((pos, i) => (
          <View
            key={`${pos.x}-${pos.y}-${i.toString()}`}
            style={[
              styles.slotPlaceholder,
              {
                position: "absolute",
                left: pos.x - 6,
                top: pos.y - 6,
                borderColor: theme.colors.customColors.semi,
              },
            ]}
          />
        ))}

        {/* Draggable buttons */}
        {order.map((buttonType, slotIndex) => (
          <DraggableButton
            key={buttonType}
            config={buttonConfigs[buttonType]}
            slotIndex={slotIndex}
            slotPositions={slotPositions}
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

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.customColors.semi,
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
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    alignSelf: "flex-start",
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.customColors.semi,
    lineHeight: 18,
  },
}))

import { useCallback } from "react"
import {
  FlatList,
  type FlatListProps,
  type ListRenderItem,
  Pressable,
} from "react-native"
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { View } from "~/components/ui/view"
import { logger } from "~/utils/logger"

const AnimatedView = Animated.createAnimatedComponent(View)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

/**
 * Pure helper function to move an item in an array
 */
function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length || from === to) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

interface ReorderableRowProps<T> {
  item: T
  index: number
  renderItem: ListRenderItem<T>
  dataLength: number
  onMove: (from: number, to: number) => void
  showButtons: boolean
}

function ReorderableRow<T>({
  item,
  index,
  renderItem,
  dataLength,
  onMove,
  showButtons,
}: ReorderableRowProps<T>) {
  const { theme } = useUnistyles()
  const iconColor = theme.colors.onPrimary
  const isFirst = index === 0
  const isLast = index === dataLength - 1

  // Create separators object for renderItem (FlatList compatibility)
  const separators = {
    highlight: () => {},
    unhighlight: () => {},
    updateProps: (select: "leading" | "trailing", newProps: unknown) => {
      logger.debug("updateProps", { select, newProps })
    },
  }

  // Animation values for buttons
  const upButtonScale = useSharedValue(1)
  const downButtonScale = useSharedValue(1)
  const itemScale = useSharedValue(1)

  // Animated styles for buttons
  const upButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: upButtonScale.value }],
  }))

  const downButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: downButtonScale.value }],
  }))

  // Animated style for item
  const itemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: itemScale.value }],
  }))

  const handleMoveUp = () => {
    upButtonScale.value = withTiming(0.9, { duration: 100 }, () => {
      upButtonScale.value = withTiming(1, { duration: 100 })
    })
    itemScale.value = withTiming(0.98, { duration: 150 }, () => {
      itemScale.value = withTiming(1, { duration: 150 })
    })
    onMove(index, index - 1)
  }

  const handleMoveDown = () => {
    downButtonScale.value = withTiming(0.9, { duration: 100 }, () => {
      downButtonScale.value = withTiming(1, { duration: 100 })
    })
    itemScale.value = withTiming(0.98, { duration: 150 }, () => {
      itemScale.value = withTiming(1, { duration: 150 })
    })
    onMove(index, index + 1)
  }

  return (
    <AnimatedView
      layout={LinearTransition}
      style={[styles.row, itemAnimatedStyle]}
    >
      <View style={{ flex: 1 }}>{renderItem({ item, index, separators })}</View>

      {showButtons && (
        <AnimatedView
          entering={SlideInRight.duration(200)
            .springify()
            .delay(index * 30)}
          exiting={SlideOutRight.duration(150)}
          style={styles.buttonContainer}
        >
          <AnimatedPressable
            disabled={isFirst}
            onPress={handleMoveUp}
            style={[
              styles.iconButton,
              upButtonStyle,
              isFirst && styles.buttonDisabled,
            ]}
          >
            <IconSvg name="arrow-up" size={18} color={iconColor} />
          </AnimatedPressable>

          <AnimatedPressable
            disabled={isLast}
            onPress={handleMoveDown}
            style={[
              styles.iconButton,
              downButtonStyle,
              isLast && styles.buttonDisabled,
            ]}
          >
            <IconSvg name="arrow-down" size={18} color={iconColor} />
          </AnimatedPressable>
        </AnimatedView>
      )}
    </AnimatedView>
  )
}

interface ReorderableListV2Props<T>
  extends Omit<FlatListProps<T>, "renderItem"> {
  data: T[]
  onReorder: (newData: T[]) => void
  renderItem: ListRenderItem<T>
  showButtons?: boolean
  keyExtractor?: (item: T, index: number) => string
}

export function ReorderableListV2<T>({
  data,
  onReorder,
  renderItem,
  showButtons = true,
  keyExtractor,
  ...flatListProps
}: ReorderableListV2Props<T>) {
  const move = useCallback(
    (from: number, to: number) => {
      const next = moveItem(data, from, to)
      if (next !== data) {
        onReorder(next)
      }
    },
    [data, onReorder],
  )

  const renderReorderableItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => (
      <ReorderableRow
        item={item}
        index={index}
        renderItem={renderItem}
        dataLength={data.length}
        onMove={move}
        showButtons={showButtons}
      />
    ),
    [renderItem, move, data.length, showButtons],
  )

  return (
    <FlatList
      {...flatListProps}
      data={data}
      keyExtractor={keyExtractor ?? ((_, i) => i.toString())}
      renderItem={renderReorderableItem}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    gap: 2,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.3,
  },
}))

import * as Haptics from "expo-haptics"
import { type ReactElement, useLayoutEffect, useRef } from "react"
import type { LayoutChangeEvent, ListRenderItem, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const SETTLE_MS = 150
const PICKUP_MS = 250

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

interface DragState {
  /** Index of the row being dragged, -1 when idle. */
  active: SharedValue<number>
  /** Index the dragged row would land on. */
  target: SharedValue<number>
  dragY: SharedValue<number>
  tops: SharedValue<number[]>
  heights: SharedValue<number[]>
  /**
   * Row keys in the order they had when the drag began. Rows find their place
   * here, not from their render index, so a reorder committed on drop does not
   * move them again before the drag state is cleared.
   */
  keys: SharedValue<string[]>
  /** Height of the dragged row plus the gap below it: how far the others shift. */
  slot: SharedValue<number>
}

interface ReorderableRowProps<T> {
  item: T
  rowKey: string
  index: number
  count: number
  renderItem: ListRenderItem<T>
  reordering: boolean
  drag: DragState
  onLayoutRow: (e: LayoutChangeEvent) => void
  onPickUp: () => void
  onDrop: (from: number, to: number) => void
}

function ReorderableRow<T>({
  item,
  rowKey,
  index,
  count,
  renderItem,
  reordering,
  drag,
  onLayoutRow,
  onPickUp,
  onDrop,
}: ReorderableRowProps<T>) {
  const { active, target, dragY, tops, heights, keys, slot } = drag

  const pan = Gesture.Pan()
    .enabled(reordering)
    // A quick swipe still scrolls; hold to pick the card up.
    .activateAfterLongPress(PICKUP_MS)
    .onStart(() => {
      runOnJS(onPickUp)()
      const t = tops.get()
      const h = heights.get()
      // Rows are equally spaced, so the gap after row 0 is the gap everywhere.
      const gap = count > 1 ? t[1] - t[0] - h[0] : 0
      slot.set(h[index] + gap)
      dragY.set(0)
      target.set(index)
      active.set(index)
    })
    .onUpdate((e) => {
      dragY.set(e.translationY)
      const t = tops.get()
      const h = heights.get()
      const center = t[index] + h[index] / 2 + e.translationY
      let next = index
      for (let i = 0; i < count; i++) {
        if (center >= t[i]) next = i
      }
      target.set(next)
    })
    .onFinalize(() => {
      if (active.get() !== index) return
      const to = target.get()
      const t = tops.get()
      const h = heights.get()
      // Where the row's top lands: at the target slot's top moving up, or so its
      // bottom meets the target's bottom moving down.
      const rest =
        to > index ? t[to] + h[to] - h[index] - t[index] : t[to] - t[index]
      dragY.set(
        withTiming(rest, { duration: SETTLE_MS }, () => {
          runOnJS(onDrop)(index, to)
        }),
      )
    })

  const animatedStyle = useAnimatedStyle(() => {
    const a = active.get()
    if (a === -1) {
      return {
        transform: [{ translateY: 0 }],
        zIndex: 0,
      }
    }
    if (a === keys.get().indexOf(rowKey)) {
      return {
        transform: [{ translateY: dragY.get() }],
        zIndex: 10,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
      }
    }
    const t = target.get()
    const home = keys.get().indexOf(rowKey)
    let shift = 0
    if (a < home && home <= t) shift = -slot.get()
    else if (t <= home && home < a) shift = slot.get()
    return {
      transform: [{ translateY: withTiming(shift, { duration: SETTLE_MS }) }],
      zIndex: 0,
    }
  })

  return (
    <GestureDetector gesture={pan}>
      <Animated.View onLayout={onLayoutRow} style={animatedStyle}>
        {renderItem({
          item,
          index,
          separators: {
            highlight: () => {},
            unhighlight: () => {},
            updateProps: () => {},
          },
        })}
      </Animated.View>
    </GestureDetector>
  )
}

interface ReorderableListProps<T> {
  data: T[]
  onReorder: (newData: T[]) => void
  renderItem: ListRenderItem<T>
  keyExtractor: (item: T, index: number) => string
  /** Reorder mode: cards can be held and dragged. */
  reordering?: boolean
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
  showsVerticalScrollIndicator?: boolean
  ListFooterComponent?: ReactElement | null
}

/**
 * A list whose rows you reorder by dragging their handle.
 *
 * shortcut: renders every row (no virtualization), no auto-scroll while
 * dragging near the edge, and rows must be spaced evenly. Fine for the short
 * account list; upgrade to react-native-reorderable-list if it outgrows that.
 */
export function ReorderableList<T>({
  data,
  onReorder,
  renderItem,
  keyExtractor,
  reordering = true,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator,
  ListFooterComponent,
}: ReorderableListProps<T>) {
  const active = useSharedValue(-1)
  const target = useSharedValue(-1)
  const dragY = useSharedValue(0)
  const tops = useSharedValue<number[]>([])
  const heights = useSharedValue<number[]>([])
  const keys = useSharedValue<string[]>([])
  const slot = useSharedValue(0)
  const drag: DragState = { active, target, dragY, tops, heights, keys, slot }

  const layouts = useRef<Record<string, { y: number; h: number }>>({})
  // Latest props for the drop callback, which a gesture may call a frame late.
  const latest = useRef({ data, onReorder })
  latest.current = { data, onReorder }

  // True from pick-up until the dropped order is on screen: layout updates
  // must not change what the rows use mid-drag.
  const dragging = useRef(false)
  const resetPending = useRef(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  const syncLayouts = () => {
    if (dragging.current) return
    const order = data.map(keyExtractor)
    keys.set(order)
    tops.set(order.map((k) => layouts.current[k]?.y ?? 0))
    heights.set(order.map((k) => layouts.current[k]?.h ?? 0))
  }

  const resetDrag = () => {
    clearTimeout(resetTimer.current)
    resetPending.current = false
    dragging.current = false
    active.set(-1)
    target.set(-1)
    dragY.set(0)
    keys.set(data.map(keyExtractor))
  }

  const handlePickUp = () => {
    dragging.current = true
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  // Clearing the drag state in the same commit as the new row order keeps the
  // rows from snapping for a frame; clearing it in the drop handler ran first.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the order changes
  useLayoutEffect(() => {
    if (resetPending.current) resetDrag()
  }, [data])

  const handleDrop = (from: number, to: number) => {
    const { data: current, onReorder: commit } = latest.current
    if (from === to) {
      resetDrag()
      return
    }
    resetPending.current = true
    // If the parent never applies the new order, do not stay stuck mid-drag.
    resetTimer.current = setTimeout(resetDrag, 400)
    commit(moveItem(current, from, to))
  }

  // No scrolling while a row is held, or the list fights the drag.
  const scrollProps = useAnimatedProps(() => ({
    scrollEnabled: active.get() === -1,
  }))

  return (
    <Animated.ScrollView
      animatedProps={scrollProps}
      style={style}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {data.map((item, index) => {
        const key = keyExtractor(item, index)
        return (
          <ReorderableRow
            key={key}
            rowKey={key}
            item={item}
            index={index}
            count={data.length}
            renderItem={renderItem}
            reordering={reordering}
            drag={drag}
            onLayoutRow={(e) => {
              layouts.current[key] = {
                y: e.nativeEvent.layout.y,
                h: e.nativeEvent.layout.height,
              }
              syncLayouts()
            }}
            onPickUp={handlePickUp}
            onDrop={handleDrop}
          />
        )
      })}
      {ListFooterComponent}
    </Animated.ScrollView>
  )
}

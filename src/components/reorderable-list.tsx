import * as Haptics from "expo-haptics"
import { type ReactElement, useRef } from "react"
import type { LayoutChangeEvent, ListRenderItem, ViewStyle } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
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
  /** Height of the dragged row plus the gap below it: how far the others shift. */
  slot: SharedValue<number>
}

interface ReorderableRowProps<T> {
  item: T
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
  index,
  count,
  renderItem,
  reordering,
  drag,
  onLayoutRow,
  onPickUp,
  onDrop,
}: ReorderableRowProps<T>) {
  const { active, target, dragY, tops, heights, slot } = drag
  // Each row owns its offset. Rows that move on drop are remounted (see the
  // list's `versions`), which resets this to 0 in the same commit as the new
  // order, so nothing is ever drawn at a stale offset.
  const offset = useSharedValue(0)

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

  // The dragged row follows the finger.
  useAnimatedReaction(
    () => dragY.get(),
    (y) => {
      if (active.get() === index) offset.set(y)
    },
  )

  // The others make room.
  useAnimatedReaction(
    () => target.get(),
    (t) => {
      const a = active.get()
      if (a < 0 || t < 0 || a === index) return
      let shift = 0
      if (a < index && index <= t) shift = -slot.get()
      else if (t <= index && index < a) shift = slot.get()
      if (shift !== offset.get()) {
        offset.set(withTiming(shift, { duration: SETTLE_MS }))
      }
    },
  )

  const animatedStyle = useAnimatedStyle(() => {
    if (active.get() === index) {
      return {
        transform: [{ translateY: offset.get() }],
        zIndex: 10,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
      }
    }
    return { transform: [{ translateY: offset.get() }], zIndex: 0 }
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
 * A list whose rows you reorder by holding a card and dragging it.
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
  const slot = useSharedValue(0)
  const drag: DragState = { active, target, dragY, tops, heights, slot }

  const layouts = useRef<Record<string, { y: number; h: number }>>({})
  // Latest props for the drop callback, which a gesture may call a frame late.
  const latest = useRef({ data, onReorder })
  latest.current = { data, onReorder }

  // Bumped for every row a drop moves, so React remounts it with a fresh offset.
  const versions = useRef<Record<string, number>>({})

  const syncLayouts = () => {
    const order = data.map(keyExtractor)
    tops.set(order.map((k) => layouts.current[k]?.y ?? 0))
    heights.set(order.map((k) => layouts.current[k]?.h ?? 0))
  }

  const handlePickUp = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleDrop = (from: number, to: number) => {
    const { data: current, onReorder: commit } = latest.current
    if (from !== to) {
      for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
        const key = keyExtractor(current[i], i)
        versions.current[key] = (versions.current[key] ?? 0) + 1
      }
    }
    // Rows keep their offsets here; the remount does the reset with the commit.
    active.set(-1)
    target.set(-1)
    dragY.set(0)
    if (from !== to) commit(moveItem(current, from, to))
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
            key={`${key}:${versions.current[key] ?? 0}`}
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

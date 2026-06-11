import { Line, vec } from "@shopify/react-native-skia"
import type { SharedValue } from "react-native-reanimated"
import { useDerivedValue } from "react-native-reanimated"

interface ChartCrosshairProps {
  xPosition: SharedValue<number>
  isActive: SharedValue<boolean>
  top: number
  bottom: number
}

/**
 * Skia crosshair line rendered inside CartesianChart's renderOutside canvas.
 * Runs entirely on the UI thread via useDerivedValue — no React re-renders.
 */
export function ChartCrosshair({
  xPosition,
  isActive,
  top,
  bottom,
}: ChartCrosshairProps) {
  const p1 = useDerivedValue(() => vec(xPosition.value, top))
  const p2 = useDerivedValue(() => vec(xPosition.value, bottom))
  const opacity = useDerivedValue(() => (isActive.value ? 1 : 0))

  return (
    <Line
      p1={p1}
      p2={p2}
      color="rgba(150,150,150,0.5)"
      strokeWidth={1}
      opacity={opacity}
    />
  )
}

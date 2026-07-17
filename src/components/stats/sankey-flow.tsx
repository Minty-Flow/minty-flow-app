import { Canvas, Path, RoundedRect, Skia } from "@shopify/react-native-skia"
import { useMemo, useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { View } from "~/components/ui/view"

export interface SankeyNode {
  label: string
  color: string
  value: number
}

interface SankeyFlowProps {
  /** Both columns must sum to the same total */
  left: SankeyNode[]
  right: SankeyNode[]
  height?: number
}

const NODE_WIDTH = 8
const NODE_GAP = 4

interface PlacedNode extends SankeyNode {
  top: number
  height: number
}

function placeColumn(nodes: SankeyNode[], height: number, total: number) {
  const usable = height - (nodes.length - 1) * NODE_GAP
  const placed: PlacedNode[] = []
  let cursor = 0
  for (const node of nodes) {
    const nodeHeight = (node.value / total) * usable
    placed.push({ ...node, top: cursor, height: nodeHeight })
    cursor += nodeHeight + NODE_GAP
  }
  return placed
}

export function SankeyFlow({ left, right, height = 260 }: SankeyFlowProps) {
  const [width, setWidth] = useState(0)

  const geometry = useMemo(() => {
    const total = left.reduce((s, n) => s + n.value, 0)
    if (width === 0 || total <= 0 || left.length === 0 || right.length === 0) {
      return null
    }

    // Both columns are scaled by the left total, so an unbalanced caller would
    // silently run the right column off the canvas — draw nothing instead.
    const rightTotal = right.reduce((s, n) => s + n.value, 0)
    if (Math.abs(rightTotal - total) > 0.01) return null

    const leftNodes = placeColumn(left, height, total)
    const rightNodes = placeColumn(right, height, total)

    // No real income→expense links exist: distribute each source
    // proportionally across all targets (ribbon = left_i × right_j / total)
    const mx = width / 2
    const x0 = NODE_WIDTH
    const x1 = width - NODE_WIDTH
    const leftCursor = leftNodes.map((n) => n.top)
    const rightCursor = rightNodes.map((n) => n.top)
    const ribbons: {
      path: ReturnType<typeof Skia.Path.Make>
      color: string
    }[] = []

    leftNodes.forEach((source, i) => {
      rightNodes.forEach((target, j) => {
        const value = (source.value * target.value) / total
        if (value <= 0) return
        const hL = (value / source.value) * source.height
        const hR = (value / target.value) * target.height
        const yL = leftCursor[i] ?? 0
        const yR = rightCursor[j] ?? 0
        leftCursor[i] = yL + hL
        rightCursor[j] = yR + hR

        const path = Skia.Path.Make()
        path.moveTo(x0, yL)
        path.cubicTo(mx, yL, mx, yR, x1, yR)
        path.lineTo(x1, yR + hR)
        path.cubicTo(mx, yR + hR, mx, yL + hL, x0, yL + hL)
        path.close()
        ribbons.push({ path, color: target.color })
      })
    })

    return { leftNodes, rightNodes, ribbons, x1 }
  }, [left, right, width, height])

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {geometry && (
        <Canvas style={styles.canvas}>
          {geometry.ribbons.map((ribbon, i) => (
            <Path
              // ribbons are derived positionally; order is stable per render
              key={String(i)}
              path={ribbon.path}
              color={ribbon.color}
              opacity={0.35}
            />
          ))}
          {geometry.leftNodes.map((node) => (
            <RoundedRect
              key={node.label}
              x={0}
              y={node.top}
              width={NODE_WIDTH}
              height={node.height}
              r={3}
              color={node.color}
            />
          ))}
          {geometry.rightNodes.map((node) => (
            <RoundedRect
              key={node.label}
              x={geometry.x1}
              y={node.top}
              width={NODE_WIDTH}
              height={node.height}
              r={3}
              color={node.color}
            />
          ))}
        </Canvas>
      )}
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  container: {
    width: "100%",
  },
  canvas: {
    flex: 1,
  },
}))

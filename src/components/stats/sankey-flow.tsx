import {
  Canvas,
  Group,
  Path,
  RoundedRect,
  Skia,
} from "@shopify/react-native-skia"
import { useMemo, useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { View } from "~/components/ui/view"

export interface SankeyNode {
  label: string
  color: string
  value: number
}

interface SankeyFlowProps {
  left: SankeyNode[]
  right: SankeyNode[]
  height?: number
  hubColor?: string
}

const NODE_WIDTH = 6
const NODE_GAP = 4

interface PlacedNode extends SankeyNode {
  top: number
  height: number
}

interface HubSlice {
  top: number
  height: number
}

function placeColumn(nodes: SankeyNode[], height: number, total: number) {
  const usable = Math.max(0, height - (nodes.length - 1) * NODE_GAP)
  const placed: PlacedNode[] = []
  let cursor = 0
  for (const node of nodes) {
    const nodeHeight = total > 0 ? (node.value / total) * usable : 0
    placed.push({ ...node, top: cursor, height: nodeHeight })
    cursor += nodeHeight + NODE_GAP
  }
  return placed
}

function buildRibbon(
  x0: number,
  x1: number,
  y0Top: number,
  y0Bottom: number,
  y1Top: number,
  y1Bottom: number,
  c0 = 0.4,
  c1 = 0.4,
) {
  const dx = x1 - x0
  const path = Skia.Path.Make()
  path.moveTo(x0, y0Top)
  path.cubicTo(x0 + dx * c0, y0Top, x1 - dx * c1, y1Top, x1, y1Top)
  path.lineTo(x1, y1Bottom)
  path.cubicTo(x1 - dx * c1, y1Bottom, x0 + dx * c0, y0Bottom, x0, y0Bottom)
  path.close()
  return path
}

export function SankeyFlow({
  left,
  right,
  height = 260,
  hubColor = "#4A5568",
}: SankeyFlowProps) {
  const [width, setWidth] = useState(0)

  const geometry = useMemo(() => {
    if (width === 0 || left.length === 0 || right.length === 0) return null

    // 1. Auto-balance left and right totals to prevent geometry collapse
    const rawLeftTotal = left.reduce((s, n) => s + n.value, 0)
    const rawRightTotal = right.reduce((s, n) => s + n.value, 0)
    const diff = rawLeftTotal - rawRightTotal

    const balancedLeft = [...left]
    const balancedRight = [...right]

    if (Math.abs(diff) > 0.01) {
      if (diff > 0) {
        // Income > Spending: Auto-inject "To reserves" node on the right
        balancedRight.push({
          label: "To reserves",
          color: "#2D3748",
          value: diff,
        })
      } else {
        // Spending > Income: Auto-inject "From reserves" node on the left
        balancedLeft.push({
          label: "From reserves",
          color: "#4A2020",
          value: Math.abs(diff),
        })
      }
    }

    const total = Math.max(
      rawLeftTotal,
      rawRightTotal,
      balancedLeft.reduce((s, n) => s + n.value, 0),
    )
    if (total <= 0) return null

    // 2. Position outer nodes
    const leftNodes = placeColumn(balancedLeft, height, total)
    const rightNodes = placeColumn(balancedRight, height, total)

    const hubWidth = 3
    const hubLeft = width / 2 - hubWidth / 2
    const hubRight = hubLeft + hubWidth
    const x0 = NODE_WIDTH
    const x1 = width - NODE_WIDTH

    // 3. Stack Left Hub Slices (Left Nodes -> Central Hub)
    const leftHubSlices: HubSlice[] = []
    let leftCursor = 0
    for (const source of leftNodes) {
      const sliceHeight = (source.value / total) * height
      leftHubSlices.push({ top: leftCursor, height: sliceHeight })
      leftCursor += sliceHeight
    }

    // 4. Stack Right Hub Slices (Central Hub -> Right Nodes)
    const rightHubSlices: HubSlice[] = []
    let rightCursor = 0
    for (const target of rightNodes) {
      const sliceHeight = (target.value / total) * height
      rightHubSlices.push({ top: rightCursor, height: sliceHeight })
      rightCursor += sliceHeight
    }

    // 5. Left Ribbons (Source Node -> Corresponding Left Hub Slice)
    const leftRibbons = leftNodes.map((source, i) => {
      const slice = leftHubSlices[i]
      return {
        path: buildRibbon(
          x0,
          hubLeft,
          source.top,
          source.top + source.height,
          slice.top,
          slice.top + slice.height,
          0.35,
          0.15,
        ),
        color: source.color,
      }
    })

    // 6. Right Ribbons (Corresponding Right Hub Slice -> Target Node)
    const rightRibbons = rightNodes.map((target, i) => {
      const slice = rightHubSlices[i]
      return {
        path: buildRibbon(
          hubRight,
          x1,
          slice.top,
          slice.top + slice.height,
          target.top,
          target.top + target.height,
          0.15,
          0.35,
        ),
        color: target.color,
      }
    })

    return {
      leftNodes,
      rightNodes,
      leftRibbons,
      rightRibbons,
      hubLeft,
      hubWidth,
      x1,
    }
  }, [left, right, width, height])

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {geometry && (
        <Canvas style={styles.canvas}>
          {/* Central Hub Line */}
          <Group opacity={0.4}>
            <RoundedRect
              x={geometry.hubLeft}
              y={0}
              width={geometry.hubWidth}
              height={height}
              r={1}
              color={hubColor}
            />
          </Group>

          {/* Left Flow Ribbons */}
          {geometry.leftRibbons.map((ribbon, i) => (
            <Path
              key={`l${i.toString()}`}
              path={ribbon.path}
              color={ribbon.color}
              opacity={0.35}
            />
          ))}

          {/* Right Flow Ribbons */}
          {geometry.rightRibbons.map((ribbon, i) => (
            <Path
              key={`r${i.toString()}`}
              path={ribbon.path}
              color={ribbon.color}
              opacity={0.35}
            />
          ))}

          {/* Left Node Bars */}
          {geometry.leftNodes.map((node) => (
            <RoundedRect
              key={`left-${node.label}`}
              x={0}
              y={node.top}
              width={NODE_WIDTH}
              height={node.height}
              r={2}
              color={node.color}
            />
          ))}

          {/* Right Node Bars */}
          {geometry.rightNodes.map((node) => (
            <RoundedRect
              key={`right-${node.label}`}
              x={geometry.x1}
              y={node.top}
              width={NODE_WIDTH}
              height={node.height}
              r={2}
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

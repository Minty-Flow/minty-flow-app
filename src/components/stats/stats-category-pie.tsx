import { Group, Paint } from "@shopify/react-native-skia"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import {
  Easing,
  type SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet, useUnistyles } from "react-native-unistyles"
import { Pie, PolarChart } from "victory-native"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Money } from "~/components/money"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import type { CategoryBreakdownItem } from "~/types/stats"

import { ChartContainer } from "./chart-container"

interface StatsCategoryPieProps {
  breakdown: CategoryBreakdownItem[]
  currency: string
  maxSlices?: number
}

/** Fixed chart size — pieContainer is always 200×200 */
const CHART_SIZE = 200
const CENTER = CHART_SIZE / 2
/** Matches the `innerRadius="50%"` prop on Pie.Chart */
const INNER_RADIUS_RATIO = 0.5

function getCategoryColor(
  item: CategoryBreakdownItem,
  index: number,
  fallbackPalette: string[],
): string {
  const scheme = getThemeStrict(item.categoryColorSchemeName)
  if (scheme) return scheme.primary
  return (
    fallbackPalette[index % fallbackPalette.length] ??
    fallbackPalette[0] ??
    "#888888"
  )
}

interface PieSliceAnimatedProps {
  sliceIndex: number
  selectedIndexSv: SharedValue<number>
  isSelected: boolean
  surfaceColor: string
}

/**
 * Wraps a single Pie.Slice in a Skia Group whose scale is animated via
 * Reanimated on the UI thread — smooth spring transition without React re-renders.
 */
function PieSliceAnimated({
  sliceIndex,
  selectedIndexSv,
  isSelected,
  surfaceColor,
}: PieSliceAnimatedProps) {
  const scale = useSharedValue(1.0)

  useAnimatedReaction(
    () => selectedIndexSv.value,
    (selectedIndex) => {
      const target =
        selectedIndex !== -1 && selectedIndex !== sliceIndex ? 0.92 : 1.0
      scale.value = withTiming(target, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      })
    },
    [sliceIndex],
  )

  const transform = useDerivedValue(() => [{ scale: scale.value }])

  return (
    <Group origin={{ x: CENTER, y: CENTER }} transform={transform}>
      <Pie.Slice animate={{ type: "timing", duration: 200 }}>
        {isSelected && (
          <Paint style="stroke" strokeWidth={5} color={surfaceColor} />
        )}
      </Pie.Slice>
    </Group>
  )
}

export function StatsCategoryPie({
  breakdown,
  currency,
  maxSlices = 6,
}: StatsCategoryPieProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [mode, setMode] = useState<"expense" | "income">("expense")
  const [selectedSlice, setSelectedSlice] = useState<{
    index: number
    label: string
    value: number
    color: string
  } | null>(null)

  // Captures startAngle/endAngle for each slice so the tap handler can do
  // angle-based hit-testing without needing Skia canvas coordinates.
  const pieSlicesRef = useRef<Array<{ startAngle: number; endAngle: number }>>(
    [],
  )

  // SharedValue mirror of selectedSlice?.index — drives per-slice spring animations
  // on the UI thread without going through React renders.
  const selectedIndexSv = useSharedValue(-1)
  useEffect(() => {
    selectedIndexSv.value = selectedSlice?.index ?? -1
  }, [selectedSlice, selectedIndexSv])

  const { pieData, legendItems, total } = useMemo(() => {
    if (breakdown.length === 0) {
      return { pieData: [], legendItems: [], total: 0 }
    }

    const fallbackPalette = [
      theme.colors.primary,
      theme.colors.customColors.income,
      theme.colors.customColors.info,
      theme.colors.customColors.warning,
      theme.colors.customColors.expense,
      theme.colors.customColors.success,
      theme.colors.secondary,
      theme.colors.error,
    ]

    const getValue = (b: CategoryBreakdownItem) =>
      mode === "expense" ? b.totalExpense : b.totalIncome

    const sorted = breakdown
      .filter((b) => getValue(b) > 0)
      .sort((a, b) => getValue(b) - getValue(a))

    const totalVal = sorted.reduce((s, b) => s + getValue(b), 0)
    const topSlices = sorted.slice(0, maxSlices)
    const otherSlices = sorted.slice(maxSlices)

    const items: {
      label: string
      value: number
      color: string
      icon: string | null
      colorSchemeName: string | null
    }[] = topSlices.map((item, i) => ({
      label: item.categoryName,
      value: getValue(item),
      color: getCategoryColor(item, i, fallbackPalette),
      icon: item.categoryIcon,
      colorSchemeName: item.categoryColorSchemeName,
    }))

    if (otherSlices.length > 0) {
      const otherTotal = otherSlices.reduce((s, b) => s + getValue(b), 0)
      items.push({
        label: "Other",
        value: otherTotal,
        color: theme.colors.customColors.semi,
        icon: null,
        colorSchemeName: null,
      })
    }

    const filteredItems = items.filter((item) => item.value > 0)

    return {
      pieData: filteredItems,
      legendItems: items,
      total: totalVal,
    }
  }, [
    breakdown,
    maxSlices,
    mode,
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.error,
    theme.colors.customColors.income,
    theme.colors.customColors.expense,
    theme.colors.customColors.info,
    theme.colors.customColors.warning,
    theme.colors.customColors.success,
    theme.colors.customColors.semi,
  ])

  // Reset selection whenever the user switches expense/income mode
  const handleModeChange = (newMode: "expense" | "income") => {
    setMode(newMode)
    setSelectedSlice(null)
  }

  // Tap gesture: convert touch coordinates to a polar angle and find the
  // corresponding slice via the angles captured in pieSlicesRef.
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd((event) => {
      const dx = event.x - CENTER
      const dy = event.y - CENTER
      const dist = Math.sqrt(dx * dx + dy * dy)

      const outerRadius = CENTER // 100
      const innerRadius = outerRadius * INNER_RADIUS_RATIO // 60

      // Tapped in the donut hole or outside the chart — deselect
      if (dist < innerRadius || dist > outerRadius) {
        setSelectedSlice(null)
        return
      }

      // Convert to Skia's clockwise angle from 3 o'clock (right).
      // victory-native passes startAngle/endAngle directly to Skia's arcToOval,
      // which uses 0° = right, increasing clockwise — so no offset needed.
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI

      // Normalise to [0, 360)
      const normAngle = ((angle % 360) + 360) % 360

      const hitIndex = pieSlicesRef.current.findIndex(
        (s) => normAngle >= s.startAngle && normAngle < s.endAngle,
      )

      if (hitIndex === -1) {
        setSelectedSlice(null)
        return
      }

      // Tapping the already-selected slice deselects it
      if (selectedSlice?.index === hitIndex) {
        setSelectedSlice(null)
      } else {
        const hit = pieData[hitIndex]
        if (hit) {
          setSelectedSlice({
            index: hitIndex,
            label: hit.label,
            value: hit.value,
            color: hit.color,
          })
        }
      }
    })

  // If there are no categories at all, hide the section entirely
  if (breakdown.length === 0) return null

  // pieData may be empty if the selected mode (expense/income) has no data
  const isPieEmpty = pieData.length === 0

  const segmentedControl = (
    <View style={styles.segmentRow}>
      <Pressable
        onPress={() => handleModeChange("expense")}
        style={[
          styles.segment,
          mode === "expense" ? styles.segmentActive : styles.segmentInactive,
        ]}
      >
        <Text
          variant="small"
          style={
            mode === "expense" ? styles.segmentTextActive : styles.segmentText
          }
        >
          {t("screens.stats.pieToggle.expenses")}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleModeChange("income")}
        style={[
          styles.segment,
          mode === "income" ? styles.segmentActive : styles.segmentInactive,
        ]}
      >
        <Text
          variant="small"
          style={
            mode === "income" ? styles.segmentTextActive : styles.segmentText
          }
        >
          {t("screens.stats.pieToggle.income")}
        </Text>
      </Pressable>
    </View>
  )

  return (
    <ChartContainer
      title={t("screens.stats.chart.spendingByCategory")}
      legend={segmentedControl}
      legendBelow
    >
      {isPieEmpty ? (
        <View style={styles.emptyPieState}>
          <Text variant="muted" style={styles.emptyPieText}>
            {t("screens.stats.pieToggle.noData")}
          </Text>
        </View>
      ) : (
        <>
          {/* GestureDetector wraps only the chart area so touches outside
              the 200×200 canvas don't accidentally register as slice hits */}
          <View style={styles.chartWrapper}>
            <GestureDetector gesture={tapGesture}>
              <View style={styles.pieContainer}>
                <PolarChart
                  data={pieData}
                  labelKey="label"
                  valueKey="value"
                  colorKey="color"
                >
                  <Pie.Chart innerRadius="50%">
                    {({ slice }) => {
                      // Capture angular span for tap hit-testing
                      const index = pieData.findIndex(
                        (d) => d.label === slice.label,
                      )
                      if (index !== -1) {
                        pieSlicesRef.current[index] = {
                          startAngle: slice.startAngle,
                          endAngle: slice.endAngle,
                        }
                      }
                      const isSelected =
                        selectedSlice !== null && selectedSlice.index === index
                      return (
                        <PieSliceAnimated
                          sliceIndex={index}
                          selectedIndexSv={selectedIndexSv}
                          isSelected={isSelected}
                          surfaceColor={theme.colors.surface}
                        />
                      )
                    }}
                  </Pie.Chart>
                </PolarChart>

                {/* Center label — always shows total */}
                <View style={styles.centerLabel}>
                  <Money
                    value={total}
                    currency={currency}
                    tone={mode === "expense" ? "expense" : "income"}
                    variant="small"
                    compact
                    style={styles.centerAmount}
                  />
                  <Text variant="muted" style={styles.centerCurrency}>
                    {currency}
                  </Text>
                </View>
              </View>
            </GestureDetector>
          </View>

          {/* Legend list — each row taps to highlight the corresponding slice */}
          <View style={styles.legendList}>
            {legendItems.map((item) => {
              const colorScheme = getThemeStrict(item.colorSchemeName)
              const percent = total > 0 ? (item.value / total) * 100 : 0
              const itemIndex = pieData.findIndex((d) => d.label === item.label)
              const isSelected =
                selectedSlice !== null && selectedSlice.index === itemIndex
              return (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    if (itemIndex === -1) return
                    if (selectedSlice?.index === itemIndex) {
                      setSelectedSlice(null)
                    } else {
                      setSelectedSlice({
                        index: itemIndex,
                        label: item.label,
                        value: item.value,
                        color: item.color,
                      })
                    }
                  }}
                  style={[
                    styles.legendRow,
                    selectedSlice !== null &&
                      !isSelected &&
                      styles.legendRowDimmed,
                  ]}
                >
                  <View
                    style={[styles.legendDot, { backgroundColor: item.color }]}
                  />
                  {item.icon ? (
                    <DynamicIcon
                      icon={item.icon}
                      size={14}
                      colorScheme={colorScheme}
                      variant="raw"
                    />
                  ) : null}
                  <Text
                    variant="small"
                    style={styles.legendName}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  <Text variant="muted" style={styles.legendPercent}>
                    {percent.toFixed(1)}%
                  </Text>
                  <Money
                    value={item.value}
                    currency={currency}
                    tone="transfer"
                    variant="muted"
                    compact
                  />
                </Pressable>
              )
            })}
          </View>
        </>
      )}
    </ChartContainer>
  )
}

const styles = StyleSheet.create((theme) => ({
  segmentRow: {
    flexDirection: "row",
    gap: 6,
  },
  segment: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius,
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentInactive: {
    backgroundColor: theme.colors.surface,
  },
  segmentText: {
    color: theme.colors.onSurface,
  },
  segmentTextActive: {
    color: theme.colors.onPrimary,
  },
  chartWrapper: {
    alignItems: "center",
  },
  pieContainer: {
    height: 200,
    width: 200,
    position: "relative",
  },
  centerLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerAmount: {
    fontWeight: "700",
    fontSize: theme.typography.labelLarge.fontSize,
  },
  centerCurrency: {
    fontSize: theme.typography.labelSmall.fontSize,
  },
  legendList: {
    gap: 8,
    paddingTop: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendRowDimmed: {
    opacity: 0.4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyPieState: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPieText: {
    textAlign: "center",
  },
  legendName: {
    flex: 1,
  },
  legendPercent: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.customColors.semi,
    minWidth: 40,
    textAlign: "right",
  },
}))

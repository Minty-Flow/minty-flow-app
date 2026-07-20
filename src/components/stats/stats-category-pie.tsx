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
import { EmptyState } from "~/components/ui/empty-state"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { getThemeStrict } from "~/styles/theme/registry"
import { getThemeVariantPalette, shuffleArray } from "~/styles/theme/utils"
import type { CategoryBreakdownItem } from "~/types/stats"

import { DeltaBadge } from "./delta-badge"

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

export function getCategoryColor(
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
    prevValue: number | undefined
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

  // Randomized once per theme category (re-shuffles only when the user switches theme category)
  const fallbackPalette = useMemo(
    () => shuffleArray(getThemeVariantPalette(theme.name)),
    [theme.name],
  )

  const { pieData, legendItems, total } = useMemo(() => {
    if (breakdown.length === 0) {
      return { pieData: [], legendItems: [], total: 0 }
    }

    const getValue = (b: CategoryBreakdownItem) =>
      mode === "expense" ? b.totalExpense : b.totalIncome

    const sorted = breakdown
      .filter((b) => getValue(b) > 0)
      .sort((a, b) => getValue(b) - getValue(a))

    const totalVal = sorted.reduce((s, b) => s + getValue(b), 0)
    const topSlices = sorted.slice(0, maxSlices)
    const otherSlices = sorted.slice(maxSlices)

    const getPrevValue = (b: CategoryBreakdownItem) =>
      mode === "expense" ? b.prevTotalExpense : undefined

    const items: {
      label: string
      value: number
      prevValue: number | undefined
      color: string
      icon: string | null
      colorSchemeName: string | null
    }[] = topSlices.map((item, i) => ({
      label:
        item.categoryId === null
          ? t("screens.stats.chart.uncategorizedLabel")
          : item.categoryName,
      value: getValue(item),
      prevValue: getPrevValue(item),
      color: getCategoryColor(item, i, fallbackPalette),
      icon: item.categoryIcon,
      colorSchemeName: item.categoryColorSchemeName,
    }))

    if (otherSlices.length > 0) {
      const otherTotal = otherSlices.reduce((s, b) => s + getValue(b), 0)
      items.push({
        label: "Other",
        value: otherTotal,
        prevValue:
          mode === "expense"
            ? otherSlices.reduce((s, b) => s + b.prevTotalExpense, 0)
            : undefined,
        color: theme.colors.semantic.semi,
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
    t,
    fallbackPalette,
    theme.colors.semantic.semi,
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
            prevValue: hit.prevValue,
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="small" style={styles.title}>
          {t("screens.stats.chart.spendingByCategory")}
        </Text>
        <View style={styles.legendCentered}>{segmentedControl}</View>
      </View>

      {/* Groups the body so the container's gap applies above it, not between
          the total row, the pie and the legend. */}
      <View>
        {isPieEmpty ? (
          <EmptyState
            variant="compact"
            icon="chart-pie"
            title={t("screens.stats.pieToggle.noData")}
          />
        ) : (
          <>
            <View style={styles.totalRow}>
              <Text variant="muted">{t("screens.stats.categories.total")}</Text>
              <Money
                value={total}
                currency={currency}
                tone={mode === "expense" ? "expense" : "income"}
                showSign
                compact
                style={styles.totalAmount}
              />
            </View>

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
                          selectedSlice !== null &&
                          selectedSlice.index === index
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

                  {/* Center label — selected slice, or total when nothing selected */}
                  <View style={styles.centerLabel}>
                    {selectedSlice ? (
                      <>
                        <Text
                          variant="muted"
                          style={styles.centerCurrency}
                          numberOfLines={1}
                        >
                          {selectedSlice.label}
                        </Text>
                        <Money
                          value={selectedSlice.value}
                          currency={currency}
                          tone={mode === "expense" ? "expense" : "income"}
                          variant="small"
                          compact
                          style={styles.centerAmount}
                        />
                        <DeltaBadge
                          current={selectedSlice.value}
                          previous={selectedSlice.prevValue}
                          invertedSentiment={mode === "expense"}
                        />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </View>
                </View>
              </GestureDetector>
            </View>

            {/* Legend list — each row taps to highlight the corresponding slice */}
            <View style={styles.legendList}>
              {legendItems.map((item) => {
                const colorScheme = getThemeStrict(item.colorSchemeName)
                const percent = total > 0 ? (item.value / total) * 100 : 0
                const itemIndex = pieData.findIndex(
                  (d) => d.label === item.label,
                )
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
                          prevValue: item.prevValue,
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
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 16,
    gap: 12,
    borderCurve: "continuous",
  },
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    fontWeight: "600",
  },
  legendCentered: {
    alignSelf: "stretch",
    alignItems: "center",
  },
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
    paddingHorizontal: 56,
    gap: 2,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  totalAmount: {
    fontWeight: "700",
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
  legendName: {
    flex: 1,
  },
  legendPercent: {
    fontSize: theme.typography.labelMedium.fontSize,
    color: theme.colors.semantic.semi,
    minWidth: 40,
    textAlign: "right",
  },
}))

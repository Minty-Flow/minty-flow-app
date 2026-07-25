import {
  Canvas,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { IconSvg } from "~/components/icons"
import { Money } from "~/components/money"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { BalanceTimelinePoint } from "~/types/stats"

import { StatCard } from "./stat-card"

const CHART_HEIGHT = 64

interface SparklineProps {
  timeline: BalanceTimelinePoint[]
}

function Sparkline({ timeline }: SparklineProps) {
  const { theme } = useUnistyles()
  const [width, setWidth] = useState(0)

  const { linePath, areaPath } = useMemo(() => {
    if (width === 0 || timeline.length < 2) {
      return { linePath: null, areaPath: null }
    }
    const values = timeline.map((p) => p.balance)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const pad = 4
    const usable = CHART_HEIGHT - pad * 2

    const line = Skia.Path.Make()
    const area = Skia.Path.Make()
    timeline.forEach((point, i) => {
      const x = (i / (timeline.length - 1)) * width
      const y = pad + (1 - (point.balance - min) / span) * usable
      if (i === 0) {
        line.moveTo(x, y)
        area.moveTo(x, CHART_HEIGHT)
        area.lineTo(x, y)
      } else {
        line.lineTo(x, y)
        area.lineTo(x, y)
      }
    })
    area.lineTo(width, CHART_HEIGHT)
    area.close()
    return { linePath: line, areaPath: area }
  }, [timeline, width])

  return (
    <View
      style={styles.chartWrap}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {linePath && areaPath ? (
        <Canvas style={styles.canvas}>
          <Path path={areaPath} style="fill">
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, CHART_HEIGHT)}
              colors={[
                `${theme.colors.primary}40`,
                `${theme.colors.primary}00`,
              ]}
            />
          </Path>
          <Path
            path={linePath}
            style="stroke"
            strokeWidth={3}
            strokeJoin="round"
            strokeCap="round"
            color={theme.colors.primary}
          />
        </Canvas>
      ) : null}
    </View>
  )
}

interface NetWorthCardProps {
  netBalance: number
  balanceDelta: number
  periodLabel: string
  timeline: BalanceTimelinePoint[]
  currency: string
  onPress: () => void
}

export function NetWorthCard({
  netBalance,
  balanceDelta,
  periodLabel,
  timeline,
  currency,
  onPress,
}: NetWorthCardProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const deltaUp = balanceDelta >= 0

  return (
    <StatCard
      title={t("screens.stats.dashboard.netWorth")}
      icon="trending-up-outline"
      onPress={onPress}
    >
      <Money
        value={netBalance}
        currency={currency}
        tone="transfer"
        compact
        variant="h3"
        style={styles.total}
      />
      <View style={styles.deltaRow}>
        <IconSvg
          name={deltaUp ? "trending-up-outline" : "trending-down-outline"}
          size={16}
          color={
            deltaUp
              ? theme.colors.semantic.income
              : theme.colors.semantic.expense
          }
        />
        <Money
          value={balanceDelta}
          currency={currency}
          tone="transfer"
          visualTone={deltaUp ? "income" : "expense"}
          showSign
          compact
          variant="small"
          style={styles.deltaAmount}
        />
        <Text variant="muted" style={styles.deltaPeriod}>
          {t("screens.stats.dashboard.inPeriod", { period: periodLabel })}
        </Text>
      </View>
      <Sparkline timeline={timeline} />
    </StatCard>
  )
}

const styles = StyleSheet.create((theme) => ({
  total: {
    fontWeight: "700",
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deltaAmount: {
    fontWeight: "600",
  },
  deltaPeriod: {
    fontSize: theme.typography.bodySmall.fontSize,
  },
  chartWrap: {
    height: CHART_HEIGHT,
    width: "100%",
  },
  canvas: {
    flex: 1,
  },
}))

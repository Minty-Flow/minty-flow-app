import { useEffect } from "react"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { View } from "~/components/ui/view"

function ShimmerBlock({
  width,
  height,
}: {
  width: number | string
  height: number
}) {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 900 }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.shimmer,
        { width: width as number, height },
        animatedStyle,
      ]}
    />
  )
}

export function StatsSkeleton() {
  return (
    <View style={styles.container}>
      {/* Date range selector skeleton */}
      <View style={styles.chipRow}>
        <ShimmerBlock width={80} height={36} />
        <ShimmerBlock width={90} height={36} />
        <ShimmerBlock width={100} height={36} />
        <ShimmerBlock width={80} height={36} />
      </View>

      {/* Range label */}
      <View style={styles.rangeLabelRow}>
        <ShimmerBlock width={180} height={16} />
      </View>

      {/* Hero cards row */}
      <View style={styles.heroRow}>
        <ShimmerBlock width={160} height={90} />
        <ShimmerBlock width={160} height={90} />
        <ShimmerBlock width={160} height={90} />
      </View>

      {/* Chart placeholder */}
      <View style={styles.section}>
        <ShimmerBlock width={120} height={16} />
        <ShimmerBlock width="100%" height={220} />
      </View>

      {/* Category pie placeholder */}
      <View style={styles.section}>
        <ShimmerBlock width={160} height={16} />
        <ShimmerBlock width="100%" height={200} />
      </View>

      {/* Averages row */}
      <View style={styles.avgRow}>
        <ShimmerBlock width="31%" height={80} />
        <ShimmerBlock width="31%" height={80} />
        <ShimmerBlock width="31%" height={80} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: 16,
    paddingTop: 8,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  rangeLabelRow: {
    paddingHorizontal: 16,
  },
  heroRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  avgRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  shimmer: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    borderCurve: "continuous",
  },
}))

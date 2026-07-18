import { useEffect } from "react"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { StyleSheet } from "react-native-unistyles"

import { View } from "~/components/ui/view"

function ShimmerBlock({ height, half }: { height: number; half?: boolean }) {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 900 }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[styles.shimmer, half && styles.half, { height }, animatedStyle]}
    />
  )
}

export function StatsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.halfRow}>
        <ShimmerBlock height={110} half />
        <ShimmerBlock height={110} half />
      </View>
      <ShimmerBlock height={160} />
      <ShimmerBlock height={72} />
      <ShimmerBlock height={180} />
      <View style={styles.halfRow}>
        <ShimmerBlock height={120} half />
        <ShimmerBlock height={120} half />
      </View>
      <ShimmerBlock height={72} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  halfRow: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  shimmer: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    borderCurve: "continuous",
  },
}))

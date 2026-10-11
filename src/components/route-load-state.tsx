import { useEffect, useState } from "react"
import { StyleSheet } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "./ui/activity-indicator-minty"
import { Text } from "./ui/text"
import { View } from "./ui/view"

/**
 * How long a load must last before the spinner appears. Loads that finish
 * sooner show only the plain surface, so fast screens never flash a spinner.
 */
const LOADING_INDICATOR_DELAY_MS = 150

export function RouteLoadingState() {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const timer = setTimeout(
      () => setShowIndicator(true),
      LOADING_INDICATOR_DELAY_MS,
    )
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      {showIndicator ? <ActivityIndicatorMinty /> : null}
    </View>
  )
}

export function RouteNotFoundState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    padding: 24,
  },
}))

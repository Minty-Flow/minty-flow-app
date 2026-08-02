import { StyleSheet } from "react-native-unistyles"

import { ActivityIndicatorMinty } from "./ui/activity-indicator-minty"
import { Text } from "./ui/text"
import { View } from "./ui/view"

export function RouteLoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicatorMinty />
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

import type { ComponentProps } from "react"
import { ActivityIndicator } from "react-native"
import { StyleSheet } from "react-native-unistyles"

type ActivityIndicatorMintyProps = ComponentProps<typeof ActivityIndicator>

export function ActivityIndicatorMinty({
  color,
  ...props
}: ActivityIndicatorMintyProps) {
  return (
    <ActivityIndicator color={color ?? styles.activityColor.color} {...props} />
  )
}

const styles = StyleSheet.create((t) => ({
  activityColor: {
    color: t.colors.primary,
  },
}))

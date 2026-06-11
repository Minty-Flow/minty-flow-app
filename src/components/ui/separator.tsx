import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { View } from "./view"

interface SeparatorProps {
  style?: StyleProp<ViewStyle>
}

export const Separator = ({ style }: SeparatorProps) => {
  return <View native style={[styles.divider, style]} />
}

const styles = StyleSheet.create((theme) => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.onSurface,
    marginVertical: 4,
    // opacity: 0.1,
  },
}))

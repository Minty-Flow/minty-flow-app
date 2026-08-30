import { StyleSheet } from "react-native-unistyles"

import { H_PAD } from "./form.styles"

export const formKindCardStyles = StyleSheet.create((theme) => ({
  card: {
    marginHorizontal: H_PAD,
    padding: 12,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  text: {
    ...theme.typography.bodyMedium,
    color: theme.colors.onSecondary,
  },
}))

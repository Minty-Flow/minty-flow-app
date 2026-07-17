import type { ComponentProps } from "react"
import { StyleSheet } from "react-native-unistyles"

import { Pressable } from "~/components/ui/pressable"

type ListItemProps = ComponentProps<typeof Pressable>

export function ListItem({ style, ...props }: ListItemProps) {
  return (
    <Pressable
      style={
        typeof style === "function"
          ? (state) => [styles.row, style(state)]
          : [styles.row, style]
      }
      {...props}
    />
  )
}

const styles = StyleSheet.create(() => ({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
}))

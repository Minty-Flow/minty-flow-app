import type { ComponentRef, Ref } from "react"
import { View as RNView, type ViewProps as RNViewProps } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { useLanguageStore } from "~/stores/language.store"

type ViewVariant = "transparent" | "muted"

interface ViewProps extends RNViewProps {
  variant?: ViewVariant
  native?: boolean
  ref?: Ref<ComponentRef<typeof RNView>>
}

export const View = ({
  variant = "transparent",
  style,
  native,
  ref,
  ...props
}: ViewProps) => {
  const direction = useLanguageStore((s) => s.direction)
  if (native)
    return (
      <RNView ref={ref} style={[{ direction: direction }, style]} {...props} />
    )

  return (
    <RNView
      ref={ref}
      style={[viewStyles[variant], style, { direction: direction }]}
      {...props}
    />
  )
}

const viewStyles = StyleSheet.create((theme) => ({
  transparent: {
    backgroundColor: "transparent",
  },
  muted: {
    backgroundColor: theme.colors.secondary,
  },
}))

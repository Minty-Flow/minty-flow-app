import type { ComponentRef, Ref } from "react"
import { View as RNView, type ViewProps as RNViewProps } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { useLanguageStore } from "~/stores/language.store"

type ViewVariant =
  | "default"
  | "transparent"
  | "card"
  | "container"
  | "bordered"
  | "muted"
  | "elevated"
  | "section"

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
  default: {
    backgroundColor: theme.colors.surface,
  },
  transparent: {
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius,
    padding: 16,
    _web: {
      boxShadow: theme.colors.boxShadow,
    },
    _ios: {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    _android: {
      elevation: 2,
    },
  },
  container: {
    backgroundColor: theme.colors.surface,
    padding: 16,
  },
  bordered: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
    borderRadius: theme.radius,
  },
  muted: {
    backgroundColor: theme.colors.secondary,
  },
  elevated: {
    backgroundColor: theme.colors.surface,
    _web: {
      boxShadow: theme.colors.boxShadow,
    },
    _ios: {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    _android: {
      elevation: 4,
    },
  },
  section: {
    backgroundColor: theme.colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.onSurface,
  },
}))

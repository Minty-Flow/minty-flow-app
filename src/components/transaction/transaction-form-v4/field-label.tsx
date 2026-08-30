import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

// Off by default: the form derives most labels from the field's content, so the
// section headers ("Category", "Account", …) — and the per-field Clear buttons
// that share their row — are noise unless a host opts in.
const ShowFieldLabelsContext = createContext(false)

export const ShowFieldLabelsProvider = ShowFieldLabelsContext.Provider

export function FieldLabel({
  style,
  children,
}: {
  style?: StyleProp<TextStyle>
  children: ReactNode
}) {
  if (!useContext(ShowFieldLabelsContext)) return null
  return (
    <Text variant="small" style={style}>
      {children}
    </Text>
  )
}

/** The label + Clear-button row. Drops entirely (button included) when labels are off. */
export function FieldLabelRow({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>
  children: ReactNode
}) {
  if (!useContext(ShowFieldLabelsContext)) return null
  return <View style={style}>{children}</View>
}

import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import type { StyleProp, TextStyle } from "react-native"

import { Text } from "~/components/ui/text"

// Off by default: the form derives most labels from the field's content, so the
// section headers ("Category", "Account", …) are noise unless a host opts in.
const ShowFieldLabelsContext = createContext(false)

export const ShowFieldLabelsProvider = ShowFieldLabelsContext.Provider

type Props = {
  style?: StyleProp<TextStyle>
  children: ReactNode
}

export function FieldLabel({ style, children }: Props) {
  if (!useContext(ShowFieldLabelsContext)) return null
  return (
    <Text variant="small" style={style}>
      {children}
    </Text>
  )
}

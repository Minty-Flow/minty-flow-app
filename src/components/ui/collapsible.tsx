// TODO: DEAD CODE — never imported anywhere in the codebase
import { type ReactNode, useState } from "react"
import { TouchableOpacity } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ChevronIcon } from "~/components/ui/chevron-icon"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface CollapsibleProps {
  title: string
  children?: ReactNode
}

export const Collapsible = ({ children, title }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <ChevronIcon direction="trailing" size={18} />

        <Text variant="h3">{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
}))

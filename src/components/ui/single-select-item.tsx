import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
} from "react"
import { StyleSheet } from "react-native-unistyles"

import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"

const SingleSelectContext = createContext(false)

type SingleSelectItemProps = Omit<
  ComponentProps<typeof ListItem>,
  "accessibilityRole" | "accessibilityState" | "children"
> & {
  selected: boolean
  children: ReactNode
}

/**
 * A row in a single-select list. The chosen row gets a tinted background, and
 * any `SingleSelectLabel` inside it turns primary. Multi-select rows use a
 * `Checkbox` instead.
 */
export function SingleSelectItem({
  selected,
  style,
  children,
  ...props
}: SingleSelectItemProps) {
  return (
    <ListItem
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={
        typeof style === "function"
          ? (state) => [style(state), selected && styles.selected]
          : [style, selected && styles.selected]
      }
      {...props}
    >
      <SingleSelectContext.Provider value={selected}>
        {children}
      </SingleSelectContext.Provider>
    </ListItem>
  )
}

/** Text that turns primary when its `SingleSelectItem` is the chosen one. */
export function SingleSelectLabel({
  style,
  ...props
}: ComponentProps<typeof Text>) {
  const selected = useContext(SingleSelectContext)
  return <Text style={[style, selected && styles.selectedLabel]} {...props} />
}

const styles = StyleSheet.create((theme) => ({
  selected: {
    backgroundColor: `${theme.colors.primary}15`,
  },
  selectedLabel: {
    color: theme.colors.primary,
  },
}))

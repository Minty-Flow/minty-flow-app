import { Host } from "@expo/ui"
import { TriStateCheckbox } from "@expo/ui/jetpack-compose"
import { Image } from "@expo/ui/swift-ui"
import { Platform, View } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

interface CheckboxProps {
  checked: boolean
  /** Some, but not all, of a group is selected (a "select all" row). */
  indeterminate?: boolean
}

const SIZE = 24

/**
 * Display-only selection mark: the row it sits in owns the press.
 *
 * Android renders the Material checkbox. iOS has no native checkbox, so it
 * shows an empty ring that fills with a check, via the SwiftUI `Image`
 * already bundled in `@expo/ui` (no extra package).
 */
export function Checkbox({ checked, indeterminate = false }: CheckboxProps) {
  const { theme } = useUnistyles()
  const on = checked || indeterminate

  if (Platform.OS === "android") {
    return (
      <View style={styles.slot} pointerEvents="none">
        <Host matchContents>
          <TriStateCheckbox
            state={indeterminate ? "indeterminate" : checked ? "on" : "off"}
            colors={{
              checkedColor: theme.colors.primary,
              checkmarkColor: theme.colors.onPrimary,
              uncheckedColor: theme.colors.onSecondary,
            }}
          />
        </Host>
      </View>
    )
  }

  return (
    <View
      style={styles.slot}
      pointerEvents="none"
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? "mixed" : checked }}
    >
      <Host matchContents>
        <Image
          systemName={
            indeterminate
              ? "minus.circle.fill"
              : checked
                ? "checkmark.circle.fill"
                : "circle"
          }
          size={SIZE - 2}
          color={on ? theme.colors.primary : theme.colors.onSecondary}
        />
      </Host>
    </View>
  )
}

const styles = StyleSheet.create({
  slot: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
})

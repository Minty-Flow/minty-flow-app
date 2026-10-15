import { Host } from "@expo/ui"
import { RadioButton } from "@expo/ui/jetpack-compose"
import { Image } from "@expo/ui/swift-ui"
import { Platform, View } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

interface RadioProps {
  selected: boolean
}

const SIZE = 24

/**
 * Display-only single-select mark: the row it sits in owns the press.
 *
 * Android renders the Material radio button. iOS single-select lists show a
 * bare trailing check on the chosen row and nothing on the others.
 */
export function Radio({ selected }: RadioProps) {
  const { theme } = useUnistyles()

  if (Platform.OS === "android") {
    return (
      <View style={styles.slot} pointerEvents="none">
        <Host matchContents>
          <RadioButton
            selected={selected}
            colors={{
              selectedColor: theme.colors.primary,
              unselectedColor: theme.colors.onSecondary,
            }}
          />
        </Host>
      </View>
    )
  }

  return (
    <View
      style={styles.slot}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      {selected ? (
        <Host matchContents>
          <Image
            systemName="checkmark"
            size={18}
            color={theme.colors.primary}
          />
        </Host>
      ) : null}
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

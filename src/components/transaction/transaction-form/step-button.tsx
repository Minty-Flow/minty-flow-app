import { useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"

import { formItemsStyles as styles } from "./form-items.styles"

interface Props {
  icon: IconSvgName
  label: string
  onPress: () => void
  disabled?: boolean
}

/** A round −/+ button: 32px to see, 44px to touch. */
export function StepButton({ icon, label, onPress, disabled = false }: Props) {
  const { theme } = useUnistyles()
  return (
    <Pressable
      style={styles.stepButton}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <View style={[styles.stepCircle, disabled && styles.stepDisabled]}>
        <IconSvg name={icon} size={16} color={theme.colors.onSurface} />
      </View>
    </Pressable>
  )
}

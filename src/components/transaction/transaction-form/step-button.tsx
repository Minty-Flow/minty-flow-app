import { useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { Button } from "~/components/ui/button"

interface Props {
  icon: IconSvgName
  label: string
  onPress: () => void
  disabled?: boolean
}

/** A −/+ icon button; the press ripple stays inside the button. */
export function StepButton({ icon, label, onPress, disabled = false }: Props) {
  const { theme } = useUnistyles()
  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <IconSvg name={icon} size={18} color={theme.colors.onSurface} />
    </Button>
  )
}

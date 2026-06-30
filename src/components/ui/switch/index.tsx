import { Switch as RNSwitch } from "react-native"
import { useUnistyles } from "react-native-unistyles"

export interface SwitchProps {
  value?: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
  trackColor?: { false?: string | null; true?: string | null }
  thumbColor?: string
}

export const Switch = ({
  value,
  onValueChange,
  trackColor,
  thumbColor,
  disabled,
}: SwitchProps) => {
  const { theme } = useUnistyles()

  const finalThumbColor =
    thumbColor ?? (value ? theme.colors.onPrimary : theme.colors.onSecondary)

  const finalTrackColor = {
    false: trackColor?.false ?? theme.colors.secondary,
    true: trackColor?.true ?? theme.colors.primary,
  }

  return (
    <RNSwitch
      value={!!value}
      onValueChange={onValueChange}
      trackColor={finalTrackColor}
      thumbColor={finalThumbColor}
      disabled={disabled}
    />
  )
}

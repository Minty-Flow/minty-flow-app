import { Switch as ExpoSwitch, Host } from "@expo/ui/jetpack-compose"
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
}: SwitchProps) => {
  const { theme } = useUnistyles()

  const checkedTrack = trackColor?.true ?? theme.colors.primary
  const uncheckedTrack = trackColor?.false ?? theme.colors.secondary
  const checkedThumb = thumbColor ?? theme.colors.onPrimary
  const uncheckedThumb = thumbColor ?? theme.colors.onSecondary

  return (
    <Host matchContents>
      <ExpoSwitch
        value={!!value}
        onCheckedChange={onValueChange}
        colors={{
          checkedThumbColor: checkedThumb,
          checkedTrackColor: checkedTrack,
          uncheckedThumbColor: uncheckedThumb,
          uncheckedTrackColor: uncheckedTrack,
          uncheckedBorderColor: uncheckedTrack,
        }}
      />
    </Host>
  )
}

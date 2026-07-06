import { Host } from "@expo/ui"
import { Switch as ExpoSwitchAndroid } from "@expo/ui/jetpack-compose"
import { Toggle } from "@expo/ui/swift-ui"
import {
  disabled as disabledModifier,
  labelsHidden,
  tint,
} from "@expo/ui/swift-ui/modifiers"
import { Platform, Switch as RNSwitch } from "react-native"
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

  const checkedTrack = trackColor?.true ?? theme.colors.primary
  const uncheckedTrack = trackColor?.false ?? theme.colors.secondary
  const checkedThumb = thumbColor ?? theme.colors.onPrimary
  const uncheckedThumb = thumbColor ?? theme.colors.onSecondary

  const onColor = trackColor?.true ?? theme.colors.primary

  if (Platform.OS === "android") {
    return (
      <Host matchContents>
        <ExpoSwitchAndroid
          value={!!value}
          onCheckedChange={onValueChange}
          enabled={!disabled}
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

  if (Platform.OS === "ios") {
    return (
      <Host matchContents>
        <Toggle
          isOn={!!value}
          onIsOnChange={onValueChange}
          label=""
          modifiers={[
            tint(onColor),
            labelsHidden(),
            disabledModifier(!!disabled),
          ]}
        />
      </Host>
    )
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

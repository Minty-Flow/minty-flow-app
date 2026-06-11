import { Host, Toggle } from "@expo/ui/swift-ui"
import { labelsHidden, tint } from "@expo/ui/swift-ui/modifiers"
import { useUnistyles } from "react-native-unistyles"

export interface SwitchProps {
  value?: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
  trackColor?: { false?: string | null; true?: string | null }
  thumbColor?: string
}

export const Switch = ({ value, onValueChange, trackColor }: SwitchProps) => {
  const { theme } = useUnistyles()

  const onColor = trackColor?.true ?? theme.colors.primary

  return (
    <Host matchContents>
      <Toggle
        isOn={!!value}
        onIsOnChange={onValueChange}
        label=""
        modifiers={[tint(onColor), labelsHidden()]}
      />
    </Host>
  )
}

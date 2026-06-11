import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

import { Button } from "./ui/button"
import { IconSvg } from "./ui/icon-svg"

export const PrivacyEyeControl = () => {
  const { privacyMode: privacyModeEnabled, togglePrivacyMode: togglePrivacy } =
    useMoneyFormattingStore()
  return (
    <Button variant="ghost" onPress={togglePrivacy}>
      <IconSvg
        name={privacyModeEnabled ? "eye" : "eye-off-outline"}
        size={24}
        // color={privacyModeEnabled ? theme.colors.customColors.semi : undefined}
      />
    </Button>
  )
}

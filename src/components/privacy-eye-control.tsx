import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

import { Button } from "./ui/button"
import { IconSymbol } from "./ui/icon-symbol"

export const PrivacyEyeControl = () => {
  const { privacyMode: privacyModeEnabled, togglePrivacyMode: togglePrivacy } =
    useMoneyFormattingStore()
  return (
    <Button variant="ghost" onPress={togglePrivacy}>
      <IconSymbol
        name={privacyModeEnabled ? "eye" : "eye-off"}
        size={24}
        // color={privacyModeEnabled ? theme.colors.customColors.semi : undefined}
      />
    </Button>
  )
}

import { IconSvg } from "~/components/icons"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"

import { Button } from "./ui/button"

export const PrivacyEyeControl = () => {
  const privacyModeEnabled = useMoneyFormattingStore((s) => s.privacyMode)
  const togglePrivacy = useMoneyFormattingStore((s) => s.togglePrivacyMode)
  return (
    <Button variant="ghost" onPress={togglePrivacy}>
      <IconSvg
        name={privacyModeEnabled ? "eye" : "eye-off-outline"}
        size={24}
        // color={privacyModeEnabled ? theme.colors.semantic.semi : undefined}
      />
    </Button>
  )
}

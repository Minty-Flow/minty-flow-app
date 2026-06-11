import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"

import { filterHeaderStyles } from "./filter-header.styles"

interface PanelClearButtonProps {
  onPress: () => void
  disabled?: boolean
  /** Show close-circle icon (e.g. in Search panel). */
  hideIcon?: boolean
}

export function PanelClearButton({
  onPress,
  disabled = false,
  hideIcon = false,
}: PanelClearButtonProps) {
  const { t } = useTranslation()
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      disabled={disabled}
      style={filterHeaderStyles.clearHit}
    >
      {hideIcon ? null : <IconSvg name="x-outline" size={18} />}
      <Text style={filterHeaderStyles.clearText}>
        {t("common.actions.clear")}
      </Text>
    </Button>
  )
}

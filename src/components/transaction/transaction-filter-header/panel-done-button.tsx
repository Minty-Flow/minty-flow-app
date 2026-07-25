import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

import { filterHeaderStyles } from "./filter-header.styles"

interface PanelDoneButtonProps {
  onPress: () => void
  disabled?: boolean
  hideIcon?: boolean
}

export function PanelDoneButton({
  onPress,
  disabled,
  hideIcon,
}: PanelDoneButtonProps) {
  const { t } = useTranslation()

  return (
    <Button
      variant="ghost"
      onPress={onPress}
      disabled={disabled}
      style={filterHeaderStyles.doneHit}
    >
      {hideIcon ? null : <IconSvg name="check" size={18} />}
      <Text style={filterHeaderStyles.doneText}>
        {t("common.actions.done")}
      </Text>
    </Button>
  )
}

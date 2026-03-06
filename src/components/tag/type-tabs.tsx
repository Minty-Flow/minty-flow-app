import { useTranslation } from "react-i18next"

import { TabsMinty } from "~/components/tabs-minty"
import { TagKindEnum, type TagKindType } from "~/types/tags"

interface TypeTabsProps {
  value: TagKindType
  onValueChange: (value: TagKindType) => void
}

export const TypeTabs = ({ value, onValueChange }: TypeTabsProps) => {
  const { t } = useTranslation()

  return (
    <TabsMinty<TagKindType>
      items={[
        {
          value: TagKindEnum.GENERIC,
          label: t("screens.settings.tags.form.tabs.generic"),
          icon: "tag",
        },
        {
          value: TagKindEnum.LOCATION,
          label: t("screens.settings.tags.form.tabs.location"),
          icon: "map",
        },
        {
          value: TagKindEnum.CONTACT,
          label: t("screens.settings.tags.form.tabs.contact"),
          icon: "account",
        },
      ]}
      activeValue={value}
      onValueChange={onValueChange}
      variant="segmented"
    />
  )
}

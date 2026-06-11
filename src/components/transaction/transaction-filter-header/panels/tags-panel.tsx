import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView, View } from "react-native"

import { DynamicIcon } from "~/components/dynamic-icon"
import { Button } from "~/components/ui/button"
import { Chip } from "~/components/ui/chips"
import { IconSvg } from "~/components/ui/icon-svg"
import { Text } from "~/components/ui/text"
import { NewEnum } from "~/types/new"
import type { Tag } from "~/types/tags"

import { filterHeaderStyles } from "../filter-header.styles"
import { PanelClearButton } from "../panel-clear-button"
import { PanelDoneButton } from "../panel-done-button"
import { CHIPS_PER_ROW } from "../types"
import { chunk } from "../utils"

interface TagsPanelProps {
  tags: Tag[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onClear: () => void
  onDone: () => void
}

export function TagsPanel({
  tags,
  selectedIds,
  onToggle,
  onClear,
  onDone,
}: TagsPanelProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <View>
      {chunk(tags, CHIPS_PER_ROW).map((row) => (
        <ScrollView
          key={row.map((tag) => tag.id).join(",")}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={filterHeaderStyles.chipScrollRow}
          style={filterHeaderStyles.categoryRow}
        >
          {row.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              selected={selectedIds.includes(tag.id)}
              onPress={() => onToggle(tag.id)}
              leading={
                tag.icon ? (
                  <DynamicIcon
                    icon={tag.icon}
                    size={18}
                    colorScheme={tag.colorScheme}
                    variant="raw"
                  />
                ) : (
                  <IconSvg name="tag" size={18} />
                )
              }
            />
          ))}
        </ScrollView>
      ))}
      <View style={filterHeaderStyles.panelHeader}>
        <Button
          variant="ghost"
          style={filterHeaderStyles.clearHit}
          onPress={() =>
            router.push({
              pathname: "/settings/tags/[tagId]",
              params: { tagId: NewEnum.NEW },
            })
          }
        >
          <IconSvg name="tag-plus-outline" size={18} />
          <Text style={filterHeaderStyles.addNewText}>
            {t("screens.settings.tags.newTag")}
          </Text>
        </Button>
        <View style={filterHeaderStyles.panelHeaderActions}>
          <PanelClearButton
            onPress={onClear}
            disabled={selectedIds.length === 0}
          />
          <PanelDoneButton onPress={onDone} />
        </View>
      </View>
    </View>
  )
}

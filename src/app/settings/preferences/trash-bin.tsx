import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native-gesture-handler"
import { StyleSheet } from "react-native-unistyles"

import {
  SettingsRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ChoiceChips } from "~/components/ui/chips"
import { TRASH_RETENTION_CHOICES } from "~/constants/trash-retention"
import { useTrashBinStore } from "~/stores/trash-bin.store"

export default function TrashBinScreen() {
  const router = useRouter()
  const retentionPeriod = useTrashBinStore((s) => s.retentionPeriod)
  const setRetentionPeriod = useTrashBinStore((s) => s.setRetentionPeriod)
  const { t } = useTranslation()
  const retentionMapping = TRASH_RETENTION_CHOICES.map(({ value, days }) => {
    if (days === null) {
      return {
        value,
        label: t("screens.settings.trash.retention.forever"),
      }
    }
    return {
      value,
      label: t("screens.settings.trash.retention.daysCount", { count: days }),
    }
  })
  const choiceLabels = retentionMapping.map((m) => m.label)
  const selectedLabel =
    retentionMapping.find((m) => m.value === retentionPeriod)?.label ||
    retentionPeriod
  const handleView = () => {
    router.push("/settings/trash")
  }
  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
    >
      {/* Retention Period Choices */}
      <ChoiceChips
        title={t("screens.settings.trash.retention.title")}
        description={t("screens.settings.trash.retention.description")}
        style={{
          paddingHorizontal: 20,
        }}
        choices={choiceLabels}
        selectedValue={selectedLabel}
        onSelect={(label) => {
          const selected = retentionMapping.find((m) => m.label === label)
          if (selected) setRetentionPeriod(selected.value)
        }}
      />

      {/* View Removed List */}
      <SettingsRow
        label={t("screens.settings.trash.viewRemovedList")}
        onPress={handleView}
        trailing={
          <ChevronIcon
            direction="trailing"
            size={18}
            color={styles.actionItemIcon.color}
          />
        }
      />
    </ScrollView>
  )
}
const styles = StyleSheet.create((theme) => ({
  actionItemIcon: {
    color: theme.colors.onSecondary,
  },
}))

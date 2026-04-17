import { useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native-gesture-handler"
import { StyleSheet } from "react-native-unistyles"

import { ConfirmModal } from "~/components/confirm-modal"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ChoiceChips } from "~/components/ui/chips"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { destroyAllDeletedTransactionModels } from "~/database/services/transaction-service"
import { useTrashBinStore } from "~/stores/trash-bin.store"
import { Toast } from "~/utils/toast"

const RetentionPeriodEnum = {
  ONE_DAY: "1 day",
  SEVEN_DAYS: "7 days",
  FOURTEEN_DAYS: "14 days",
  THIRTY_DAYS: "30 days",
  NINETY_DAYS: "90 days",
  ONE_EIGHTY_DAYS: "180 days",
  THREE_SIXTY_FIVE_DAYS: "365 days",
  FOREVER: "forever",
} as const

export default function TrashBinScreen() {
  const router = useRouter()
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const retentionPeriod = useTrashBinStore((s) => s.retentionPeriod)
  const setRetentionPeriod = useTrashBinStore((s) => s.setRetentionPeriod)
  const { t } = useTranslation()

  const retentionMapping = Object.values(RetentionPeriodEnum).map((val) => {
    if (val === "forever") {
      return {
        value: val,
        label: t("screens.settings.trash.retention.forever"),
      }
    }

    // Extract the number from the string "30 days" -> 30
    const count = parseInt(val, 10)

    return {
      value: val,
      label:
        count === 1
          ? t("screens.settings.trash.retention.daysCount", { count })
          : t("screens.settings.trash.retention.daysCountPlural", { count }),
    }
  })

  const choiceLabels = retentionMapping.map((m) => m.label)
  const selectedLabel =
    retentionMapping.find((m) => m.value === retentionPeriod)?.label ||
    retentionPeriod

  const handleView = useCallback(() => {
    router.push("/settings/trash")
  }, [router])

  const handleEmptyConfirmed = useCallback(() => {
    destroyAllDeletedTransactionModels()
      .then(() => {
        Toast.success({
          title: t("screens.settings.trash.empty.toast.successTitle"),
          description: t(
            "screens.settings.trash.empty.toast.successDescription",
          ),
        })
      })
      .catch(() => {
        Toast.error({
          title: t("screens.settings.trash.empty.toast.errorTitle"),
          description: t("screens.settings.trash.empty.toast.errorDescription"),
        })
      })
  }, [t]) // Added 't' to dependencies

  return (
    <ScrollView style={styles.container}>
      {/* Retention Period Choices */}
      <ChoiceChips
        title={t("screens.settings.trash.retention.title")}
        description={t("screens.settings.trash.retention.description")}
        style={{
          paddingHorizontal: 20,
        }}
        // choices={Object.values(RetentionPeriodEnum)}
        choices={choiceLabels}
        // selectedValue={retentionPeriod}
        selectedValue={selectedLabel}
        // onSelect={(choice) => setRetentionPeriod(choice)}
        onSelect={(label) => {
          const selected = retentionMapping.find((m) => m.label === label)
          if (selected) setRetentionPeriod(selected.value) // Saves English "30 days"
        }}
      />

      {/* View Removed List */}
      <Pressable style={styles.actionItem} onPress={handleView}>
        <View style={styles.actionItemLeft}>
          <View style={styles.actionItemContent}>
            <View style={styles.titleRow}>
              <Text variant="default" style={styles.actionItemTitle}>
                {t("screens.settings.trash.viewRemovedList")}
              </Text>
            </View>
          </View>
        </View>

        <ChevronIcon
          direction={"trailing"}
          size={18}
          color={styles.actionItemIcon.color}
        />
      </Pressable>

      {/* Empty Trash Bin */}
      <Pressable
        style={styles.actionItem}
        onPress={() => {
          setConfirmModalVisible(true)
        }}
      >
        <View style={styles.actionItemLeft}>
          <View style={styles.actionItemContent}>
            <View style={styles.titleRow}>
              <Text variant="default" style={styles.actionTrashItemTitle}>
                {t("screens.settings.trash.empty.label")}
              </Text>
            </View>
          </View>
        </View>
        <IconSvg
          name="trash"
          size={18}
          color={styles.actionTrashItemIcon.color}
        />
      </Pressable>

      {/* Empty Trash Modal */}
      <ConfirmModal
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
        onConfirm={handleEmptyConfirmed}
        title={t("screens.settings.trash.empty.modal.title")}
        description={t("screens.settings.trash.empty.modal.description")}
        confirmLabel={t("screens.settings.trash.empty.modal.confirm")}
        cancelLabel={t("screens.settings.trash.empty.modal.cancel")}
        variant="destructive"
        icon="trash"
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 15,
  },
  actionItemContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionItemTitle: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  actionTrashItemTitle: {
    fontSize: theme.typography.bodyLarge.fontSize,
    fontWeight: "600",
    color: theme.colors.error,
  },
  actionItemIcon: {
    color: theme.colors.onSecondary,
  },
  actionTrashItemIcon: {
    color: theme.colors.error,
  },
}))

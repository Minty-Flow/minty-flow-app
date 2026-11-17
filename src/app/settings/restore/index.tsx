import { useLocalSearchParams, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { useBackupImport } from "~/components/backup/use-backup-import"
import { DataCard } from "~/components/data-card"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useOnboardingStore } from "~/stores/onboarding.store"

export default function RestoreScreen() {
  const { t } = useTranslation()
  const router = useRouter()

  // Onboarding sends the user here to restore a backup instead of starting
  // fresh; after the restore they land in the app, not back in onboarding.
  const { fromOnboarding } = useLocalSearchParams<{ fromOnboarding?: string }>()
  const importOnly = fromOnboarding === "true"
  const setOnboardingCompleted = useOnboardingStore((s) => s.setCompleted)

  // Arrived from onboarding: the restore was the whole errand, so land in the
  // app. Navigating inside onConfirm would tear the sheet down mid-close, and
  // the stack must be cleared first or Back returns to onboarding, where
  // "Start fresh" would add presets on top of the import.
  function handleImported() {
    // The import replaced the data, so onboarding has nothing left to offer.
    // A no-op when onboarding is already over.
    setOnboardingCompleted()
    if (!importOnly) return
    router.dismissAll()
    router.replace("/")
  }

  const { start, isPicking, sheet } = useBackupImport(handleImported)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>
        {t("screens.settings.dataManagement.sections.import")}
      </Text>
      <Text style={styles.sectionHint}>
        {t("screens.settings.dataManagement.sections.importHint")}
      </Text>
      <View style={styles.grid}>
        <DataCard
          icon="database-import-outline"
          title={t("screens.settings.dataManagement.importJson")}
          description={t("screens.settings.dataManagement.importJsonDesc")}
          onPress={() => start()}
          loading={isPicking}
        />
      </View>

      {sheet}
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 60,
  },
  sectionHint: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSecondary,
    marginBottom: 12,
    paddingHorizontal: 4,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: theme.typography.labelXSmall.fontSize,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.colors.semantic.semi,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
}))

import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ToggleItem } from "~/components/toggle-item"
import { Chip } from "~/components/ui/chips"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useAccounts } from "~/database/drizzle/read-models/account-read-model"
import { useSafeToSpendStore } from "~/stores/safe-to-spend.store"

export default function SafeToSpendPreferencesScreen() {
  const { t } = useTranslation()
  const enabled = useSafeToSpendStore((s) => s.enabled)
  const setEnabled = useSafeToSpendStore((s) => s.setEnabled)
  const cadence = useSafeToSpendStore((s) => s.cadence)
  const setCadence = useSafeToSpendStore((s) => s.setCadence)
  const includedAccountIds = useSafeToSpendStore((s) => s.includedAccountIds)
  const setIncludedAccountIds = useSafeToSpendStore(
    (s) => s.setIncludedAccountIds,
  )
  const toggleAccount = useSafeToSpendStore((s) => s.toggleAccount)

  const accounts = useAccounts()
  const eligible = accounts.filter((a) => !a.isArchived)
  const allEligible = includedAccountIds.length === 0

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <ToggleItem
          icon="wallet-outline"
          title={t("screens.settings.preferences.safeToSpend.showOnHome")}
          value={enabled}
          onValueChange={setEnabled}
        />
      </View>

      <View style={styles.section}>
        <Text variant="small" style={styles.sectionLabel}>
          {t("screens.settings.preferences.safeToSpend.cadence")}
        </Text>
        <View style={styles.chipsRow}>
          <Chip
            label={t("screens.settings.preferences.safeToSpend.daily")}
            selected={cadence === "daily"}
            hideCheck
            onPress={() => setCadence("daily")}
          />
          <Chip
            label={t("screens.settings.preferences.safeToSpend.weekly")}
            selected={cadence === "weekly"}
            hideCheck
            onPress={() => setCadence("weekly")}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="small" style={styles.sectionLabel}>
          {t("screens.settings.preferences.safeToSpend.accounts")}
        </Text>
        <ToggleItem
          icon="wallet-outline"
          title={t("screens.settings.preferences.safeToSpend.allAccounts")}
          description={t(
            "screens.settings.preferences.safeToSpend.allAccountsHint",
          )}
          value={allEligible}
          onValueChange={(all) => {
            setIncludedAccountIds(all ? [] : eligible.map((a) => a.id))
          }}
        />
        {!allEligible &&
          eligible.map((account) => (
            <ToggleItem
              key={account.id}
              icon="wallet-outline"
              title={account.name}
              value={includedAccountIds.includes(account.id)}
              onValueChange={() => toggleAccount(account.id)}
            />
          ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingTop: 16,
    gap: 12,
    paddingBottom: 40,
  },
  section: {
    marginVertical: 6,
    gap: 8,
  },
  sectionLabel: {
    marginHorizontal: 20,
    color: theme.colors.onSurface,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
  },
}))

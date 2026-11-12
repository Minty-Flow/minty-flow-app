import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"

import {
  SettingsSection,
  SettingsSwitchRow,
  settingsStyles,
} from "~/components/settings/settings-list"
import { useMoneyFormattingStore } from "~/stores/money-formatting.store"
import { useWhatsNewStore } from "~/stores/whats-new.store"

export default function HomeScreenSettings() {
  const { t } = useTranslation()
  const showBalanceOnHome = useMoneyFormattingStore((s) => s.showBalanceOnHome)
  const setShowBalanceOnHome = useMoneyFormattingStore(
    (s) => s.setShowBalanceOnHome,
  )
  const markSeen = useWhatsNewStore((s) => s.markHomeScreenSeen)
  // Opening the screen is the discovery: the "New" badges go away.
  useEffect(() => markSeen(), [markSeen])

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
    >
      <SettingsSection>
        <SettingsSwitchRow
          label={t(
            "screens.settings.preferences.appearance.homeScreen.showBalanceOnHome.label",
          )}
          description={t(
            "screens.settings.preferences.appearance.homeScreen.showBalanceOnHome.description",
          )}
          value={showBalanceOnHome}
          onValueChange={setShowBalanceOnHome}
        />
      </SettingsSection>
    </ScrollView>
  )
}

import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"

import { settingsStyles } from "~/components/settings/settings-list"
import { ToggleItem } from "~/components/toggle-item"
import { InfoBanner } from "~/components/ui/info-banner"
import { View } from "~/components/ui/view"
import { useAndroidSoundStore } from "~/stores/android-sound.store"

export default function SoundScreen() {
  const { t } = useTranslation()
  const setSoundEnabled = useAndroidSoundStore((s) => s.setSoundEnabled)
  const disableSound = useAndroidSoundStore((s) => s.disableSound)

  return (
    <ScrollView
      style={settingsStyles.screen}
      contentContainerStyle={settingsStyles.content}
    >
      <View>
        <ToggleItem
          icon={
            disableSound
              ? "device-mobile-off-outline"
              : "device-mobile-vibration-outline"
          }
          title={t(
            "screens.settings.preferences.buttonFeedback.soundHaptic.title",
          )}
          value={!disableSound}
          onValueChange={setSoundEnabled}
        />
        {!disableSound && (
          <InfoBanner
            text={t("screens.settings.preferences.buttonFeedback.systemInfo")}
          />
        )}
      </View>
    </ScrollView>
  )
}

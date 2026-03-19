import { CommonActions } from "@react-navigation/native"
import { useNavigation, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { AppData } from "~/constants/app-data"
import { useOnboardingStore } from "~/stores/onboarding.store"

export default function OnboardingStartScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()
  const { setCompleted } = useOnboardingStore()

  const handleImport = () => {
    setCompleted()
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "(tabs)" }, { name: "settings/data-management" }],
      }),
    )
  }

  const handleFresh = () => {
    setCompleted()
    router.push("/onboarding/accounts")
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Pressable style={styles.card} onPress={handleImport}>
          <View style={styles.cardIconBox}>
            <IconSvg name="restore" size={56} />
          </View>
          <Text style={styles.cardTitle}>
            {t("onboarding.start.import.title")}
          </Text>
          <Text style={styles.cardDescription}>
            {t("onboarding.start.import.description", {
              name: AppData.name,
            })}
          </Text>
        </Pressable>

        <Pressable style={styles.card} onPress={handleFresh}>
          <View style={styles.cardIconBox}>
            <IconSvg name="sparkles" size={56} />
          </View>
          <Text style={styles.cardTitle}>
            {t("onboarding.start.fresh.title")}
          </Text>
          <Text style={styles.cardDescription}>
            {t("onboarding.start.fresh.description", {
              name: AppData.name,
            })}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    padding: 24,
    gap: 12,
  },
  cardIconBox: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  cardDescription: {
    fontSize: 14,
    color: theme.colors.onSecondary,
    lineHeight: 20,
  },
}))

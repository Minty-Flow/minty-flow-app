import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { KeyboardStickyViewMinty } from "~/components/keyboard-sticky-view-minty"
import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input } from "~/components/ui/input"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useOnboardingStore } from "~/stores/onboarding.store"
import { useProfileStore } from "~/stores/profile.store"
import { getInitials } from "~/utils/string-utils"
import { Toast } from "~/utils/toast"

export default function EditProfileScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { fromOnboarding } = useLocalSearchParams<{ fromOnboarding?: string }>()
  const isFromOnboarding = fromOnboarding === "true"
  const { setCompleted } = useOnboardingStore()
  const { name, imageUri, setName, setImageUri } = useProfileStore()

  const [localName, setLocalName] = useState(() => name)
  const [localImageUri, setLocalImageUri] = useState<string | null>(
    () => imageUri,
  )

  const displayName = localName || "?"
  const initials = getInitials(displayName)

  const handlePickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Toast.warn({
        title: t("profile.edit.permission.title"),
        description: t("profile.edit.permission.description"),
      })
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setLocalImageUri(result.assets[0].uri)
    }
  }

  const handleRemoveImage = () => {
    setLocalImageUri(null)
  }

  const handleSave = () => {
    setName(localName)
    setImageUri(localImageUri)
    if (isFromOnboarding) {
      setCompleted()
      router.dismissAll()
      router.replace("/(tabs)")
    } else {
      router.back()
    }
  }

  return (
    <View style={styles.container}>
      {isFromOnboarding && (
        <Stack.Screen options={{ title: t("onboarding.profile.title") }} />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Pressable onPress={handlePickImage} style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {localImageUri ? (
                <Image
                  source={{ uri: localImageUri }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
            <View style={styles.cameraIconContainer}>
              <IconSvg name="camera" size={20} />
            </View>
          </Pressable>
          {localImageUri && (
            <Pressable onPress={handleRemoveImage} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>
                {t("profile.edit.removePhoto")}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Name Input Section */}
        <View style={styles.inputSection}>
          <Text variant="small" style={styles.label}>
            {t("profile.edit.nameLabel")}
          </Text>
          <Input
            value={localName}
            onChangeText={setLocalName}
            placeholder={t("profile.edit.namePlaceholder")}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <KeyboardStickyViewMinty>
        <View style={styles.buttonContainer}>
          <Button onPress={handleSave} style={styles.saveButton}>
            <Text>
              {isFromOnboarding
                ? t("onboarding.actions.done")
                : t("common.actions.save")}
            </Text>
          </Button>
        </View>
      </KeyboardStickyViewMinty>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
    padding: 10,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: theme.radius,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "600",
    color: theme.colors.surface,
    lineHeight: 56,
    textAlign: "center",
    includeFontPadding: false,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  removeButtonText: {
    fontSize: 14,
    color: theme.colors.error,
    fontWeight: "600",
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
  },
  saveButton: {
    width: "100%",
  },
}))

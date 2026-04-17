import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useProfileStore } from "~/stores/profile.store"
import { getInitials } from "~/utils/string-utils"

export const ProfileSection = () => {
  const router = useRouter()
  const { name, imageUri } = useProfileStore()

  const { theme } = useUnistyles()

  const displayName = name || "?"
  const initials = getInitials(displayName)

  const handlePress = () => {
    router.push("/settings/edit-profile")
  }

  return (
    <View style={styles.profileSection}>
      <Pressable style={styles.profileInfo} onPress={handlePress}>
        <View
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.avatarImage}
              contentFit="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{initials}</Text>
          )}
        </View>
        <Text variant="h3" style={styles.profileName}>
          {displayName}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  profileSection: {
    marginInline: 20,
    marginBottom: 20,
  },
  profileInfo: {
    paddingVertical: 20,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: theme.radius,
    overflow: "hidden",
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: theme.radius,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    ...theme.typography.displayLarge,
    fontWeight: "600",
    color: theme.colors.surface,
    lineHeight: 56,
    textAlign: "center",
    includeFontPadding: false,
  },
  profileName: {
    ...theme.typography.titleMedium,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
}))

import { Image } from "expo-image"
import { Text as RNText } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { type IconSize, IconSvg, type IconSvgName } from "~/components/icons"
import { View } from "~/components/ui/view"
import type { MintyThemeColors } from "~/styles/theme/types"
import { isImageUrl } from "~/utils/is-image-url"
import { isSingleEmojiOrLetter } from "~/utils/is-single-emoji-or-letter"

interface DynamicIconProps {
  icon?: string | null
  size?: IconSize
  colorScheme?: MintyThemeColors | null
  color?: string
  variant?: "badge" | "raw"
}

export function DynamicIcon({
  icon,
  size = 24,
  colorScheme,
  color: explicitColor,
  variant = "badge",
}: DynamicIconProps) {
  const color = explicitColor || colorScheme?.primary || undefined
  const bgColor = colorScheme?.secondary || undefined
  const containerSize = size * 1.5

  const isRaw = variant === "raw"

  // ---------- Image ----------
  // Local picked images (profile/avatars) arrive as file:// URIs, which isImageUrl
  // rejects on purpose (clipboard-paste guard). They're trusted here, so accept them.
  if (icon && (isImageUrl(icon) || icon.startsWith("file://"))) {
    if (isRaw) {
      return (
        <Image
          source={{ uri: icon }}
          style={[styles.image, { width: size, height: size }]}
          contentFit="contain"
        />
      )
    }

    return (
      <View
        style={[
          styles.imageContainer,
          { width: containerSize, height: containerSize },
          bgColor && { backgroundColor: bgColor },
        ]}
      >
        <Image
          source={{ uri: icon }}
          style={styles.image}
          contentFit="contain"
        />
      </View>
    )
  }

  // ---------- Emoji / Letter ----------
  if (icon && isSingleEmojiOrLetter(icon)) {
    if (isRaw) {
      return (
        <RNText
          style={[styles.emojiText, { fontSize: size }, color && { color }]}
        >
          {icon}
        </RNText>
      )
    }

    return (
      <View
        style={[
          styles.emojiContainer,
          { width: containerSize, height: containerSize },
          bgColor && { backgroundColor: bgColor },
        ]}
      >
        <RNText
          style={[styles.emojiText, { fontSize: size }, color && { color }]}
        >
          {icon}
        </RNText>
      </View>
    )
  }

  // ---------- Fallback ----------
  if (!icon) {
    if (isRaw) {
      return <IconSvg name="circle-dot" size={size} color={color} />
    }

    return (
      <View
        style={[
          styles.iconContainer,
          { width: containerSize, height: containerSize },
          bgColor && { backgroundColor: bgColor },
        ]}
      >
        <IconSvg name="circle-dot" size={size} color={color} />
      </View>
    )
  }

  // ---------- IconSvg ----------
  if (isRaw) {
    return <IconSvg name={icon as IconSvgName} size={size} color={color} />
  }

  return (
    <View
      style={[
        styles.iconContainer,
        { width: containerSize, height: containerSize },
        bgColor && { backgroundColor: bgColor },
      ]}
    >
      <IconSvg name={icon as IconSvgName} size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
  },
  emojiText: {
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius,
    backgroundColor: theme.colors.secondary,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
    padding: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius,
  },
}))

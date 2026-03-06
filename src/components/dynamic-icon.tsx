import { Image } from "expo-image"
import { Text as RNText } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import {
  type IconSize,
  IconSymbol,
  type IconSymbolName,
} from "~/components/ui/icon-symbol"
import { View } from "~/components/ui/view"
import type { MintyColorScheme } from "~/styles/theme/types"
import { isImageUrl } from "~/utils/is-image-url"
import { isSingleEmojiOrLetter } from "~/utils/is-single-emoji-or-letter"

interface DynamicIconProps {
  icon?: string | null
  size?: IconSize
  colorScheme?: MintyColorScheme | null
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
  const containerSize = size * 2

  const isRaw = variant === "raw"

  // ---------- Image ----------
  if (icon && isImageUrl(icon)) {
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
      return <IconSymbol name="adjust" size={size} color={color} />
    }

    return (
      <View
        style={[
          styles.iconContainer,
          { width: containerSize, height: containerSize },
          bgColor && { backgroundColor: bgColor },
        ]}
      >
        <IconSymbol name="adjust" size={size} color={color} />
      </View>
    )
  }

  // ---------- IconSymbol ----------
  if (isRaw) {
    return (
      <IconSymbol name={icon as IconSymbolName} size={size} color={color} />
    )
  }

  return (
    <View
      style={[
        styles.iconContainer,
        { width: containerSize, height: containerSize },
        bgColor && { backgroundColor: bgColor },
      ]}
    >
      <IconSymbol name={icon as IconSymbolName} size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.colors.radius,
  },
  emojiText: {
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.colors.radius,
    backgroundColor: theme.colors.secondary,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.colors.radius,
    overflow: "hidden",
    backgroundColor: theme.colors.secondary,
    padding: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: theme.colors.radius,
  },
}))

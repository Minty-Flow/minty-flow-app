import { useRouter } from "expo-router"
import { StyleSheet } from "react-native-unistyles"

import { getThemeStrict } from "~/styles/theme/registry"
import type { Tag } from "~/types/tags"

import { DynamicIcon } from "../dynamic-icon"
import { ChevronIcon } from "../ui/chevron-icon"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { View } from "../ui/view"

interface TagCardProps {
  tag: Tag
}

export const TagCard = ({ tag }: TagCardProps) => {
  const router = useRouter()
  const colorScheme = getThemeStrict(tag.colorSchemeName)

  const handlePress = () => {
    router.push({
      pathname: "/settings/tags/[tagId]",
      params: { tagId: tag.id },
    })
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View
        style={[
          styles.iconContainer,
          colorScheme?.secondary && { backgroundColor: colorScheme.secondary },
        ]}
      >
        <DynamicIcon
          icon={tag.icon || "tag"}
          size={24}
          colorScheme={colorScheme}
        />
      </View>

      <View style={styles.content}>
        <Text variant="default" style={styles.name}>
          {tag.name}
        </Text>
        <Text variant="small" style={styles.type}>
          {tag.type.toUpperCase()}
        </Text>
      </View>

      <ChevronIcon
        direction="trailing"
        size={20}
        color={styles.chevron.color}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,

    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  type: {
    fontSize: theme.typography.labelSmall.fontSize,
    color: theme.colors.customColors.semi,
    letterSpacing: 0.5,
  },
  chevron: {
    color: theme.colors.customColors.semi,
  },
}))

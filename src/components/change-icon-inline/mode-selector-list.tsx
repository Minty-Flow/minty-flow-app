import { useTranslation } from "react-i18next"

import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { changeIconInlineStyles as styles } from "./change-icon-inline.styles"

interface ModeSelectorListProps {
  onIconPress: () => void
  onEmojiLetterPress: () => void
  onImagePress: () => void
}

export function ModeSelectorList({
  onIconPress,
  onEmojiLetterPress,
  onImagePress,
}: ModeSelectorListProps) {
  const { t } = useTranslation()
  return (
    <>
      <Pressable
        style={({ pressed }: { pressed: boolean }) => [
          styles.item,
          pressed && styles.itemPressed,
        ]}
        onPress={onIconPress}
      >
        <View style={styles.itemLeft}>
          <IconSvg name="category-outline" size={24} />
          <Text variant="large" style={styles.itemTitle}>
            {t("components.iconPicker.iconMode")}
          </Text>
        </View>
        <ChevronIcon
          direction="trailing"
          size={20}
          style={styles.itemChevron}
        />
      </Pressable>
      <Pressable
        style={({ pressed }: { pressed: boolean }) => [
          styles.item,
          pressed && styles.itemPressed,
        ]}
        onPress={onEmojiLetterPress}
      >
        <View style={styles.itemLeft}>
          <IconSvg name="tag" size={24} />
          <Text variant="large" style={styles.itemTitle}>
            {t("components.iconPicker.emojiLetter")}
          </Text>
        </View>
        <ChevronIcon
          direction="trailing"
          size={20}
          style={styles.itemChevron}
        />
      </Pressable>
      <Pressable
        style={({ pressed }: { pressed: boolean }) => [
          styles.item,
          pressed && styles.itemPressed,
        ]}
        onPress={onImagePress}
      >
        <View style={styles.itemLeft}>
          <IconSvg name="photo" size={24} />
          <Text variant="large" style={styles.itemTitle}>
            {t("components.iconPicker.imageMode")}
          </Text>
        </View>
        <ChevronIcon
          direction="trailing"
          size={20}
          style={styles.itemChevron}
        />
      </Pressable>
    </>
  )
}

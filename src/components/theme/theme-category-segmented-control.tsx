import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { THEME_GROUPS } from "~/styles/theme/registry"

import { themeScreenStyles } from "./theme.styles"

interface ThemeCategorySegmentedControlProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function ThemeCategorySegmentedControl({
  selectedCategory,
  onCategoryChange,
}: ThemeCategorySegmentedControlProps) {
  return (
    <View style={themeScreenStyles.segmentedControl}>
      {Object.keys(THEME_GROUPS).map((category) => {
        const isSelected = selectedCategory === category
        return (
          <Pressable
            key={category}
            style={[
              themeScreenStyles.segment,
              isSelected && themeScreenStyles.segmentSelected,
            ]}
            onPress={() => onCategoryChange(category)}
          >
            <Text
              style={[
                themeScreenStyles.segmentText,
                isSelected && themeScreenStyles.segmentTextSelected,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

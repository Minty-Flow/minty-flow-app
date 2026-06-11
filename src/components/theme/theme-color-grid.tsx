import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import type { ThemeMode } from "~/stores/theme.store"
import type { MintyColorScheme } from "~/styles/theme/types"

import { themeScreenStyles } from "./theme.styles"

interface ThemeColorGridProps {
  schemes: MintyColorScheme[]
  selectedThemeName: string
  onThemeSelect: (mode: ThemeMode) => void
}

export function ThemeColorGrid({
  schemes,
  selectedThemeName,
  onThemeSelect,
}: ThemeColorGridProps) {
  return (
    <View style={themeScreenStyles.colorGrid}>
      {schemes.map((scheme) => {
        const isSelected = selectedThemeName === scheme.name
        return (
          <Pressable
            key={scheme.name}
            style={[
              themeScreenStyles.colorOption,
              isSelected && themeScreenStyles.colorOptionSelected,
            ]}
            onPress={() => onThemeSelect(scheme.name as ThemeMode)}
          >
            <View
              style={[
                themeScreenStyles.colorCircle,
                { backgroundColor: scheme.primary },
              ]}
            />
            {isSelected && <View style={themeScreenStyles.checkmark} />}
          </Pressable>
        )
      })}
    </View>
  )
}

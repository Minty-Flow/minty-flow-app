import { useUnistyles } from "react-native-unistyles"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { ThemeVariant, VariantOption } from "~/styles/theme/types"

import { themeScreenStyles } from "./theme.styles"

interface ThemeVariantPillsProps {
  variants: VariantOption[]
  selectedVariant: ThemeVariant
  onVariantChange: (variant: ThemeVariant) => void
}

export function ThemeVariantPills({
  variants,
  selectedVariant,
  onVariantChange,
}: ThemeVariantPillsProps) {
  const { theme } = useUnistyles()

  return (
    <View style={themeScreenStyles.variantPills}>
      {variants.map((variant) => {
        const isSelected = selectedVariant === variant.label
        const iconColor = isSelected
          ? theme.colors.onPrimary
          : theme.colors.onSurface
        return (
          <Pressable
            key={variant.label}
            style={[
              themeScreenStyles.pill,
              isSelected && themeScreenStyles.pillSelected,
            ]}
            onPress={() => onVariantChange(variant.label)}
          >
            <View style={themeScreenStyles.pillContent}>
              {variant.icon ? (
                <IconSvg
                  name={variant.icon as IconSvgName}
                  size={16}
                  color={iconColor}
                />
              ) : null}
              <Text
                style={[
                  themeScreenStyles.pillText,
                  isSelected && themeScreenStyles.pillTextSelected,
                ]}
              >
                {variant.label}
              </Text>
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

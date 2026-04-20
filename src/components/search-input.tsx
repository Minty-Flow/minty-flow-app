import { useTranslation } from "react-i18next"
import { View, type ViewStyle } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input, type InputProps } from "~/components/ui/input"

interface SearchInputProps extends InputProps {
  onClear?: () => void
  containerStyle?: ViewStyle
}

export const SearchInput = ({
  value,
  onChangeText,
  onClear,
  placeholder,
  containerStyle,
  style,
  ...props
}: SearchInputProps) => {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const resolvedPlaceholder =
    placeholder ?? t("components.searchInput.placeholder")
  return (
    <View style={[styles.container, containerStyle]}>
      <IconSvg
        name="search"
        size={20}
        style={styles.searchIcon}
        color={theme.colors.onSecondary}
      />
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={resolvedPlaceholder}
        style={[styles.input, style]}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onSecondary}
        {...props}
      />
      {value && value.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onPress={onClear}
          style={styles.clearButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <IconSvg name="x" size={20} color={theme.colors.onSecondary} />
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchIcon: {
    color: theme.colors.onSecondary,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    fontSize: theme.typography.labelLarge.fontSize,
    shadowColor: "transparent",
    elevation: 0,
    paddingHorizontal: 0,
    color: theme.colors.onSecondary,
  },
  clearButton: {
    width: 36,
    height: 36,
  },
}))

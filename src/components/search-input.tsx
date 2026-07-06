import { useTranslation } from "react-i18next"
import { useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSvg } from "~/components/ui/icon-svg"
import { Input, type InputProps } from "~/components/ui/input"

interface SearchInputProps extends InputProps {
  onClear?: () => void
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder,
  ...props
}: SearchInputProps) {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  return (
    <Input
      {...props}
      variant="search"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      placeholder={placeholder ?? t("components.searchInput.placeholder")}
      left={
        <IconSvg
          name="search-outline"
          size={20}
          color={theme.colors.semantic.semi}
        />
      }
      right={
        value ? (
          <Button
            variant="ghost"
            size="icon"
            onPress={onClear}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <IconSvg
              name="x-outline"
              size={18}
              color={theme.colors.semantic.semi}
            />
          </Button>
        ) : undefined
      }
    />
  )
}

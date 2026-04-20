import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, Modal, Pressable, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"
import {
  MINTY_SVGS,
  type MintyIconData,
} from "~/constants/minty-icons-selection"
import type { MintyColorScheme } from "~/styles/theme/types"

import { DynamicIcon } from "../dynamic-icon"
import { IconSvg, type IconSvgName } from "../ui/icon-svg"

interface IconSelectionModalProps {
  visible: boolean
  onClose: () => void
  onIconSelected?: (icon: string | null) => void
  initialIcon?: string | null
  colorScheme?: MintyColorScheme | null
}

// Grid layout configuration
const COLUMNS = 6

const IconItem = memo(
  ({
    iconName,
    isSelected,
    onPress,
    color,
    selectedColor,
  }: {
    iconName: string
    isSelected: boolean
    onPress: (name: string) => void
    color: string
    selectedColor: string
  }) => {
    return (
      <Pressable
        style={[
          styles.iconItem,
          isSelected && { backgroundColor: selectedColor },
        ]}
        onPress={() => onPress(iconName)}
      >
        <IconSvg name={iconName as IconSvgName} size={28} color={color} />
      </Pressable>
    )
  },
)

/**
 * SearchHeader - Memoised search input for the icon modal
 */
const SearchHeader = memo(
  ({
    searchQuery,
    onSearchChange,
    onClear,
    placeholderTextColor,
  }: {
    searchQuery: string
    onSearchChange: (text: string) => void
    onClear: () => void
    placeholderTextColor: string
  }) => {
    const { t } = useTranslation()
    return (
      <View style={styles.searchContainer}>
        <IconSvg name="search" size={20} color={styles.searchIcon.color} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("components.iconPicker.searchPlaceholder")}
          placeholderTextColor={placeholderTextColor}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={onClear}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.clearButton}
          >
            <IconSvg name="x" size={20} color={placeholderTextColor} />
          </Pressable>
        )}
      </View>
    )
  },
)

/**
 * Fuzzy search: scores icons by name / keyword match, returns top 100.
 * Extracted to module level as it is a pure function.
 */
const searchIcons = (
  icons: MintyIconData[],
  query: string,
): MintyIconData[] => {
  if (!query.trim()) {
    return icons
  }

  const lowerQuery = query.toLowerCase().trim()

  const scoredIcons = icons.map((icon) => {
    let score = 0
    const iconNameLower = icon.name.toLowerCase()

    if (iconNameLower === lowerQuery) {
      score += 100
    } else if (iconNameLower.startsWith(lowerQuery)) {
      score += 50
    } else if (iconNameLower.includes(lowerQuery)) {
      score += 25
    }

    for (const keyword of icon.keywords) {
      const keywordLower = keyword.toLowerCase()
      if (keywordLower === lowerQuery) {
        score += 80
      } else if (keywordLower.startsWith(lowerQuery)) {
        score += 40
      } else if (keywordLower.includes(lowerQuery)) {
        score += 20
      }
    }

    return { icon, score }
  })

  return scoredIcons
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 100)
    .map(({ icon }) => icon)
}

/**
 * IconSelectionModal – full-screen modal icon picker with fuzzy search.
 *
 * Controlled by the `visible` prop; call `onClose` to dismiss.
 */
export const IconSelectionModal = ({
  visible,
  onClose,
  colorScheme,
  onIconSelected,
  initialIcon,
}: IconSelectionModalProps) => {
  const { t } = useTranslation()
  const { theme } = useUnistyles()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    initialIcon || null,
  )

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset state when modal opens
  const handleShow = useCallback(() => {
    setSelectedIcon(initialIcon || null)
    setSearchQuery("")
    setDebouncedQuery("")
  }, [initialIcon])

  const availableIcons = useMemo(
    () => searchIcons(MINTY_SVGS, debouncedQuery),
    [debouncedQuery],
  )

  const handleIconSelect = useCallback((iconName: string) => {
    setSelectedIcon(iconName)
  }, [])

  const keyExtractor = useCallback((item: MintyIconData) => item.name, [])

  const handleDone = useCallback(() => {
    if (selectedIcon) {
      onIconSelected?.(selectedIcon)
      onClose()
    }
  }, [selectedIcon, onIconSelected, onClose])

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text)
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
  }, [])

  const renderIconItem = useCallback(
    ({ item }: { item: MintyIconData }) => (
      <IconItem
        iconName={item.name}
        isSelected={selectedIcon === item.name}
        onPress={handleIconSelect}
        color={theme.colors.onSurface}
        selectedColor={theme.colors.secondary}
      />
    ),
    [selectedIcon, handleIconSelect, theme.colors],
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      onShow={handleShow}
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <SafeAreaView style={styles.modalContainer} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {t("components.iconPicker.title")}
          </Text>
          <Button variant="secondary" onPress={onClose}>
            <Text>{t("common.actions.cancel")}</Text>
          </Button>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholderTextColor={theme.colors.onSecondary}
          />
        </View>

        {/* Icon grid */}
        <FlatList
          data={availableIcons}
          numColumns={COLUMNS}
          renderItem={renderIconItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator
          initialNumToRender={60}
          maxToRenderPerBatch={60}
          windowSize={7}
          removeClippedSubviews={false}
          bounces
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="always"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSvg
                name="alert-circle"
                size={48}
                color={theme.colors.onSecondary}
              />
              <Text variant="p" style={styles.emptyStateText}>
                {t("components.iconPicker.noIconsFound")}
              </Text>
              <Text variant="p" style={styles.emptyStateSubtext}>
                {t("components.iconPicker.tryDifferentSearch")}
              </Text>
            </View>
          }
        />

        {/* Footer: preview + Done */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {selectedIcon && (
              <View style={styles.selectedPreview}>
                <DynamicIcon
                  icon={selectedIcon}
                  size={20}
                  colorScheme={colorScheme}
                />
                <Text style={styles.selectedIconName}>{selectedIcon}</Text>
              </View>
            )}
          </View>
          <Button
            variant="default"
            onPress={handleDone}
            disabled={!selectedIcon}
          >
            <Text>{t("common.actions.done")}</Text>
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create((theme) => ({
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.customColors.semi,
  },
  headerTitle: {
    ...theme.typography.headlineSmall,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  searchWrapper: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.bodyLarge.fontSize,
    color: theme.colors.onSurface,
    padding: 0,
    minHeight: 24,
  },
  searchIcon: {
    color: theme.colors.onSecondary,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    color: theme.colors.onSecondary,
    ...theme.typography.titleSmall,
  },
  emptyStateSubtext: {
    color: theme.colors.onSecondary,
    fontSize: theme.typography.labelLarge.fontSize,
    opacity: 0.7,
  },
  iconItem: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderRadius: theme.radius,
    maxWidth: 56,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.customColors.semi,
    backgroundColor: theme.colors.surface,
    gap: 12,
  },
  footerLeft: {
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
  },
  selectedPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedIconName: {
    fontSize: theme.typography.labelLarge.fontSize,
    color: theme.colors.onSurface,
    fontWeight: "500",
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
}))

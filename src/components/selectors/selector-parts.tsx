/**
 * Building blocks shared by the selector sheets: the settings-style trigger row
 * and the bottom sheet frame (title + search box + list area).
 */
import type { ReactNode } from "react"
import { View } from "react-native"

import { IconSvg, type IconSvgName } from "~/components/icons"
import { SearchInput } from "~/components/search-input"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { ListItem } from "~/components/ui/list-item"
import { Text } from "~/components/ui/text"

import { sheetHeaderStyles, sheetStyles, triggerStyles } from "./styles"

interface SelectorTriggerProps {
  icon: IconSvgName
  label: string
  /** Current value shown on the trailing side. */
  value?: string
  editable: boolean
  onPress: () => void
}

/** Row that opens a selector sheet: icon + label, current value + chevron. */
export function SelectorTrigger({
  icon,
  label,
  value,
  editable,
  onPress,
}: SelectorTriggerProps) {
  const chevron = editable ? (
    <ChevronIcon
      direction="trailing"
      size={20}
      style={triggerStyles.chevronIcon}
    />
  ) : null
  return (
    <View style={triggerStyles.wrapper}>
      <ListItem
        style={triggerStyles.triggerRow}
        onPress={onPress}
        disabled={!editable}
      >
        <View style={triggerStyles.triggerLeft}>
          <IconSvg name={icon} size={24} />
          <Text variant="default" style={triggerStyles.triggerLabel}>
            {label}
          </Text>
        </View>
        {value !== undefined ? (
          <View style={triggerStyles.triggerRight}>
            <Text variant="default" style={triggerStyles.triggerValue}>
              {value}
            </Text>
            {chevron}
          </View>
        ) : (
          chevron
        )}
      </ListItem>
    </View>
  )
}

interface SearchSheetProps {
  visible: boolean
  onClose: () => void
  title: string
  searchQuery: string
  onSearchChange: (query: string) => void
  searchPlaceholder: string
  /** The list (or its loading state). */
  children: ReactNode
}

/** Bottom sheet with a title, a search box and a list area below. */
export function SearchSheet({
  visible,
  onClose,
  title,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  children,
}: SearchSheetProps) {
  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      contentPadding={0}
      heightFraction={0.75}
    >
      <View style={{ flex: 1 }}>
        <View style={sheetHeaderStyles.header}>
          <Text variant="default" style={sheetHeaderStyles.title}>
            {title}
          </Text>
        </View>
        <View style={sheetStyles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={onSearchChange}
            onClear={() => onSearchChange("")}
            placeholder={searchPlaceholder}
          />
        </View>
        <View style={sheetStyles.listWrapper}>{children}</View>
      </View>
    </BottomSheet>
  )
}

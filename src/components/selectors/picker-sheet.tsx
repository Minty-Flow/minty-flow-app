/**
 * Frame for list pickers in a bottom sheet: title, optional search, rows, and
 * an optional footer. Without `search` the sheet sizes to its rows; with it the
 * sheet is tall and the rows scroll (virtualized) under the search field.
 */
import { Fragment, type ReactElement, type ReactNode } from "react"
import { FlatList } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { SearchInput } from "~/components/search-input"
import { BottomSheet } from "~/components/ui/bottom-sheet"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

import { sheetHeaderStyles } from "./styles"

/** Above this many rows a picker sheet shows a search field. */
export const PICKER_SEARCH_MIN_ROWS = 8

interface PickerSheetProps<T> {
  visible: boolean
  onClose: () => void
  title: string
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder: string
  }
  /** Pinned below the rows, e.g. a Done button. */
  footer?: ReactNode
  data: T[]
  keyExtractor: (item: T) => string
  renderRow: (item: T) => ReactElement
  /** Shown above the rows, e.g. a "Select all" row. */
  listHeader?: ReactElement | null
  /** Shown instead of the rows when `data` is empty. */
  empty?: ReactElement
}

export function PickerSheet<T>({
  visible,
  onClose,
  title,
  search,
  footer,
  data,
  keyExtractor,
  renderRow,
  listHeader,
  empty,
}: PickerSheetProps<T>) {
  const header = (
    <View style={sheetHeaderStyles.header}>
      <Text variant="default" style={sheetHeaderStyles.title}>
        {title}
      </Text>
    </View>
  )

  if (!search) {
    return (
      <BottomSheet
        isPresented={visible}
        onDismiss={onClose}
        contentPadding={{ horizontal: 0, bottom: 16 }}
      >
        {header}
        {listHeader}
        {data.length === 0
          ? empty
          : data.map((item) => (
              <Fragment key={keyExtractor(item)}>{renderRow(item)}</Fragment>
            ))}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </BottomSheet>
    )
  }

  return (
    <BottomSheet
      isPresented={visible}
      onDismiss={onClose}
      contentPadding={0}
      heightFraction={0.75}
    >
      <View style={styles.container}>
        {header}
        <View style={styles.search}>
          <SearchInput
            value={search.value}
            onChangeText={search.onChange}
            onClear={() => search.onChange("")}
            placeholder={search.placeholder}
          />
        </View>
        <FlatList
          style={styles.list}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => renderRow(item)}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={empty}
          // Android detaches off-screen rows by default. Keep them attached so
          // the list behaves like the ScrollView it replaced inside the sheet.
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: { paddingHorizontal: 20, paddingBottom: 8 },
  list: { flex: 1 },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
})

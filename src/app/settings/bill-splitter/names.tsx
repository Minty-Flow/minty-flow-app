import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { AddNameModal } from "~/components/bill-splitter/add-name-modal"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { useBillSplitterStore } from "~/stores/bill-splitter.store"
import type { Participant } from "~/types/bill-splitter"

export default function NamesScreen() {
  const { t } = useTranslation()
  const { theme } = useUnistyles()

  const participants = useBillSplitterStore((s) => s.participants)
  const addParticipant = useBillSplitterStore((s) => s.addParticipant)
  const removeParticipant = useBillSplitterStore((s) => s.removeParticipant)

  const [addModalVisible, setAddModalVisible] = useState(false)

  const renderItem = useCallback(
    ({ item }: { item: Participant }) => (
      <View style={styles.nameRow}>
        <Text style={styles.nameText} numberOfLines={1}>
          {item.name}
        </Text>
        <Pressable
          onPress={() => removeParticipant(item.id)}
          style={styles.deleteButton}
          accessibilityLabel={t("common.actions.delete")}
        >
          <IconSvg name="trash" size={20} color={theme.colors.onSecondary} />
        </Pressable>
      </View>
    ),
    [removeParticipant, theme, t],
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={participants}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        // ListHeaderComponent={
        //   <Text variant="h2" style={styles.title}>
        //     {t("screens.settings.billSplitter.names.title")}
        //   </Text>
        // }
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title={t("screens.settings.billSplitter.names.empty.title")}
            description={t(
              "screens.settings.billSplitter.names.empty.description",
            )}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* FAB */}
      <Pressable
        onPress={() => setAddModalVisible(true)}
        style={styles.fab}
        accessibilityLabel={t("screens.settings.billSplitter.names.addName")}
      >
        <IconSvg name="plus" size={24} color={theme.colors.onPrimary} />
      </Pressable>

      <AddNameModal
        visible={addModalVisible}
        onAdd={addParticipant}
        onClose={() => setAddModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 96,
    gap: 10,
  },
  separator: {
    height: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: `${theme.colors.onSurface}08`,
    borderWidth: 1,
    borderColor: theme.colors.customColors.semi,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  deleteButton: {
    padding: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
}))

/**
 * Contact selector as a modal: trigger row (shared style) + modal with
 * search and FlatList. Tap a contact to select and close. Uses Suspense +
 * contacts promise so the modal opens instantly and the list loads asynchronously.
 */

import type { Contact } from "expo-contacts"
import * as Contacts from "expo-contacts"
import i18n from "i18next"
import { Suspense, use, useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, Modal, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet } from "react-native-unistyles"

import { SearchInput } from "~/components/search-input"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Button } from "~/components/ui/button"
import { ChevronIcon } from "~/components/ui/chevron-icon"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { Toast } from "~/utils/toast"

import { modalStyles, triggerStyles } from "./styles"

function createContactsPromise(
  onPermissionDenied?: () => void,
): Promise<{ contacts: Contacts.Contact[]; hasPermission: boolean }> {
  return (async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync()
      const granted = status === "granted"
      if (!granted) {
        onPermissionDenied?.()
        Toast.warn({
          title: i18n.t("components.selectors.contacts.permissionRequired"),
          description: i18n.t(
            "components.selectors.contacts.permissionDescription",
          ),
        })
        return { contacts: [], hasPermission: false }
      }
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Emails,
          Contacts.Fields.FirstName,
        ],
        sort: Contacts.SortTypes.FirstName,
      })
      return { contacts: data, hasPermission: true }
    } catch {
      return { contacts: [], hasPermission: false }
    }
  })()
}

interface ContactSelectorModalProps {
  onContactSelected: (contact: Contacts.Contact) => void
  onPermissionDenied?: () => void
  editable?: boolean
}

interface ContactListContentProps {
  contactsPromise: Promise<{
    contacts: Contacts.Contact[]
    hasPermission: boolean
  }>
  searchQuery: string
  onSelectContact: (contact: Contacts.Contact) => void
}

function ContactListContent({
  contactsPromise,
  searchQuery,
  onSelectContact,
}: ContactListContentProps) {
  const { t } = useTranslation()
  const { contacts, hasPermission } = use(contactsPromise)

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return contacts
    const q = searchQuery.toLowerCase().trim()
    return contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phoneNumbers?.some((p) => p.number?.toLowerCase().includes(q)) ||
        c.emails?.some((e) => e.email?.toLowerCase().includes(q)),
    )
  }, [contacts, searchQuery])

  const renderItem = useCallback(
    ({ item }: { item: Contact }) => (
      <ContactItem contact={item} onPress={onSelectContact} />
    ),
    [onSelectContact],
  )

  const keyExtractor = useCallback(
    (item: Contact, index: number) =>
      `${item.firstName ?? ""}-${item.phoneNumbers?.[0]?.number ?? ""}-${index}`,
    [],
  )

  const ListEmpty = useMemo(
    () => (
      <View style={modalStyles.emptyState}>
        <Text variant="muted">
          {!hasPermission
            ? t("components.selectors.contacts.permissionDenied")
            : t("components.selectors.contacts.noContacts")}
        </Text>
      </View>
    ),
    [hasPermission, t],
  )

  return (
    <FlatList
      data={filtered}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={ListEmpty}
      initialNumToRender={14}
      maxToRenderPerBatch={20}
      windowSize={11}
      keyboardShouldPersistTaps="always"
      style={modalStyles.list}
      contentContainerStyle={modalStyles.listContent}
      showsVerticalScrollIndicator
    />
  )
}

function ContactItem({
  contact,
  onPress,
}: {
  contact: Contacts.Contact
  onPress: (contact: Contacts.Contact) => void
}) {
  const initials = contact.name
    ? contact.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?"

  return (
    <Pressable
      style={({ pressed }: { pressed: boolean }) => [
        modalStyles.item,
        contactItemStyles.itemGap,
        pressed && modalStyles.itemPressed,
      ]}
      onPress={() => onPress(contact)}
    >
      <View style={contactItemStyles.avatar}>
        <Text style={contactItemStyles.avatarText}>{initials}</Text>
      </View>
      <View style={contactItemStyles.itemContent}>
        <Text variant="large" style={contactItemStyles.contactName}>
          {contact.name}
        </Text>
        {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
          <Text variant="muted" style={contactItemStyles.phoneNumber}>
            {contact.phoneNumbers[0].number}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const contactItemStyles = StyleSheet.create((theme) => ({
  itemGap: {
    gap: 12,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    ...theme.typography.headlineSmall,
  },
  phoneNumber: {
    fontSize: theme.typography.labelLarge.fontSize,
    opacity: 0.7,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: theme.colors.onSecondary,
    ...theme.typography.titleSmall,
  },
}))

export function ContactSelectorModal({
  onContactSelected,
  onPermissionDenied,
  editable = true,
}: ContactSelectorModalProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [contactsPromise, setContactsPromise] = useState<Promise<{
    contacts: Contacts.Contact[]
    hasPermission: boolean
  }> | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const open = useCallback(() => {
    if (!editable) return

    setSearchQuery("")
    setContactsPromise(createContactsPromise(onPermissionDenied))
    setVisible(true)
  }, [editable, onPermissionDenied])

  const close = useCallback(() => {
    setVisible(false)
    setContactsPromise(null)
  }, [])

  const handleSelectContact = useCallback(
    (contact: Contacts.Contact) => {
      onContactSelected(contact)
      close()
    },
    [onContactSelected, close],
  )

  return (
    <>
      <View style={triggerStyles.wrapper}>
        <Pressable
          style={triggerStyles.triggerRow}
          onPress={open}
          disabled={!editable}
        >
          <View style={triggerStyles.triggerLeft}>
            <IconSvg name="address-book" size={24} />
            <Text variant="default" style={triggerStyles.triggerLabel}>
              {t("components.selectors.contacts.triggerLabel")}
            </Text>
          </View>
          {editable && (
            <ChevronIcon
              direction="trailing"
              size={20}
              style={triggerStyles.chevronIcon}
            />
          )}
        </Pressable>
      </View>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent
        accessibilityViewIsModal
      >
        <SafeAreaView
          style={modalStyles.modalContainer}
          edges={["top", "bottom"]}
        >
          <View style={modalStyles.header}>
            <Text variant="default" style={modalStyles.headerTitle}>
              {t("components.selectors.contacts.title")}
            </Text>
            <Button variant="secondary" onPress={close}>
              <Text variant="default">{t("common.actions.cancel")}</Text>
            </Button>
          </View>
          <View style={modalStyles.searchContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery("")}
              placeholder={t("components.selectors.contacts.searchPlaceholder")}
            />
          </View>
          <View style={modalStyles.listWrapper}>
            {contactsPromise ? (
              <Suspense
                fallback={
                  <View style={modalStyles.loadingContainer}>
                    <ActivityIndicatorMinty size="small" />
                  </View>
                }
              >
                <ContactListContent
                  contactsPromise={contactsPromise}
                  searchQuery={searchQuery}
                  onSelectContact={handleSelectContact}
                />
              </Suspense>
            ) : (
              <View style={modalStyles.loadingContainer}>
                <ActivityIndicatorMinty size="small" />
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}

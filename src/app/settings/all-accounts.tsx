import { withObservables } from "@nozbe/watermelondb/react"
import { useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { AccountCard } from "~/components/accounts/account-card"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  observeAccounts,
  observeArchivedAccounts,
} from "~/database/services/account-service"
import type { Account } from "~/types/accounts"
import { NewEnum } from "~/types/new"

interface AllAccountsScreenInnerProps {
  accounts: Account[]
  archivedAccounts: Account[]
}

const AllAccountsScreenInner = ({
  accounts,
  archivedAccounts,
}: AllAccountsScreenInnerProps) => {
  const router = useRouter()
  const { theme } = useUnistyles()
  const { t } = useTranslation()

  const handleAddAccount = () => {
    router.push({
      pathname: "/accounts/[accountId]/modify",
      params: { accountId: NewEnum.NEW },
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.newAccountButton} onPress={handleAddAccount}>
          <IconSvg name="plus" size={32} color={theme.colors.onSecondary} />
          <Text variant="default" style={styles.newAccountText}>
            {t("screens.accounts.addNew")}
          </Text>
        </Pressable>

        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            isReorderMode={false}
          />
        ))}

        {archivedAccounts.length > 0 && (
          <>
            <Text variant="small" style={styles.archivedSectionLabel}>
              {t("screens.accounts.archivedSection")}
            </Text>
            {archivedAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                isReorderMode={false}
                isArchived
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  )
}

const AllAccountsScreen = withObservables([], () => ({
  accounts: observeAccounts(),
  archivedAccounts: observeArchivedAccounts(),
}))

export default AllAccountsScreen(AllAccountsScreenInner)

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    gap: 10,
  },
  newAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius,
  },
  newAccountText: {
    ...theme.typography.titleSmall,
    fontWeight: "600",
    color: theme.colors.onSecondary,
  },
  archivedSectionLabel: {
    ...theme.typography.labelXSmall,
    fontWeight: "600",
    color: theme.colors.customColors.semi,
    letterSpacing: 0.8,
    paddingTop: 8,
  },
}))

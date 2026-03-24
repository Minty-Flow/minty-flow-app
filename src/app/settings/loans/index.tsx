import { withObservables } from "@nozbe/watermelondb/react"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useLayoutEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FlatList, ScrollView } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { LoanCard } from "~/components/loans/loan-card"
import { Chip } from "~/components/ui/chips"
import { EmptyState } from "~/components/ui/empty-state"
import { IconSvg } from "~/components/ui/icon-svg"
import { Pressable } from "~/components/ui/pressable"
import { View } from "~/components/ui/view"
import { observeLoans } from "~/database/services/loan-service"
import type { Loan } from "~/types/loans"
import { LoanTypeEnum } from "~/types/loans"
import { NewEnum } from "~/types/new"

type LoanTypeFilter = "all" | "lent" | "borrowed"

interface LoansListContentProps {
  loans: Loan[]
}

function LoansListContent({ loans }: LoansListContentProps) {
  const { theme } = useUnistyles()
  const { t } = useTranslation()
  const router = useRouter()
  const navigation = useNavigation()

  const [filterVisible, setFilterVisible] = useState(false)
  const [activeFilter, setActiveFilter] = useState<LoanTypeFilter>("all")

  const isFiltered = activeFilter !== "all"

  const toggleFilter = useCallback(() => {
    setFilterVisible((v) => !v)
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={toggleFilter}
          style={[
            styles.headerFilterButton,
            isFiltered && { backgroundColor: `${theme.colors.primary}20` },
          ]}
          accessibilityLabel={t("components.filters.clearAll")}
        >
          <IconSvg
            name="filter"
            size={20}
            color={isFiltered ? theme.colors.primary : theme.colors.onSurface}
          />
        </Pressable>
      ),
    })
  }, [navigation, toggleFilter, isFiltered, theme, t])

  const handleAddLoan = useCallback(() => {
    router.push(`/settings/loans/${NewEnum.NEW}/modify`)
  }, [router])

  const handleLoanPress = useCallback(
    (loanId: string) => {
      router.push(`/settings/loans/${loanId}`)
    },
    [router],
  )

  const renderLoanItem = useCallback(
    ({ item }: { item: Loan }) => (
      <LoanCard loan={item} onPress={() => handleLoanPress(item.id)} />
    ),
    [handleLoanPress],
  )

  const filteredLoans = useMemo(() => {
    if (activeFilter === "all") return loans
    if (activeFilter === "lent")
      return loans.filter((l) => l.loanType === LoanTypeEnum.LENT)
    return loans.filter((l) => l.loanType === LoanTypeEnum.BORROWED)
  }, [loans, activeFilter])

  const chips: { key: LoanTypeFilter; label: string }[] = [
    { key: "all", label: t("screens.settings.loans.type.all") },
    { key: "lent", label: t("screens.settings.loans.type.lent") },
    { key: "borrowed", label: t("screens.settings.loans.type.borrowed") },
  ]

  return (
    <View style={styles.container}>
      {filterVisible ? (
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {chips.map(({ key, label }) => (
              <Chip
                key={key}
                label={label}
                selected={activeFilter === key}
                hideCheck
                onPress={() => setActiveFilter(key)}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <FlatList
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="cash-banknote"
            title={t("screens.settings.loans.empty")}
          />
        }
        renderItem={renderLoanItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      <Pressable
        onPress={handleAddLoan}
        style={styles.fab}
        accessibilityLabel={t("screens.settings.loans.addNew")}
      >
        <IconSvg name="plus" size={24} color={theme.colors.onPrimary} />
      </Pressable>
    </View>
  )
}

const EnhancedLoansList = withObservables([], () => ({
  loans: observeLoans(),
}))(LoansListContent)

export default function LoansScreen() {
  return <EnhancedLoansList />
}

const styles = StyleSheet.create((t) => ({
  container: {
    flex: 1,
    backgroundColor: t.colors.surface,
  },
  filterContainer: {
    justifyContent: "center",
  },
  chipRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 96,
    gap: 12,
  },
  separator: {
    height: 0,
  },
  headerFilterButton: {
    padding: 6,
    borderRadius: t.radius,
    marginRight: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: t.radius,
    backgroundColor: t.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: t.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
}))

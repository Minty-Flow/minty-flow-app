import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"

import { TransactionFormV3 } from "~/components/transaction/transaction-form-v3"
import { ActivityIndicatorMinty } from "~/components/ui/activity-indicator-minty"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import { on } from "~/database/events"
import type { TransactionWithRelations } from "~/database/mappers/hydrateTransactions"
import {
  getTagIdsForTransaction,
  getTransactionById,
} from "~/database/services-sqlite/transaction-service"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { useActiveAccounts } from "~/stores/db/account.store"
import { useAllBudgets } from "~/stores/db/budget.store"
import { useCategoriesByType } from "~/stores/db/category.store"
import { useGoalsByType } from "~/stores/db/goal.store"
import { useAllLoans } from "~/stores/db/loan.store"
import { useTags } from "~/stores/db/tag.store"
import { GoalTypeEnum } from "~/types/goals"
import { NewEnum } from "~/types/new"
import {
  type TransactionSubType,
  type TransactionType,
  TransactionTypeEnum,
} from "~/types/transactions"

const VALID_TYPES: TransactionType[] = [
  TransactionTypeEnum.EXPENSE,
  TransactionTypeEnum.INCOME,
  TransactionTypeEnum.TRANSFER,
]

function parseTransactionType(type: string | undefined): TransactionType {
  if (type && VALID_TYPES.includes(type as TransactionType)) {
    return type as TransactionType
  }
  return TransactionTypeEnum.EXPENSE
}

function transactionTypeToGoalType(transactionType: TransactionType) {
  if (transactionType === TransactionTypeEnum.INCOME)
    return GoalTypeEnum.SAVINGS
  return GoalTypeEnum.EXPENSE
}

interface TransactionEditorProps {
  transaction: TransactionWithRelations | null
  initialType?: TransactionType
  initialTagIds: string[]
  prefill?: Partial<TransactionFormValues>
}

function TransactionEditor({
  transaction,
  initialType,
  initialTagIds,
  prefill,
}: TransactionEditorProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    transaction?.type ?? initialType ?? TransactionTypeEnum.EXPENSE,
  )

  const [subtype, setSubtype] = useState<TransactionSubType | null>(
    transaction?.subtype ?? null,
  )

  const accounts = useActiveAccounts()
  const categories = useCategoriesByType(transactionType)
  const tags = useTags()
  const goals = useGoalsByType(transactionTypeToGoalType(transactionType))
  const budgets = useAllBudgets()
  const loans = useAllLoans()

  return (
    <TransactionFormV3
      transaction={transaction}
      transactionType={transactionType}
      onTransactionTypeChange={setTransactionType}
      initialTagIds={initialTagIds}
      initialSubtype={subtype ?? undefined}
      onSubtypeChange={setSubtype}
      prefill={prefill}
      accounts={accounts}
      categories={categories}
      tags={tags}
      goals={goals}
      budgets={budgets}
      loans={loans}
    />
  )
}

function EditTransactionScreen({ transactionId }: { transactionId: string }) {
  const { t } = useTranslation()
  const [transaction, setTransaction] = useState<
    TransactionWithRelations | null | undefined
  >(undefined)
  const [initialTagIds, setInitialTagIds] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const tx = await getTransactionById(transactionId)
      if (!cancelled) setTransaction(tx ?? null)
    }
    void load()
    const unsub = on("transactions:dirty", () => void load())
    return () => {
      cancelled = true
      unsub()
    }
  }, [transactionId])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const ids = await getTagIdsForTransaction(transactionId)
      if (!cancelled) setInitialTagIds(ids)
    }
    void load()
    const unsub = on("transactions:dirty", () => void load())
    return () => {
      cancelled = true
      unsub()
    }
  }, [transactionId])

  if (transaction === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicatorMinty />
        </View>
      </View>
    )
  }

  if (transaction === null) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="default">
            {t("components.transactionForm.notFoundTransaction")}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <TransactionEditor
      key={transaction.id}
      transaction={transaction}
      initialTagIds={initialTagIds}
    />
  )
}

export default function TransactionScreen() {
  const {
    id,
    type: typeParam,
    accountId: prefillAccountId,
    categoryId: prefillCategoryId,
    loanId: prefillLoanId,
  } = useLocalSearchParams<{
    id: string
    type?: string
    accountId?: string
    categoryId?: string
    loanId?: string
  }>()
  const isNew = id === NewEnum.NEW
  const initialType = parseTransactionType(typeParam)

  const prefill: Partial<TransactionFormValues> | undefined =
    isNew && (prefillAccountId || prefillCategoryId || prefillLoanId)
      ? {
          ...(prefillAccountId ? { accountId: prefillAccountId } : {}),
          ...(prefillCategoryId ? { categoryId: prefillCategoryId } : {}),
          ...(prefillLoanId ? { loanId: prefillLoanId } : {}),
        }
      : undefined

  if (isNew) {
    return (
      <TransactionEditor
        transaction={null}
        initialType={initialType}
        initialTagIds={[]}
        prefill={prefill}
      />
    )
  }

  const transactionId = id ?? ""
  if (!transactionId) return null

  return <EditTransactionScreen transactionId={transactionId} />
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}))

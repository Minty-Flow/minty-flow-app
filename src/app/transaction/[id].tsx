/**
 * Transaction editor — create or edit a transaction.
 * Uses the same pattern as accounts/[accountId]/modify and
 * settings/categories/[categoryId]/modify: withObservables for
 * reactive data.
 */

import { withObservables } from "@nozbe/watermelondb/react"
import { useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native-unistyles"
import { startWith } from "rxjs"

import { TransactionFormV3 } from "~/components/transaction/transaction-form-v3"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type TransactionModel from "~/database/models/transaction"
import { observeAccounts } from "~/database/services/account-service"
import { observeBudgets } from "~/database/services/budget-service"
import { observeCategoriesByType } from "~/database/services/category-service"
import { observeGoalsByType } from "~/database/services/goal-service"
import { observeLoans } from "~/database/services/loan-service"
import { observeTags } from "~/database/services/tag-service"
import {
  observeTransactionModelById,
  observeTransactionTagIds,
} from "~/database/services/transaction-service"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { GoalTypeEnum } from "~/types/goals"
import { NewEnum } from "~/types/new"
import { type TransactionType, TransactionTypeEnum } from "~/types/transactions"

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

const EnhancedTransactionForm = withObservables(
  ["transactionType"],
  ({ transactionType }: { transactionType: TransactionType }) => ({
    accounts: observeAccounts(),
    categories: observeCategoriesByType(transactionType),
    tags: observeTags(),
    goals: observeGoalsByType(transactionTypeToGoalType(transactionType)),
    budgets: observeBudgets(),
    loans: observeLoans(),
  }),
)(TransactionFormV3)

interface TransactionEditorProps {
  transaction: TransactionModel | null
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

  return (
    <EnhancedTransactionForm
      transaction={transaction}
      transactionType={transactionType}
      onTransactionTypeChange={setTransactionType}
      initialTagIds={initialTagIds}
      prefill={prefill}
    />
  )
}

interface EditTransactionScreenProps {
  transactionId: string
  transaction?: TransactionModel | null
  initialTagIds?: string[]
}

const EnhancedEditTransactionScreen = withObservables(
  ["transactionId"],
  ({ transactionId }: { transactionId: string }) => ({
    transaction: observeTransactionModelById(transactionId).pipe(
      startWith(undefined),
    ),
    initialTagIds: observeTransactionTagIds(transactionId),
  }),
)(function EditTransactionScreenInner({
  transaction,
  initialTagIds = [],
}: EditTransactionScreenProps) {
  const { t } = useTranslation()
  if (transaction === undefined) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="default">
            {t("components.transactionForm.loadingTransaction")}
          </Text>
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
})

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

  // Build prefill only for new transactions when at least one param is present
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

  return <EnhancedEditTransactionScreen transactionId={transactionId} />
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

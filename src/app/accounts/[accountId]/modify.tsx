import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"

import { AccountModifyContent } from "~/components/accounts/account-modify/account-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useAccountsQuery } from "~/database/drizzle/hooks/use-accounts-query"
import { getAccountTransactionCount } from "~/database/services/account-service"
import { NewEnum } from "~/types/new"

export default function EditAccountScreen() {
  const params = useLocalSearchParams<{ accountId: string }>()
  const accountId = params.accountId
  const isAddMode = accountId === NewEnum.NEW || !accountId

  const accountsQuery = useAccountsQuery()
  const account = accountsQuery.data.find((item) => item.id === accountId)
  const [transactionCount, setTransactionCount] = useState(0)

  useEffect(() => {
    if (isAddMode || !accountId) return
    getAccountTransactionCount(accountId).then(setTransactionCount)
  }, [accountId, isAddMode])

  if (isAddMode) {
    return <AccountModifyContent accountId={NewEnum.NEW} />
  }

  if (accountsQuery.updatedAt === undefined) return <RouteLoadingState />
  if (!account) return <RouteNotFoundState message="Account not found." />

  return (
    <AccountModifyContent
      key={accountId}
      accountId={accountId}
      account={account}
      transactionCount={transactionCount}
    />
  )
}

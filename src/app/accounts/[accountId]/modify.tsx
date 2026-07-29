import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"

import { AccountModifyContent } from "~/components/accounts/account-modify/account-modify-content"
import {
  RouteLoadingState,
  RouteNotFoundState,
} from "~/components/route-load-state"
import { useAccountsQuery } from "~/database/drizzle/read-models/account-read-model"
import { getAccountTransactionCount } from "~/database/services/account-service"
import { useModifyRouteLoader } from "~/hooks/use-modify-route-loader"
import { NewEnum } from "~/types/new"

export default function EditAccountScreen() {
  const params = useLocalSearchParams<{ accountId: string }>()
  const accountId = params.accountId
  const isAddMode = accountId === NewEnum.NEW || !accountId

  const accountsQuery = useAccountsQuery()
  const loadState = useModifyRouteLoader({
    id: accountId,
    data: accountsQuery.data,
    updatedAt: accountsQuery.updatedAt,
    find: (item, id) => item.id === id,
    notFoundMessage: "Account not found.",
  })
  const [transactionCount, setTransactionCount] = useState(0)

  useEffect(() => {
    if (isAddMode || !accountId) return
    getAccountTransactionCount(accountId).then(setTransactionCount)
  }, [accountId, isAddMode])

  if (loadState.mode === "new") {
    return <AccountModifyContent accountId={NewEnum.NEW} />
  }

  if (loadState.mode === "loading") return <RouteLoadingState />
  if (loadState.mode === "not-found") {
    return <RouteNotFoundState message={loadState.message} />
  }

  return (
    <AccountModifyContent
      key={accountId}
      accountId={accountId}
      account={loadState.entity}
      transactionCount={transactionCount}
    />
  )
}

import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"

import { AccountModifyContent } from "~/components/accounts/account-modify/account-modify-content"
import { getAccountTransactionCount } from "~/database/services-sqlite/account-service"
import { useAccount } from "~/stores/db/account.store"
import { NewEnum } from "~/types/new"

export default function EditAccountScreen() {
  const params = useLocalSearchParams<{ accountId: string }>()
  const accountId = params.accountId
  const isAddMode = accountId === NewEnum.NEW || !accountId

  const account = useAccount(accountId ?? "")
  const [transactionCount, setTransactionCount] = useState(0)

  useEffect(() => {
    if (isAddMode || !accountId) return
    getAccountTransactionCount(accountId).then(setTransactionCount)
  }, [accountId, isAddMode])

  if (isAddMode) {
    return <AccountModifyContent accountId={NewEnum.NEW} />
  }

  return (
    <AccountModifyContent
      key={accountId}
      accountId={accountId}
      account={account}
      transactionCount={transactionCount}
    />
  )
}

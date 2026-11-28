import { type ComponentProps, memo, useCallback } from "react"

import { TransactionItem } from "~/components/transaction/transaction-item"
import type { TransactionWithRelations } from "~/database/drizzle/read-models/transaction-read-model"

type ItemProps = ComponentProps<typeof TransactionItem>

interface TransactionRowProps {
  item: TransactionWithRelations
  onPressId: (transactionId: string) => void
  onDelete: ItemProps["onDelete"]
  onBeforeDelete?: ItemProps["onBeforeDelete"]
  onWillOpen: ItemProps["onWillOpen"]
}

/**
 * A list row that renders again only when its transaction or a handler changes
 * (not on search typing, filter toggles or unrelated writes).
 */
export const TransactionRow = memo(function TransactionRow({
  item,
  onPressId,
  onDelete,
  onBeforeDelete,
  onWillOpen,
}: TransactionRowProps) {
  const handlePress = useCallback(
    () => onPressId(item.id),
    [onPressId, item.id],
  )
  return (
    <TransactionItem
      transactionWithRelations={item}
      onPress={handlePress}
      onDelete={onDelete}
      onBeforeDelete={onBeforeDelete}
      onWillOpen={onWillOpen}
    />
  )
})

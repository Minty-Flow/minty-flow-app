import { DynamicIcon } from "~/components/dynamic-icon"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import type { MintyColorScheme } from "~/styles/theme"

import { transactionItemStyles } from "./styles"

type TransactionItemLeftProps = {
  displayIcon: string | undefined
  displayColorScheme: MintyColorScheme | undefined
  displayTitle: string
  subtitleText: string
}

export const TransactionItemLeft = ({
  displayIcon,
  displayColorScheme,
  displayTitle,
  subtitleText,
}: TransactionItemLeftProps) => {
  return (
    <View style={transactionItemStyles.leftSection}>
      <DynamicIcon
        icon={displayIcon}
        size={20}
        colorScheme={displayColorScheme}
        variant="badge"
      />
      <View style={transactionItemStyles.details}>
        <Text
          variant="small"
          style={transactionItemStyles.title}
          numberOfLines={1}
        >
          {displayTitle}
        </Text>
        <View style={transactionItemStyles.subtitleRow}>
          <Text style={transactionItemStyles.subtitle} numberOfLines={1}>
            {subtitleText}
          </Text>
        </View>
      </View>
    </View>
  )
}

import { StyleSheet } from "react-native-unistyles"

import { Chip } from "~/components/ui/chips"
import { View } from "~/components/ui/view"

interface CurrencySwitcherProps {
  currencies: string[]
  value: string
  onChange: (currency: string) => void
}

export function CurrencySwitcher({
  currencies,
  value,
  onChange,
}: CurrencySwitcherProps) {
  if (currencies.length <= 1) return null

  return (
    <View style={styles.row}>
      {currencies.map((currency) => (
        <Chip
          key={currency}
          label={currency}
          selected={currency === value}
          hideCheck
          onPress={() => onChange(currency)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 20,
  },
}))

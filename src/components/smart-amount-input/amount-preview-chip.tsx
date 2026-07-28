import { useTranslation } from "react-i18next"

import { IconSvg } from "~/components/icons"

import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { View } from "../ui/view"
import { smartInputStyles } from "./styles"

interface AmountLivePreviewProps {
  expression: string | null
  result: string | null
  error: string | null
  onPress: () => void
}

export const AmountLivePreview = ({
  expression,
  result,
  error,
  onPress,
}: AmountLivePreviewProps) => {
  const { t } = useTranslation()
  if (!expression && !error) return null

  if (error) {
    return (
      <View style={[smartInputStyles.liveRow, smartInputStyles.liveRowError]}>
        <Text style={smartInputStyles.previewError} numberOfLines={1}>
          {error}
        </Text>
      </View>
    )
  }

  return (
    <Pressable
      style={smartInputStyles.liveRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t(
        "components.transactionForm.amountInput.applyResult",
      )}
      accessibilityHint={t(
        "components.transactionForm.amountInput.applyResultHint",
      )}
    >
      <Text style={smartInputStyles.liveExpression} numberOfLines={1}>
        {expression}
      </Text>
      {result ? (
        <>
          <IconSvg
            name="equal-outline"
            size={16}
            color={smartInputStyles.semiColor.color}
          />
          <Text style={smartInputStyles.liveResult} numberOfLines={1}>
            {result}
          </Text>
        </>
      ) : null}
    </Pressable>
  )
}

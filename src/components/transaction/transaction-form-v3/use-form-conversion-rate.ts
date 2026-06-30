import { useCallback, useEffect, useRef, useState } from "react"
import type { UseFormSetValue } from "react-hook-form"

import { getConversionRateForTransaction } from "~/database/services-sqlite/transfer-service"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { currencyRegistryService } from "~/services/currency-registry"
import { exchangeRatesService } from "~/services/exchange-rates"
import { useExchangeRatesPreferencesStore } from "~/stores/exchange-rates-preferences.store"
import type { Account } from "~/types/accounts"
import type { Transaction, TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"

export function useFormConversionRate(
  transactionType: TransactionType,
  selectedAccount: Account | undefined,
  selectedToAccount: Account | null | undefined,
  transaction: Transaction | null,
  setValue: UseFormSetValue<TransactionFormValues>,
) {
  const [conversionRate, setConversionRateState] = useState<number | null>(null)
  const accountSelectionInitialMount = useRef(true)
  const conversionRatePairRef = useRef<{ from: string; to: string } | null>(
    null,
  )
  const getCustomRate = useExchangeRatesPreferencesStore((s) => s.getCustomRate)

  useEffect(() => {
    if (!transaction || transactionType !== "transfer") return
    let cancelled = false
    getConversionRateForTransaction(transaction).then((rate) => {
      if (!cancelled && rate != null) {
        setConversionRateState(rate)
        setValue("conversionRate", rate, { shouldDirty: false })
      }
    })
    return () => {
      cancelled = true
    }
  }, [transaction?.id, transactionType, transaction, setValue])

  useEffect(() => {
    if (transactionType !== "transfer") return
    if (accountSelectionInitialMount.current) {
      accountSelectionInitialMount.current = false
      return
    }
    setConversionRateState(null)
    setValue("conversionRate", null, { shouldDirty: false })
  }, [transactionType, setValue])

  useEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount
    )
      return
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (fromCurrency === toCurrency) return
    const prev = conversionRatePairRef.current
    conversionRatePairRef.current = { from: fromCurrency, to: toCurrency }
    if (prev && (prev.from !== fromCurrency || prev.to !== toCurrency)) {
      setConversionRateState(null)
      setValue("conversionRate", null, { shouldDirty: false })
    }
  }, [
    transactionType,
    selectedAccount?.id,
    selectedToAccount?.id,
    selectedAccount?.currencyCode,
    selectedToAccount?.currencyCode,
    selectedAccount,
    selectedToAccount,
    setValue,
  ])
  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  useEffect(() => {
    if (
      transactionType !== "transfer" ||
      !selectedAccount ||
      !selectedToAccount ||
      conversionRate !== null
    )
      return
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (fromCurrency === toCurrency) return
    let cancelled = false
    const resolve = async () => {
      const fromUpper = fromCurrency.toUpperCase()
      const toUpper = toCurrency.toUpperCase()
      const fromPerUsd = getCustomRate(fromCurrency)
      const toPerUsd = getCustomRate(toCurrency)
      let custom: number | undefined
      if (fromUpper === useCode) {
        custom = toPerUsd
      } else if (toUpper === useCode) {
        custom =
          fromPerUsd != null && fromPerUsd !== 0 ? 1 / fromPerUsd : undefined
      } else if (fromPerUsd != null && toPerUsd != null && fromPerUsd !== 0) {
        custom = toPerUsd / fromPerUsd
      } else if (fromPerUsd != null || toPerUsd != null) {
        logger.warn(
          "Custom rate only set for one side of the pair; falling back to API",
          { fromCurrency, toCurrency },
        )
      }
      if (cancelled) return
      if (custom !== undefined) {
        setConversionRateState(custom)
        setValue("conversionRate", custom, { shouldDirty: false })
        return
      }
      const rate = await exchangeRatesService.getRate(fromCurrency, toCurrency)
      if (!cancelled && rate != null) {
        setConversionRateState(rate)
        setValue("conversionRate", rate, { shouldDirty: false })
      }
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [
    transactionType,
    selectedAccount?.id,
    selectedToAccount?.id,
    selectedAccount?.currencyCode,
    selectedToAccount?.currencyCode,
    conversionRate,
    getCustomRate,
    selectedAccount,
    selectedToAccount,
    useCode,
    setValue,
  ])

  const setConversionRate = useCallback(
    (rate: number) => {
      setConversionRateState(rate)
      setValue("conversionRate", rate, { shouldDirty: true })
    },
    [setValue],
  )

  return { conversionRate, setConversionRate }
}

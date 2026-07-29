import { useEffect, useMemo, useState } from "react"
import type { UseFormSetValue } from "react-hook-form"

import { getConversionRateForTransaction } from "~/database/services/transfer-service"
import type { TransactionFormValues } from "~/schemas/transactions.schema"
import { currencyRegistryService } from "~/services/currency-registry"
import { exchangeRatesService } from "~/services/exchange-rates"
import { useExchangeRatesPreferencesStore } from "~/stores/exchange-rates-preferences.store"
import type { Account } from "~/types/accounts"
import type { Transaction, TransactionType } from "~/types/transactions"
import { logger } from "~/utils/logger"

type ConversionRateState = {
  sourceKey: string
  pairKey: string
  rate: number
} | null

function getCustomConversionRate(
  transactionType: TransactionType,
  selectedAccount: Account | undefined,
  selectedToAccount: Account | null | undefined,
  getCustomRate: (currencyCode: string) => number | undefined,
): number | null {
  if (
    transactionType !== "transfer" ||
    !selectedAccount ||
    !selectedToAccount ||
    selectedAccount.currencyCode === selectedToAccount.currencyCode
  ) {
    return null
  }

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"
  const fromCurrency = selectedAccount.currencyCode
  const toCurrency = selectedToAccount.currencyCode
  const fromUpper = fromCurrency.toUpperCase()
  const toUpper = toCurrency.toUpperCase()
  const fromPerUsd = getCustomRate(fromCurrency)
  const toPerUsd = getCustomRate(toCurrency)

  if (fromUpper === useCode) return toPerUsd ?? null
  if (toUpper === useCode) {
    return fromPerUsd != null && fromPerUsd !== 0 ? 1 / fromPerUsd : null
  }
  if (fromPerUsd != null && toPerUsd != null && fromPerUsd !== 0) {
    return toPerUsd / fromPerUsd
  }

  return null
}

export function useFormConversionRate(
  transactionType: TransactionType,
  selectedAccount: Account | undefined,
  selectedToAccount: Account | null | undefined,
  transaction: Transaction | null,
  setValue: UseFormSetValue<TransactionFormValues>,
) {
  const [conversionRateState, setConversionRateState] =
    useState<ConversionRateState>(null)
  const getCustomRate = useExchangeRatesPreferencesStore((s) => s.getCustomRate)
  const transactionKey = transaction?.id ?? "new"
  const conversionRatePairKey =
    transactionType === "transfer" &&
    selectedAccount &&
    selectedToAccount &&
    selectedAccount.currencyCode !== selectedToAccount.currencyCode
      ? `${selectedAccount.currencyCode}->${selectedToAccount.currencyCode}`
      : null
  const customConversionRate = useMemo(
    () =>
      getCustomConversionRate(
        transactionType,
        selectedAccount,
        selectedToAccount,
        getCustomRate,
      ),
    [getCustomRate, selectedAccount, selectedToAccount, transactionType],
  )
  const conversionRate =
    conversionRateState &&
    conversionRateState.sourceKey === transactionKey &&
    conversionRateState.pairKey === conversionRatePairKey
      ? conversionRateState.rate
      : customConversionRate

  useEffect(() => {
    if (
      !transaction ||
      transactionType !== "transfer" ||
      !conversionRatePairKey
    )
      return
    let cancelled = false
    getConversionRateForTransaction(transaction).then((rate) => {
      if (!cancelled && rate != null) {
        setConversionRateState({
          sourceKey: transactionKey,
          pairKey: conversionRatePairKey,
          rate,
        })
      }
    })
    return () => {
      cancelled = true
    }
  }, [conversionRatePairKey, transaction, transactionKey, transactionType])

  useEffect(() => {
    if (transactionType !== "transfer" || !conversionRatePairKey) return
    if (conversionRate !== null) return
    if (!selectedAccount || !selectedToAccount) return
    let cancelled = false
    const controller = new AbortController()
    const fromCurrency = selectedAccount.currencyCode
    const toCurrency = selectedToAccount.currencyCode
    if (
      getCustomRate(fromCurrency) != null ||
      getCustomRate(toCurrency) != null
    ) {
      logger.warn(
        "Custom rate only set for one side of the pair; falling back to API",
        { fromCurrency, toCurrency },
      )
    }
    void exchangeRatesService
      .getRate(fromCurrency, toCurrency, controller.signal)
      .then((rate) => {
        if (cancelled || rate == null) return
        setConversionRateState({
          sourceKey: transactionKey,
          pairKey: conversionRatePairKey,
          rate,
        })
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [
    conversionRate,
    conversionRatePairKey,
    getCustomRate,
    selectedAccount,
    selectedToAccount,
    transactionKey,
    transactionType,
  ])

  const setConversionRate = (rate: number) => {
    if (!conversionRatePairKey) return
    setConversionRateState({
      sourceKey: transactionKey,
      pairKey: conversionRatePairKey,
      rate,
    })
    setValue("conversionRate", rate, { shouldDirty: true })
  }
  return { conversionRate, setConversionRate }
}

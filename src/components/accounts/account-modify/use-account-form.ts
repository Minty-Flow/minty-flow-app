import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigation, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import {
  archiveAccount,
  createAccount,
  destroyAccount,
  unarchiveAccount,
  updateAccount,
} from "~/database/services-sqlite/account-service"
import { useNavigationGuard } from "~/hooks/use-navigation-guard"
import {
  type AddAccountsFormSchema,
  addAccountsSchema,
} from "~/schemas/accounts.schema"
import { currencyRegistryService } from "~/services/currency-registry"
import { getThemeStrict } from "~/styles/theme/registry"
import { AccountTypeEnum } from "~/types/accounts"
import { NewEnum } from "~/types/new"
import { logger } from "~/utils/logger"
import { Toast } from "~/utils/toast"

import type { AccountModifyContentProps } from "./types"

type UseAccountFormProps = Pick<
  AccountModifyContentProps,
  "accountId" | "account"
>

export function useAccountForm({ accountId, account }: UseAccountFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const isAddMode = accountId === NewEnum.NEW || !accountId

  const handleGoBack = useCallback(() => {
    router.back()
  }, [router])

  const usdCurrency = currencyRegistryService.getCurrencyByCode("USD")
  const useCode = usdCurrency?.code ?? "USD"

  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isDirty, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(addAccountsSchema),
    defaultValues: {
      name: account?.name || "",
      type: account?.type || AccountTypeEnum.CHECKING,
      balance: account?.balance || 0,
      currencyCode: account?.currencyCode || useCode,
      icon: account?.icon || "wallet-outline",
      colorSchemeName: account?.colorSchemeName || undefined,
      isPrimary: account?.isPrimary || false,
      excludeFromBalance: account?.excludeFromBalance || false,
    },
  })

  const formName = watch("name")
  const formIcon = watch("icon")
  const formColorSchemeName = watch("colorSchemeName")
  const formType = watch("type")
  const formCurrencyCode = watch("currencyCode")
  const formIsPrimary = watch("isPrimary")

  const navigation = useNavigation()
  const [unsavedModalVisible, setUnsavedModalVisible] = useState(false)
  const { allowNavigation } = useNavigationGuard({
    navigation,
    when: isDirty && !isSubmitting,
    onBlock: () => setUnsavedModalVisible(true),
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [archiveModalVisible, setArchiveModalVisible] = useState(false)

  const onSubmit = async (data: AddAccountsFormSchema) => {
    try {
      if (isAddMode) {
        await createAccount({
          name: data.name,
          type: data.type,
          balance: data.balance,
          currencyCode: data.currencyCode,
          icon: data.icon,
          colorSchemeName: data.colorSchemeName,
          isPrimary: false,
          excludeFromBalance: data.excludeFromBalance,
        })

        allowNavigation()
        handleGoBack()
      } else {
        await updateAccount(accountId, {
          name: data.name,
          type: data.type,
          balance: data.balance,
          currencyCode: data.currencyCode,
          icon: data.icon,
          colorSchemeName: data.colorSchemeName,
          isPrimary: data.isPrimary,
          excludeFromBalance: data.excludeFromBalance,
        })

        allowNavigation()
        handleGoBack()
      }
    } catch (error) {
      logger.error("Error saving account", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: isAddMode
          ? t("screens.accounts.form.toast.createFailed")
          : t("screens.accounts.form.toast.updateFailed"),
      })
    }
  }

  const handleSubmit = handleFormSubmit(onSubmit)

  const handleArchive = async () => {
    try {
      if (!account) return
      if (account.isArchived) {
        await unarchiveAccount(accountId)
        Toast.success({ title: t("screens.accounts.unarchiveSuccess") })
      } else {
        await archiveAccount(accountId)
        Toast.success({ title: t("screens.accounts.archiveSuccess") })
      }
      allowNavigation()
      router.back()
    } catch (error) {
      logger.error("Error archiving account", { error })
      Toast.error({ title: t("common.toast.error") })
    }
  }

  const handleDelete = async () => {
    try {
      await destroyAccount(accountId)

      allowNavigation()
      router.dismiss(2)
    } catch (error) {
      logger.error("Error deleting account", { error })
      Toast.error({
        title: t("common.toast.error"),
        description: t("screens.accounts.form.toast.deleteFailed"),
      })
    }
  }

  const handleIconSelected = (icon: string | null) => {
    setValue("icon", icon, { shouldDirty: true })
  }

  const handleColorSelected = (schemeName: string) => {
    setValue("colorSchemeName", schemeName, { shouldDirty: true })
  }

  const handleColorCleared = () => {
    setValue("colorSchemeName", undefined, { shouldDirty: true })
  }

  const handleCurrencySelected = (code: string) => {
    setValue("currencyCode", code, { shouldDirty: true })
  }

  const currentColorScheme = getThemeStrict(formColorSchemeName)

  return {
    isAddMode,
    control,
    errors,
    isDirty,
    isSubmitting,
    formName,
    formIcon,
    formColorSchemeName,
    formType,
    formCurrencyCode,
    formIsPrimary,
    currentColorScheme,
    unsavedModalVisible,
    deleteModalVisible,
    allowNavigation,
    handleGoBack,
    setValue,
    handleSubmit,
    handleDelete,
    handleIconSelected,
    handleColorSelected,
    handleColorCleared,
    handleCurrencySelected,
    openDeleteModal: () => setDeleteModalVisible(true),
    closeDeleteModal: () => setDeleteModalVisible(false),
    closeUnsavedModal: () => setUnsavedModalVisible(false),
    archiveModalVisible,
    handleArchive,
    openArchiveModal: () => setArchiveModalVisible(true),
    closeArchiveModal: () => setArchiveModalVisible(false),
  }
}

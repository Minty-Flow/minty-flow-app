import { type Href, useRouter } from "expo-router"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConfirmSheet } from "~/components/confirm-sheet"
import { useOnboardingStore } from "~/stores/onboarding.store"

/**
 * Offered once on the launch after the user quit partway through onboarding:
 * Continue returns to the step they reached, Skip ends onboarding for good.
 * Decided at mount, so opening a route outside onboarding during the flow
 * never raises it.
 */
export function OnboardingResumeSheet() {
  const { t } = useTranslation()
  const router = useRouter()
  const [visible, setVisible] = useState(() => {
    const { isCompleted, isInProgress } = useOnboardingStore.getState()
    return !isCompleted && isInProgress
  })
  const choseContinue = useRef(false)

  const handleContinue = () => {
    choseContinue.current = true
  }

  const handleClose = () => {
    setVisible(false)
    // Closed without Continue: the Skip button.
    if (!choseContinue.current) useOnboardingStore.getState().setCompleted()
  }

  const handleContinued = () => {
    const path = useOnboardingStore.getState().resumePath
    router.replace((path ?? "/onboarding/start") as Href)
  }

  return (
    <ConfirmSheet
      visible={visible}
      onRequestClose={handleClose}
      onConfirm={handleContinue}
      onConfirmed={handleContinued}
      title={t("onboarding.resume.title")}
      description={t("onboarding.resume.description")}
      confirmLabel={t("onboarding.resume.continue")}
      cancelLabel={t("onboarding.resume.skip")}
      icon="restore-outline"
      dismissable={false}
    />
  )
}

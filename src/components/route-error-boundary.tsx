import i18n from "i18next"
import { Component, type ReactNode } from "react"
import { StyleSheet } from "react-native-unistyles"

import { logger } from "~/utils/logger"

import { Button } from "./ui/button"
import { Text } from "./ui/text"
import { View } from "./ui/view"

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render throws anywhere below it (e.g. a screen crashing on bad
 * data or state) and shows a recoverable screen instead of a blank/crashed
 * app. Mounted once around the router at the app root — everything outside
 * it (providers, lock gate, toasts) keeps working even if a screen throws.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    logger.error("Unhandled render error", {
      error: error.message,
      componentStack: info.componentStack ?? undefined,
    })
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <RouteErrorFallback error={this.state.error} onReset={this.reset} />
      )
    }
    return this.props.children
  }
}

function RouteErrorFallback({
  error,
  onReset,
}: {
  error: Error
  onReset: () => void
}) {
  return (
    <View style={styles.container}>
      <Text variant="h4" style={styles.title}>
        {i18n.t("common.errorBoundary.title")}
      </Text>
      <Text variant="small" style={styles.detail}>
        {error.message}
      </Text>
      <Button onPress={onReset}>
        <Text>{i18n.t("common.actions.retry")}</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    backgroundColor: theme.colors.surface,
  },
  title: {
    textAlign: "center",
  },
  detail: {
    color: theme.colors.semantic.semi,
    textAlign: "center",
  },
}))

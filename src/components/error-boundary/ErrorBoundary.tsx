import React, { Component, ErrorInfo, ReactNode } from 'react'
import Logger from 'utils/Logger'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

const logger = Logger.getInstance()

class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error(`Uncaught error: ${error.message}`, info)
  }

  render(): React.ReactNode {
    const { hasError } = this.state

    if (hasError) {
      return (
        <div>Something went wrong</div>
      )
    }

    const { children } = this.props
    return children
  }
}

export default ErrorBoundary

import UncaughtError from 'components/pages/UncaughtError'
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Logger from 'utils/Logger'

type Props = RouteComponentProps & {
  children: ReactNode
}

type State = {
  hasError: boolean
  unlisten?: () => void
}

const logger = Logger.getInstance()

class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }

    const { history } = this.props
    const { hasError } = this.state
    history.listen((_, __) => {
      if (hasError) {
        this.setState({ hasError: false })
      }
    })
  }

  // componentDidMount(): void {
  //   const { history } = this.props
  //   const { hasError } = this.state
  //   this.setState({
  //     unlisten: history.listen((_, __) => {
  //       if (hasError) {
  //         this.setState({ hasError: false })
  //       }
  //     })
  //   })
  //   // this.unlisten = history.listen((_, __) => {
  //   //   if (hasError) {
  //   //     this.setState({ hasError: false })
  //   //   }
  //   // })
  // }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error(`Uncaught error: ${error.message}`, info)
  }

  // componentWillUnmount(): void {
  //   this.setState({ hasError: false })
  //   this.unlisten()
  // }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // private unlisten = (): void => { }

  render(): React.ReactNode {
    const { hasError } = this.state

    if (hasError) return <UncaughtError />

    const { children } = this.props
    return children
  }
}

export default withRouter(ErrorBoundary)

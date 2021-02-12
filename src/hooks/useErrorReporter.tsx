import AppContext, { AppContextProps, errorReporterFactory } from 'context/App/AppContext'
import { UIError } from 'models/UIMessage'
import { useCallback, useContext } from 'react'

// ================================================================
// this custom hook is only supposed to be used on AppContextProvider
// children components
// ================================================================

const useErrorReporter = (): ((e: UIError) => void) => {
  const {
    dispatch,
  } = useContext<AppContextProps>(AppContext)

  return useCallback(
    (e: UIError) => errorReporterFactory(dispatch)(e), [dispatch],
  )
}

export default useErrorReporter

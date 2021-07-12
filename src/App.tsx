import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from '@rsksmart/rif-ui'
import '@rsksmart/rif-ui/dist/index.css'
import React, { FC } from 'react'
import { AppContextProvider } from 'context/App'
import Market from 'components/Market'
import ErrorBoundary from 'components/error-boundary/ErrorBoundary'

const App: FC = () => (
  <ErrorBoundary>
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Market />
      </ThemeProvider>
    </AppContextProvider>
  </ErrorBoundary>
)

export default App

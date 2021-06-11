import { ThemeProvider } from '@material-ui/core/styles'
import { theme } from '@rsksmart/rif-ui'
import '@rsksmart/rif-ui/dist/index.css'
import React, { FC } from 'react'
import { AppContextProvider } from 'context/App'
import Market from 'components/Market'

const App: FC = () => (
  <AppContextProvider>
    <ThemeProvider theme={theme}>
      <Market />
    </ThemeProvider>
  </AppContextProvider>
)

export default App

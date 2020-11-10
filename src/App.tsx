import Collapse from '@material-ui/core/Collapse'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import {
  PageTemplate, theme, Web3Provider, defaultWeb3State,
} from '@rsksmart/rif-ui'
import '@rsksmart/rif-ui/dist/index.css'
import ErrorPanel from 'components/organisms/ErrorPanel'
import Footer from 'components/organisms/Footer'
import Header from 'components/organisms/Header'
import Routes from 'components/Routes'
import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from 'context/App/AppContext'
import { BlockchainContextProvider } from 'context/Blockchain/BlockchainContext'
import { MarketContextProvider } from 'context/Market/MarketContext'
import { NotificationsContextProvider } from 'context/Services/notifications'

const requiredNetworkId: number = Number(process.env.REACT_APP_REQUIRED_NETWORK_ID) || 8545

const useStyles = makeStyles(() => ({
  router: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const App = () => {
  const classes = useStyles()
  const [displayAlert, setDisplayAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const onConnectedAccountChange = () => {
    setAlertMessage('Your account has changed')
    setDisplayAlert(true)
    setTimeout(() => { window.location.href = window.location.origin }, 2000)
  }

  const onConnectedNetworkChange = () => {
    setAlertMessage('Your network has changed')
    setDisplayAlert(true)
    setTimeout(() => setDisplayAlert(false), 5000)
  }

  const orderedProviders = [
    NotificationsContextProvider,
    BlockchainContextProvider,
    MarketContextProvider,
  ]
  const content = (
    <BrowserRouter>
      <div className={classes.router}>
        <ErrorPanel />
        <Header />
        <PageTemplate>
          <Collapse in={displayAlert}>
            <Alert severity="warning" onClose={() => setDisplayAlert(false)}>
              {alertMessage}
            </Alert>
          </Collapse>
          <Routes />
        </PageTemplate>
        <Footer />
      </div>
    </BrowserRouter>
  )

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <Web3Provider.Provider
          requiredNetworkId={requiredNetworkId}
          actions={{
            onConnectedAccountChange,
            onConnectedNetworkChange,
          }}
          state={defaultWeb3State}
        >
          {
            orderedProviders.reverse().reduce((Wrapper: any, Provider: any) => <Provider>{Wrapper}</Provider>, content)
          }
        </Web3Provider.Provider>
      </ThemeProvider>
    </AppContextProvider>
  )
}

export default App

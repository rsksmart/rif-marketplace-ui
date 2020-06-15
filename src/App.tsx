import Collapse from '@material-ui/core/Collapse'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { PageTemplate, theme, Web3Provider } from '@rsksmart/rif-ui'
import '@rsksmart/rif-ui/dist/index.css'
import Footer from 'components/organisms/Footer'
import Header from 'components/organisms/Header'
import Routes from 'components/Routes'
import React, { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppStoreProvider } from 'store/App/AppStore'
import { BlockchainStoreProvider } from 'store/Blockchain/BlockchainStore'
import { MarketStoreProvider } from 'store/Market/MarketStore'

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

  return (
    <ThemeProvider theme={theme}>
      <AppStoreProvider>
        <BlockchainStoreProvider>
          <MarketStoreProvider>
            <Web3Provider.Provider
              requiredNetworkId={requiredNetworkId}
              actions={{
                onConnectedAccountChange,
                onConnectedNetworkChange,
              }}
            >
              <Router>
                <div className={classes.router}>
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
              </Router>
            </Web3Provider.Provider>
          </MarketStoreProvider>
        </BlockchainStoreProvider>
      </AppStoreProvider>
    </ThemeProvider>
  )
}

export default App

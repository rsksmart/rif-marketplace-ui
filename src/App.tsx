import Collapse from '@material-ui/core/Collapse'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { PageTemplate, theme, Web3Provider } from '@rsksmart/rif-ui'
import '@rsksmart/rif-ui/dist/index.css'
import Footer from 'components/organisms/Footer'
import Header from 'components/organisms/Header'
import Routes from 'components/Routes'
import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppStoreProvider } from 'store/App/AppStore'
import { BlockchainStoreProvider } from 'store/Blockchain/BlockchainStore'
import { MarketStoreProvider } from 'store/Market/MarketStore'
import { RnsDomainsStoreProvider } from 'store/Market/rns/DomainsStore'
import { RnsOffersStoreProvider } from 'store/Market/rns/OffersStore'
import { RnsSoldStoreProvider } from 'store/Market/rns/SoldStore'

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
      <Web3Provider.Provider
        requiredNetworkId={requiredNetworkId}
        actions={{
          onConnectedAccountChange,
          onConnectedNetworkChange,
        }}
      >
        <AppStoreProvider>
          <BlockchainStoreProvider>
            <MarketStoreProvider>
              <RnsDomainsStoreProvider>
                <RnsOffersStoreProvider>
                  <RnsSoldStoreProvider>
                    <BrowserRouter>
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
                    </BrowserRouter>
                  </RnsSoldStoreProvider>
                </RnsOffersStoreProvider>
              </RnsDomainsStoreProvider>
            </MarketStoreProvider>
          </BlockchainStoreProvider>
        </AppStoreProvider>
      </Web3Provider.Provider>
    </ThemeProvider>
  )
}

export default App

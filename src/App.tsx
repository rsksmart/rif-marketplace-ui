import Collapse from '@material-ui/core/Collapse'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { PageTemplate, theme, Web3Provider } from '@rsksmart/rif-ui'
import '@rsksmart/rif-ui/dist/index.css'
import ErrorPanel from 'components/organisms/ErrorPanel'
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
import { StorageListingStoreProvider } from 'store/Market/storage/ListingStore'

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
    BlockchainStoreProvider,
    MarketStoreProvider,
    RnsDomainsStoreProvider,
    RnsOffersStoreProvider,
    RnsSoldStoreProvider,
    StorageListingStoreProvider
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
    <AppStoreProvider>
      <ThemeProvider theme={theme}>
        <Web3Provider.Provider
          requiredNetworkId={requiredNetworkId}
          actions={{
            onConnectedAccountChange,
            onConnectedNetworkChange,
          }}
        >
          {
            orderedProviders.reverse().reduce((Wrapper: any, Provider: any) => <Provider>{Wrapper}</Provider>, content)
          }
        </Web3Provider.Provider>
      </ThemeProvider>
    </AppStoreProvider>
  )
}

export default App

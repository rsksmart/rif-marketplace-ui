import AppContext from 'context/App/AppContext'
import {
  PageTemplate, Web3Provider, defaultWeb3State,
} from '@rsksmart/rif-ui'
import { MarketContextProvider } from 'context/Market'
import { NotificationsContextProvider } from 'context/Services/notifications'
import React, { FC, useContext } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { ConfirmationsContextProvider } from 'context/Confirmations'
import Footer from './organisms/Footer'
import Routes from './Routes'
import AlertPanel from './organisms/AlertPanel'
import Header from './organisms/Header'
import ErrorPanel from './organisms/ErrorPanel'

const requiredNetworkId: number = Number(
  process.env.REACT_APP_REQUIRED_NETWORK_ID,
) || 8545

const useStyles = makeStyles(() => ({
  router: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const Market: FC = () => {
  const classes = useStyles()
  const {
    dispatch,
  } = useContext(AppContext)

  const onConnectedAccountChange = (): void => {
    dispatch({
      type: 'SET_ALERT',
      payload: {
        message: 'Your account has changed',
      },
    })
    setTimeout(() => { window.location.href = window.location.origin }, 2000)
  }

  const onConnectedNetworkChange = (): void => {
    dispatch({
      type: 'SET_ALERT',
      payload: {
        message: 'Your network has changed',
      },
    })
    setTimeout(() => {
      dispatch({
        type: 'HIDE_ALERT',
        payload: {},
      })
    }, 5000)
  }

  const orderedProviders = [
    ConfirmationsContextProvider,
    NotificationsContextProvider,
    MarketContextProvider,
  ]
  const content = (
    <BrowserRouter>
      <div className={classes.router}>
        <ErrorPanel />
        <Header />
        <PageTemplate>
          <AlertPanel />
          <Routes />
        </PageTemplate>
        <Footer />
      </div>
    </BrowserRouter>
  )
  return (
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
  )
}

export default Market

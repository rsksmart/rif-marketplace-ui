import React from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import ROUTES from 'routes'
import networkConfig from 'config'
import { StorageListingStoreProvider } from 'store/Market/storage/ListingStore'
import { NotFound } from '..'
import StorageLandingPage from './StorageLandingPage'
import StorageOffersPage from './buy/StorageOffersPage'
import StorageListingPage from './sell/StorageListingPage'
import StorageOfferListed from './sell/StorageOfferListed'
import { StorageOffersContextProvider } from 'store/Market/storage/OffersContext'

const StorageRoutes = () => {
  const { services } = networkConfig
  const storageEnabled = services && (services as string[]).includes('storage')

  if (storageEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.STORAGE.BASE} to={ROUTES.STORAGE.BUY.BASE} />
        <Route exact path={ROUTES.STORAGE.BUY.BASE}>
          <StorageOffersContextProvider>
            <Switch>
              <Route exact path={ROUTES.STORAGE.BUY.BASE} component={StorageOffersPage} />
            </Switch>
          </StorageOffersContextProvider>
        </Route>
        <Route exact path={ROUTES.STORAGE.SELL.BASE}>
          <StorageListingStoreProvider>
            <StorageListingPage />
          </StorageListingStoreProvider>
        </Route>
        <Route exact path={ROUTES.STORAGE.SELL.DONE} component={StorageOfferListed} />
        <Route component={NotFound} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path={ROUTES.STORAGE.BASE} component={StorageLandingPage} />
      <Redirect from="*" to={ROUTES.STORAGE.BASE} />
    </Switch>
  )
}

export default StorageRoutes

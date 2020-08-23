/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import React, { useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory,
} from 'react-router-dom'

import withTabs from 'components/hoc/withTabs'
import networkConfig from 'config'
import { StorageListingContextProvider } from 'context/Services/storage/ListingContext'
import { StorageOffersContextProvider } from 'context/Services/storage/OffersContext'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { StorageListingPage, StorageOffersPage } from '.'
import { NotFound } from '..'
import StorageOfferListed from './sell/StorageOfferListed'
import StorageLandingPage from './StorageLandingPage'

const TABS: StyledNavTabProps[] = [
  {
    label: 'Buy',
    to: ROUTES.STORAGE.BUY.BASE,
    value: ROUTES.STORAGE.BUY.BASE,
  },
  {
    label: 'Sell',
    to: ROUTES.STORAGE.SELL.BASE,
    value: ROUTES.STORAGE.SELL.BASE,
  },
  {
    label: 'My offers',
    to: ROUTES.STORAGE.MYOFFERS.BASE,
    value: ROUTES.STORAGE.MYOFFERS.BASE,
  },
  {
    label: 'My purchases',
    to: ROUTES.STORAGE.MYPURCHASES.BASE,
    value: ROUTES.STORAGE.MYPURCHASES.BASE,
  },
]

const logger = Logger.getInstance()

const StorageRoutes = () => {
  const { services } = networkConfig
  const storageEnabled = services && (services as string[]).includes('storage')
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      logger.debug('StorageRoutes -> location', location)
      logger.debug('StorageRoutes -> action', action)
    })
    return () => {
      unlisten()
    }
  }, [history])

  if (storageEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.STORAGE.BASE} to={ROUTES.STORAGE.BUY.BASE} />
        {
          withTabs({ tabs: TABS, title: 'Storage', defaultRoute: ROUTES.STORAGE.BUY.BASE })(() => (
            <Switch>
              <Route exact path={ROUTES.STORAGE.BUY.BASE}>
                <StorageOffersContextProvider>
                  <Switch>
                    <Route exact path={ROUTES.STORAGE.BUY.BASE} component={StorageOffersPage} />
                  </Switch>
                </StorageOffersContextProvider>
              </Route>
              <Route exact path={ROUTES.STORAGE.SELL.BASE}>
                <StorageListingContextProvider>
                  <StorageListingPage />
                </StorageListingContextProvider>
              </Route>
              <Route exact path={ROUTES.STORAGE.SELL.DONE} component={StorageOfferListed} />
              <Route component={NotFound} />
            </Switch>
          ))
        }
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

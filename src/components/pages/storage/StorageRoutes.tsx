/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import React, { useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory, useLocation,
} from 'react-router-dom'

import TabsTemplate from 'components/templates/TabsTemplate'
import networkConfig from 'config'
import { StorageSellContextProvider } from 'context/Services/storage/StorageSellContext'
import { StorageOffersContextProvider } from 'context/Services/storage/OffersContext'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { getTabValueFromLocation } from 'utils/utils'
import {
  StorageSellPage, StorageOffersPage, StorageMyOffersPage, StorageLandingPage,
} from '.'
import { NotFound } from '..'
import StorageSellDone from './sell/StorageSellDone'
import StorageMyOffersCancelled from './myoffers/StorageMyOffersCancelled'

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
  const { pathname } = useLocation()
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

        <TabsTemplate
          title="Storage"
          value={getTabValueFromLocation(TABS, ROUTES.STORAGE.BUY.BASE)(pathname)}
          tabs={TABS}
        >
          <Switch>
            <Route exact path={ROUTES.STORAGE.BUY.BASE}>
              <StorageOffersContextProvider>
                <Switch>
                  <Route exact path={ROUTES.STORAGE.BUY.BASE} component={StorageOffersPage} />
                </Switch>
              </StorageOffersContextProvider>
            </Route>
            <Route exact path={ROUTES.STORAGE.SELL.BASE}>
              <StorageSellContextProvider>
                <StorageSellPage />
              </StorageSellContextProvider>
            </Route>
            <Route exact path={ROUTES.STORAGE.SELL.DONE} component={StorageSellDone} />
            {/* TODO: define a way to handle routing of 2 diff routes and components under the same context */}
            <Route exact path={ROUTES.STORAGE.MYOFFERS.BASE}>
              <StorageOffersContextProvider>
                <Switch>
                  <Route exact path={ROUTES.STORAGE.MYOFFERS.BASE} component={StorageMyOffersPage} />
                </Switch>
              </StorageOffersContextProvider>
            </Route>
            <Route exact path={ROUTES.STORAGE.MYOFFERS.CANCEL.DONE} component={StorageMyOffersCancelled} />
            <Route component={NotFound} />
          </Switch>
        </TabsTemplate>
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

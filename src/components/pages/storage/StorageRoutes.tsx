/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import React, { FC, useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory, useLocation,
} from 'react-router-dom'

import TabsTemplate from 'components/templates/TabsTemplate'
import networkConfig from 'config'
import { OfferEditContextProvider } from 'context/Market/storage/OfferEditContext'
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
import StorageOffersCheckoutPage from './buy/StorageOffersCheckoutPage'

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

const StorageRoutes: FC = () => {
  const { pathname } = useLocation()
  const { services } = networkConfig
  const storageEnabled = services && (services as string[]).includes('storage')
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      logger.debug('StorageRoutes -> location', location)
      logger.debug('StorageRoutes -> action', action)
    })
    return (): void => {
      unlisten()
    }
  }, [history])

  if (storageEnabled) {
    return (
      <Switch>
        <Redirect
          exact
          from={ROUTES.STORAGE.BASE}
          to={ROUTES.STORAGE.BUY.BASE}
        />

        <TabsTemplate
          title="Storage"
          value={getTabValueFromLocation(
            TABS,
            ROUTES.STORAGE.BUY.BASE,
          )(pathname)}
          tabs={TABS}
        >
          <Switch>
            <Route path={ROUTES.STORAGE.BUY.BASE}>
              <StorageOffersContextProvider>
                <Switch>
                  <Redirect
                    exact
                    from={ROUTES.STORAGE.BUY.BASE}
                    to={ROUTES.STORAGE.BUY.LISTING}
                  />
                  <Route
                    exact
                    path={ROUTES.STORAGE.BUY.LISTING}
                    component={StorageOffersPage}
                  />
                  <Route
                    exact
                    path={ROUTES.STORAGE.BUY.CHECKOUT}
                    component={StorageOffersCheckoutPage}
                  />
                  <Route component={NotFound} />
                </Switch>
              </StorageOffersContextProvider>
            </Route>
            <Route exact path={ROUTES.STORAGE.SELL.BASE}>
              <OfferEditContextProvider>
                <StorageSellPage />
              </OfferEditContextProvider>
            </Route>
            <Route
              exact
              path={ROUTES.STORAGE.SELL.DONE}
              component={StorageSellDone}
            />
            <Route
              exact
              path={ROUTES.STORAGE.MYOFFERS.BASE}
            >
              <StorageOffersContextProvider>
                <Switch>
                  <Route
                    exact
                    path={ROUTES.STORAGE.MYOFFERS.BASE}
                    component={StorageMyOffersPage}
                  />
                </Switch>
              </StorageOffersContextProvider>
            </Route>
            <Route
              exact
              path={ROUTES.STORAGE.MYOFFERS.CANCEL.DONE}
              component={StorageMyOffersCancelled}
            />
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

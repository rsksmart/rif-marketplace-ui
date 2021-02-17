/* eslint-disable import/no-unresolved */
import {
  StyledNavTabProps,
} from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import React, { FC, useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory, useLocation,
} from 'react-router-dom'
import TabsTemplate from 'components/templates/TabsTemplate'
import networkConfig from 'config'
import { OfferEditContextProvider } from 'context/Market/storage'
import { StorageOffersContextProvider } from 'context/Services/storage/offers'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { getTabValueFromLocation } from 'utils/utils'
import { AgreementsContextProvider } from 'context/Services/storage/agreements'
import StorageContextProvider from 'context/Services/storage'
import {
  StorageOffersPage, StorageMyOffersPage, StorageLandingPage, StorageSellPage,
} from '.'
import { NotFound } from '..'
import StorageOffersCheckoutPage from './buy/StorageOffersCheckoutPage'
import StorageEditOfferPage from './myoffers/StorageEditOfferPage'
import MyStoragePurchases from './myPurchases/Page'
import RenewAgreement from './myPurchases/RenewAgreement'

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
  const storageEnabled = services && services.storage
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
          <StorageContextProvider>
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
                <StorageSellPage />
              </Route>
              <Route path={ROUTES.STORAGE.MYOFFERS.BASE}>
                <OfferEditContextProvider>
                  <Switch>
                    <Route
                      exact
                      path={ROUTES.STORAGE.MYOFFERS.BASE}
                      component={StorageMyOffersPage}
                    />
                    <Route
                      exact
                      path={ROUTES.STORAGE.MYOFFERS.EDIT}
                      component={StorageEditOfferPage}
                    />
                  </Switch>
                </OfferEditContextProvider>
              </Route>
              <Route path={ROUTES.STORAGE.MYPURCHASES.BASE}>
                <AgreementsContextProvider>
                  <Switch>
                    <Redirect
                      exact
                      from={ROUTES.STORAGE.MYPURCHASES.BASE}
                      to={ROUTES.STORAGE.MYPURCHASES.LISTING}
                    />
                    <Route
                      exact
                      path={ROUTES.STORAGE.MYPURCHASES.LISTING}
                      component={MyStoragePurchases}
                    />
                    <Route
                      exact
                      path={ROUTES.STORAGE.MYPURCHASES.RENEW}
                      component={RenewAgreement}
                    />
                  </Switch>
                </AgreementsContextProvider>
              </Route>
              <Route component={NotFound} />
            </Switch>
          </StorageContextProvider>
        </TabsTemplate>
      </Switch>
    )
  }

  return (
    <Switch>
      <Route
        exact
        path={ROUTES.STORAGE.BASE}
        component={StorageLandingPage}
      />
      <Redirect from="*" to={ROUTES.STORAGE.BASE} />
    </Switch>
  )
}

export default StorageRoutes

import React from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import ROUTES from 'routes'
import networkConfig from 'config'
import { RnsDomainsStoreProvider } from 'store/Market/rns/DomainsStore'
import { RnsOffersStoreProvider } from 'store/Market/rns/OffersStore'
import { RnsSoldStoreProvider } from 'store/Market/rns/SoldStore'
import { NotFound } from '..'
import {
  DomainOffersCheckoutPage, DomainOffersPage, DomainsCheckoutPage,
  SellDomainsListPage, DomainListed, DomainPurchased, CancelDomainCheckoutPage, DomainCanceled,
} from './index'
import RnsLandingPage from './RnsLandingPage'

const RnsRoutes = () => {
  const { services } = networkConfig
  const rnsEnabled = services && (services as string[]).includes('rns')

  if (rnsEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.RNS.BASE} to={ROUTES.RNS.BUY.BASE} />
        <Route path={ROUTES.RNS.BUY.BASE}>
          <RnsOffersStoreProvider>
            <Switch>
              <Redirect exact from={ROUTES.RNS.BUY.BASE} to={ROUTES.RNS.BUY.LISTING} />
              <Route exact path={ROUTES.RNS.BUY.LISTING} component={DomainOffersPage} />
              <Route exact path={ROUTES.RNS.BUY.CHECKOUT} component={DomainOffersCheckoutPage} />
              <Route exact path={ROUTES.RNS.BUY.DONE} component={DomainPurchased} />
              <Route component={NotFound} />
            </Switch>
          </RnsOffersStoreProvider>
        </Route>
        <Route path={ROUTES.RNS.SELL.BASE}>
          <RnsDomainsStoreProvider>
            <Switch>
              <Redirect exact from={ROUTES.RNS.SELL.BASE} to={ROUTES.RNS.SELL.LISTING} />
              <Route exact path={ROUTES.RNS.SELL.CANCEL.DONE} component={DomainCanceled} />
              <Route exact path={ROUTES.RNS.SELL.CANCEL.CHECKOUT} component={CancelDomainCheckoutPage} />
              <Route exact path={ROUTES.RNS.SELL.CHECKOUT} component={DomainsCheckoutPage} />
              <Route exact path={ROUTES.RNS.SELL.DONE} component={DomainListed} />
              <Route path={ROUTES.RNS.SELL.LISTING}>
                <RnsSoldStoreProvider>
                  <Switch>
                    <Route exact path={ROUTES.RNS.SELL.LISTING} component={SellDomainsListPage} />
                    <Route component={NotFound} />
                  </Switch>
                </RnsSoldStoreProvider>
              </Route>
            </Switch>
          </RnsDomainsStoreProvider>
        </Route>
        <Route component={NotFound} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path={ROUTES.RNS.BASE} component={RnsLandingPage} />
      <Redirect from="*" to={ROUTES.RNS.BASE} />
    </Switch>
  )
}

export default RnsRoutes

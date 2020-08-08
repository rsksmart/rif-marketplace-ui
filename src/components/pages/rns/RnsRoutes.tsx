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

const OffersRoutes = () => (
  <Switch>
    <RnsOffersStoreProvider>
      <Route exact path={ROUTES.DOMAINS.BUY.BASE} component={DomainOffersPage} />
      <Route exact path={ROUTES.DOMAINS.BUY.CHECKOUT} component={DomainOffersCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.BUY.DONE} component={DomainPurchased} />
    </RnsOffersStoreProvider>
  </Switch>
)

const DomainsRoutes = () => (
  <Switch>
    <RnsDomainsStoreProvider>
      <RnsSoldStoreProvider>
        <Route exact path={ROUTES.DOMAINS.SELL.BASE} component={SellDomainsListPage} />
      </RnsSoldStoreProvider>
      <Route exact path={ROUTES.DOMAINS.SELL.CANCEL.CHECKOUT} component={CancelDomainCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.SELL.CHECKOUT} component={DomainsCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.SELL.DONE} component={DomainListed} />
    </RnsDomainsStoreProvider>
  </Switch>
)

const RnsRoutes = () => {
  const { services } = networkConfig
  const rnsEnabled = services && (services as string[]).includes('rns')

  if (rnsEnabled) {
    // It is important to keep ROUTES.DOMAINS.SELL.CANCEL.DONE above ROUTES.DOMAINS.SELL.BASE
    return (
      <Switch>
        <Redirect exact from={ROUTES.DOMAINS.BASE} to={ROUTES.DOMAINS.BUY.BASE} />
        <Route path={ROUTES.DOMAINS.BUY.BASE} component={OffersRoutes} />
        <Route exact path={ROUTES.DOMAINS.SELL.CANCEL.DONE} component={DomainCanceled} />
        <Route path={ROUTES.DOMAINS.SELL.BASE} component={DomainsRoutes} />
        <Route component={NotFound} />
      </Switch>
    )
    // TODO: Once the views are in tabs the RnsSoldStoreProvider should also go in its own subroute
  }
  return (
    <Switch>
      <Route exact path={ROUTES.DOMAINS.BASE} component={RnsLandingPage} />
      <Redirect from="*" to={ROUTES.DOMAINS.BASE} />
    </Switch>
  )
}

export default RnsRoutes

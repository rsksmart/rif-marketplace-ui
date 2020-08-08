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

const SoldDomainsRoutes = () => (
  <Switch>
    <RnsSoldStoreProvider>
      <Route exact path={ROUTES.DOMAINS.SELL.BASE} component={SellDomainsListPage} />
    </RnsSoldStoreProvider>
  </Switch>
)

const DomainsRoutes = () => (
  <Switch>
    <RnsDomainsStoreProvider>
      <Route exact path={ROUTES.DOMAINS.SELL.CANCEL.DONE} component={DomainCanceled} />
      <Route exact path={ROUTES.DOMAINS.SELL.CANCEL.CHECKOUT} component={CancelDomainCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.SELL.CHECKOUT} component={DomainsCheckoutPage} />
      <Route exact path={ROUTES.DOMAINS.SELL.DONE} component={DomainListed} />
      <Route path={ROUTES.DOMAINS.SELL.BASE} component={SoldDomainsRoutes} />
    </RnsDomainsStoreProvider>
  </Switch>
)

const RnsRoutes = () => {
  const { services } = networkConfig
  const rnsEnabled = services && (services as string[]).includes('rns')

  if (rnsEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.DOMAINS.BASE} to={ROUTES.DOMAINS.BUY.BASE} />
        <Route path={ROUTES.DOMAINS.BUY.BASE} component={OffersRoutes} />
        <Route path={ROUTES.DOMAINS.SELL.BASE} component={DomainsRoutes} />
        <Route component={NotFound} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path={ROUTES.DOMAINS.BASE} component={RnsLandingPage} />
      <Redirect from="*" to={ROUTES.DOMAINS.BASE} />
    </Switch>
  )
}

export default RnsRoutes

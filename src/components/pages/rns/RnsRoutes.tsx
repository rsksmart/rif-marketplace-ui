/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import withTabs from 'components/hoc/withTabs'
import networkConfig from 'config'
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import ROUTES from 'routes'
import { RnsDomainsStoreProvider } from 'store/Services/rns/DomainsStore'
import { RnsOffersStoreProvider } from 'store/Services/rns/OffersStore'
import { RnsSoldStoreProvider } from 'store/Services/rns/SoldStore'
import {
  CancelDomainCheckoutPage, DomainCanceled, DomainListed, DomainOffersCheckoutPage,
  DomainOffersPage, DomainPurchased, DomainsCheckoutPage, NotFound, SellDomainsListPage,
} from '../'
import RnsLandingPage from './RnsLandingPage'

const TABS: StyledNavTabProps[] = [
  {
    label: 'Buy',
    to: ROUTES.DOMAINS.BUY.BASE,
    value: ROUTES.DOMAINS.BUY.BASE,
  },
  {
    label: 'Sell',
    to: ROUTES.DOMAINS.SELL.BASE,
    value: ROUTES.DOMAINS.SELL.BASE,
  },
]

const RnsRoutes = () => {
  const { services } = networkConfig
  const rnsEnabled = services && (services as string[]).includes('rns')

  if (rnsEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.DOMAINS.BASE} to={ROUTES.DOMAINS.BUY.BASE} />
        {
          withTabs({ tabs: TABS, title: 'Domains', defaultRoute: ROUTES.DOMAINS.BUY.BASE })(() => (
            <Switch>
              <Route path={ROUTES.DOMAINS.BUY.BASE}>
                <RnsOffersStoreProvider>
                  <Switch>
                    <Route exact path={ROUTES.DOMAINS.BUY.BASE} component={DomainOffersPage} />
                    <Route exact path={ROUTES.DOMAINS.BUY.CHECKOUT} component={DomainOffersCheckoutPage} />
                    <Route exact path={ROUTES.DOMAINS.BUY.DONE} component={DomainPurchased} />
                    <Route component={NotFound} />
                  </Switch>
                </RnsOffersStoreProvider>
              </Route>
              <Route path={ROUTES.DOMAINS.SELL.BASE}>
                <RnsDomainsStoreProvider>
                  <Switch>
                    <Route exact path={ROUTES.DOMAINS.SELL.CANCEL.DONE} component={DomainCanceled} />
                    <Route exact path={ROUTES.DOMAINS.SELL.CANCEL.CHECKOUT} component={CancelDomainCheckoutPage} />
                    <Route exact path={ROUTES.DOMAINS.SELL.CHECKOUT} component={DomainsCheckoutPage} />
                    <Route exact path={ROUTES.DOMAINS.SELL.DONE} component={DomainListed} />
                    <Route path={ROUTES.DOMAINS.SELL.BASE}>
                      <RnsSoldStoreProvider>
                        <Switch>
                          <Route exact path={ROUTES.DOMAINS.SELL.BASE} component={SellDomainsListPage} />
                          <Route component={NotFound} />
                        </Switch>
                      </RnsSoldStoreProvider>
                    </Route>
                  </Switch>
                </RnsDomainsStoreProvider>
              </Route>
              <Route component={NotFound} />
            </Switch>
          ))
        }
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

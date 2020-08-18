import React, { FC } from 'react'
import ROUTES from 'routes'
import { useLocation, Switch, Route } from 'react-router-dom'
/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import TabsTemplate from 'components/templates/TabsTemplate'
import { RnsDomainsStoreProvider } from 'store/Market/rns/DomainsStore'
import { RnsOffersStoreProvider } from 'store/Market/rns/OffersStore'
import { RnsSoldStoreProvider } from 'store/Market/rns/SoldStore'
import {
  DomainOffersCheckoutPage, DomainOffersPage, DomainsCheckoutPage,
  SellDomainsListPage, DomainListed, DomainPurchased, CancelDomainCheckoutPage, DomainCanceled,
} from './index'
import { NotFound } from '..'

const RNSTabedPages: FC = () => {
  const location = useLocation()
  const tabs: StyledNavTabProps[] = [
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

  const getTabValueFromLocation = () => {
    const { pathname } = location
    const activeTab = tabs.find((tab) => pathname.includes(tab.to))
    return activeTab?.to || ROUTES.DOMAINS.BUY.BASE
  }

  return (
    <TabsTemplate
      title="Domains"
      value={getTabValueFromLocation()}
      tabs={tabs}
    >
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
    </TabsTemplate>
  )
}

export default RNSTabedPages

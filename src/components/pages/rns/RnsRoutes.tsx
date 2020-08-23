/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import withTabs from 'components/hoc/withTabs'
import networkConfig from 'config'
import { RnsDomainsContextProvider } from 'context/Services/rns/DomainsContext'
import { RnsOffersContextProvider } from 'context/Services/rns/OffersContext'
import { RnsSoldContextProvider } from 'context/Services/rns/SoldContext'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import {
  CancelDomainCheckoutPage, DomainCanceled, DomainListed, DomainOffersCheckoutPage,
  DomainOffersPage, DomainPurchased, DomainsCheckoutPage, NotFound, SellDomainsListPage
} from '..'
import RnsLandingPage from './RnsLandingPage'


const logger = Logger.getInstance()
const TABS: StyledNavTabProps[] = [
  {
    label: 'Buy',
    to: ROUTES.RNS.BUY.BASE,
    value: ROUTES.RNS.BUY.BASE,
  },
  {
    label: 'Sell',
    to: ROUTES.RNS.SELL.BASE,
    value: ROUTES.RNS.SELL.BASE,
  },
]

const RnsRoutes = () => {
  const { services } = networkConfig
  const rnsEnabled = services && (services as string[]).includes('rns')
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      logger.debug('RnsRoutes -> location', location)
      logger.debug('RnsRoutes -> action', action)
    })
    return () => {
      unlisten()
    }
  }, [history])

  if (rnsEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.RNS.BASE} to={ROUTES.RNS.BUY.BASE} />
        {
          withTabs({ tabs: TABS, title: 'Domains', defaultRoute: ROUTES.RNS.BUY.BASE })(() => (
            <Switch>
              <Route path={ROUTES.RNS.BUY.BASE}>
                <RnsOffersContextProvider>
                  <Switch>
                    <Redirect exact from={ROUTES.RNS.BUY.BASE} to={ROUTES.RNS.BUY.LISTING} />
                    <Route exact path={ROUTES.RNS.BUY.LISTING} component={DomainOffersPage} />
                    <Route exact path={ROUTES.RNS.BUY.CHECKOUT} component={DomainOffersCheckoutPage} />
                    <Route exact path={ROUTES.RNS.BUY.DONE} component={DomainPurchased} />
                    <Route component={NotFound} />
                  </Switch>
                </RnsOffersContextProvider>
              </Route>
              <Route path={ROUTES.RNS.SELL.BASE}>
                <RnsDomainsContextProvider>
                  <Switch>
                    <Redirect exact from={ROUTES.RNS.SELL.BASE} to={ROUTES.RNS.SELL.LISTING} />
                    <Route exact path={ROUTES.RNS.SELL.CANCEL.DONE} component={DomainCanceled} />
                    <Route exact path={ROUTES.RNS.SELL.CANCEL.CHECKOUT} component={CancelDomainCheckoutPage} />
                    <Route exact path={ROUTES.RNS.SELL.CHECKOUT} component={DomainsCheckoutPage} />
                    <Route exact path={ROUTES.RNS.SELL.DONE} component={DomainListed} />
                    <Route path={ROUTES.RNS.SELL.LISTING}>
                      <RnsSoldContextProvider>
                        <Switch>
                          <Route exact path={ROUTES.RNS.SELL.LISTING} component={SellDomainsListPage} />
                          <Route component={NotFound} />
                        </Switch>
                      </RnsSoldContextProvider>
                    </Route>
                  </Switch>
                </RnsDomainsContextProvider>
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
      <Route exact path={ROUTES.RNS.BASE} component={RnsLandingPage} />
      <Redirect from="*" to={ROUTES.RNS.BASE} />
    </Switch>
  )
}

export default RnsRoutes

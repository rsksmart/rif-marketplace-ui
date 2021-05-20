import TabsTemplate from 'components/templates/TabsTemplate'
import networkConfig from 'config'
import { RnsDomainsContextProvider } from 'context/Services/rns/DomainsContext'
import { RnsOffersContextProvider } from 'context/Services/rns/OffersContext'
import { RnsSoldContextProvider } from 'context/Services/rns/SoldContext'
import React, { FC, useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory, useLocation,
} from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { getTabValueFromLocation } from 'utils/utils'
import {
  DomainOffersCheckoutPage,
  DomainOffersPage, DomainsCheckoutPage, NotFound, SellDomainsListPage,
} from '..'
import { buildTabs } from '../routerUtils'
import CancelDomainCheckoutPage from './cancel/CancelDomainCheckoutPage'
import RnsLandingPage from './RnsLandingPage'

const logger = Logger.getInstance()
const TABS = buildTabs([
  {
    label: 'Buy',
    value: ROUTES.RNS.BUY.BASE,
  },
  {
    label: 'Sell',
    value: ROUTES.RNS.SELL.BASE,
  },
])

const RnsRoutes: FC = () => {
  const { pathname } = useLocation()
  const { services } = networkConfig
  const rnsEnabled = services && services.rns
  const history = useHistory()

  useEffect(() => {
    // TODO: wrap this code block to be excecuted only on debugging
    const unlisten = history.listen((location, action) => {
      logger.debug('RnsRoutes -> location', location)
      logger.debug('RnsRoutes -> action', action)
    })
    return (): void => {
      unlisten()
    }
  }, [history])

  if (rnsEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.RNS.BASE} to={ROUTES.RNS.BUY.BASE} />

        <TabsTemplate
          title="RNS"
          value={getTabValueFromLocation(TABS, ROUTES.RNS.BUY.BASE)(pathname)}
          tabs={TABS}
        >
          <Switch>
            <Route path={ROUTES.RNS.BUY.BASE}>
              <RnsOffersContextProvider>
                <Switch>
                  <Redirect
                    exact
                    from={ROUTES.RNS.BUY.BASE}
                    to={ROUTES.RNS.BUY.LISTING}
                  />
                  <Route
                    exact
                    path={ROUTES.RNS.BUY.LISTING}
                    component={DomainOffersPage}
                  />
                  <Route
                    exact
                    path={ROUTES.RNS.BUY.CHECKOUT}
                    component={DomainOffersCheckoutPage}
                  />
                  <Route component={NotFound} />
                </Switch>
              </RnsOffersContextProvider>
            </Route>
            <Route path={ROUTES.RNS.SELL.BASE}>
              <RnsDomainsContextProvider>
                <Switch>
                  <Redirect
                    exact
                    from={ROUTES.RNS.SELL.BASE}
                    to={ROUTES.RNS.SELL.LISTING}
                  />
                  <Route
                    exact
                    path={ROUTES.RNS.SELL.CANCEL.CHECKOUT}
                    component={CancelDomainCheckoutPage}
                  />
                  <Route
                    exact
                    path={ROUTES.RNS.SELL.CHECKOUT}
                    component={DomainsCheckoutPage}
                  />
                  <Route path={ROUTES.RNS.SELL.LISTING}>
                    <RnsSoldContextProvider>
                      <Switch>
                        <Route
                          exact
                          path={ROUTES.RNS.SELL.LISTING}
                          component={SellDomainsListPage}
                        />
                        <Route component={NotFound} />
                      </Switch>
                    </RnsSoldContextProvider>
                  </Route>
                </Switch>
              </RnsDomainsContextProvider>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </TabsTemplate>
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

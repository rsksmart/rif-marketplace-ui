import React, { FC, useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory, useLocation,
} from 'react-router-dom'
import networkConfig from 'config'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import TabsTemplate from 'components/templates/TabsTemplate'
import { getTabValueFromLocation } from 'utils/utils'
import { NotifierOffersContextProvider } from 'context/Services/notifier/offers'
import ManageProviderPage from 'components/pages/notifier/provider/ManageProviderPage'
import WithLoginCard from 'components/hoc/WithLoginCard'
import NotifierLandingPage from './NotifierLandingPage'
import { NotFound } from '..'
import NotifierOfferCheckoutPage from './buy/NotifierOfferCheckoutPage'
import NotifierOffersPage from './buy/NotifierOffersPage'
import NotifierMyOffersPage from './myoffers/NotifierMyOffersPage'
import NotifierMyPurchasePage from './mypurchase/NotifierMyPurchasePage'
import { buildTabs } from '../routerUtils'

const logger = Logger.getInstance()

const TABS = buildTabs([
  { label: 'Buy', value: ROUTES.NOTIFIER.BUY.BASE },
  { label: 'Sell', value: ROUTES.NOTIFIER.SELL.BASE },
  { label: 'My offers', value: ROUTES.NOTIFIER.MYOFFERS.BASE },
  { label: 'My purchases', value: ROUTES.NOTIFIER.MYPURCHASES.BASE },
])

const DeadEndRoute = <Route component={NotFound} /> // TODO: Move to utils and abstract in uses across the app
const NotifierRoutes: FC = () => {
  const { pathname } = useLocation()
  const { services } = networkConfig
  const notifierEnabled = services && services.notifier
  const history = useHistory()

  useEffect(() => {
    // TODO: wrap this code block to be excecuted only on debugging
    const unlisten = history.listen((location, action) => {
      logger.debug('NotifierRoutes -> location', location)
      logger.debug('NotifierRoutes -> action', action)
    })
    return (): void => {
      unlisten()
    }
  }, [history])

  if (notifierEnabled) {
    return (
      <Switch>
        <Redirect
          exact
          from={ROUTES.NOTIFIER.BASE}
          to={ROUTES.NOTIFIER.BUY.BASE}
        />

        <TabsTemplate
          title="Notification Services"
          value={getTabValueFromLocation(
            TABS, ROUTES.NOTIFIER.BUY.BASE,
          )(pathname)}
          tabs={TABS}
        >
          <Switch>
            {/* Buy */}
            <Route path={ROUTES.NOTIFIER.BUY.BASE}>
              <NotifierOffersContextProvider>
                <Switch>
                  <Route
                    exact
                    path={ROUTES.NOTIFIER.BUY.BASE}
                    component={NotifierOffersPage}
                  />
                  <Route
                    exact
                    path={ROUTES.NOTIFIER.BUY.CHECKOUT}
                    component={NotifierOfferCheckoutPage}
                  />
                  {DeadEndRoute}
                </Switch>
              </NotifierOffersContextProvider>
            </Route>
            {/* MyOffers */}
            <Route path={ROUTES.NOTIFIER.MYOFFERS.BASE}>
              <NotifierOffersContextProvider>
                <Switch>
                  <Route
                    exact
                    path={ROUTES.NOTIFIER.MYOFFERS.BASE}
                    component={NotifierMyOffersPage}
                  />
                  <Route
                    exact
                    path={ROUTES.NOTIFIER.MYOFFERS.EDIT}
                    component={ManageProviderPage}
                  />

                  {DeadEndRoute}
                </Switch>
              </NotifierOffersContextProvider>
            </Route>

            {/* Sell */}
            <Route
              exact
              path={ROUTES.NOTIFIER.SELL.BASE}
              component={
        WithLoginCard({
          WrappedComponent: () => <ManageProviderPage create />,
          title: 'Connect your wallet to register as a provider',
          contentText: 'Please, connect your wallet in order to register as a provider.',
        })

              }
            />

            {/* My purchases */}
            <Route
              exact
              path={ROUTES.NOTIFIER.MYPURCHASES.BASE}
              component={NotifierMyPurchasePage}
            />
            {DeadEndRoute}
          </Switch>
        </TabsTemplate>
      </Switch>
    )
  }

  return (
    <Switch>
      <Route
        exact
        path={ROUTES.NOTIFIER.BASE}
        component={NotifierLandingPage}
      />
      <Redirect from="*" to={ROUTES.NOTIFIER.BASE} />
    </Switch>
  )
}

export default NotifierRoutes

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
import NotifierLandingPage from './NotifierLandingPage'
import { NotFound } from '..'
import NotifierSellPage from './sell/NotifierSellPage'
import NotifierOffersPage from './buy/NotifierOffersPage'
import NotifierMyOffersPage from './myoffers/NotifierMyOffersPage'
import { buildTabs } from '../routerUtils'

const logger = Logger.getInstance()

const TABS = buildTabs([
  { label: 'Buy', value: ROUTES.NOTIFIER.BUY.BASE },
  { label: 'Sell', value: ROUTES.NOTIFIER.SELL.BASE },
  { label: 'My offers', value: ROUTES.NOTIFIER.MYOFFERS.BASE },
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
                  {DeadEndRoute}
                </Switch>
              </NotifierOffersContextProvider>
            </Route>

            {/* Sell */}
            <Route
              exact
              path={ROUTES.NOTIFIER.SELL.BASE}
              component={NotifierSellPage}
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

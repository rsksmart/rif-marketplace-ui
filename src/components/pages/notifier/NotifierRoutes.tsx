import {
  StyledNavTabProps,
  /* eslint-disable-next-line import/no-unresolved */
} from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
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

const logger = Logger.getInstance()

const TABS: StyledNavTabProps[] = [
  {
    label: 'Buy',
    to: ROUTES.NOTIFIER.BUY.BASE,
    value: ROUTES.NOTIFIER.BUY.BASE,
  },
  {
    label: 'Sell',
    to: ROUTES.NOTIFIER.SELL.BASE,
    value: ROUTES.NOTIFIER.SELL.BASE,
  },
]

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
            <Route path={ROUTES.NOTIFIER.BUY.BASE}>
              <NotifierOffersContextProvider>
                <Switch>
                  <Route
                    exact
                    path={ROUTES.NOTIFIER.BUY.BASE}
                    component={NotifierOffersPage}
                  />
                  <Route component={NotFound} />
                </Switch>
              </NotifierOffersContextProvider>
            </Route>
            <Route
              exact
              path={ROUTES.NOTIFIER.SELL.BASE}
              component={NotifierSellPage}
            />
            <Route component={NotFound} />
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

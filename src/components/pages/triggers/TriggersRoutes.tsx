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
import TriggersLandingPage from './TriggersLandingPage'
import { NotFound } from '..'

const logger = Logger.getInstance()

const TABS: StyledNavTabProps[] = [
  {
    label: 'Sell',
    to: ROUTES.TRIGGERS.SELL.BASE,
    value: ROUTES.TRIGGERS.SELL.BASE,
  },
]

const TriggersRoutes: FC = () => {
  const { pathname } = useLocation()
  const { services } = networkConfig
  const triggersEnabled = services && services.triggers
  const history = useHistory()

  useEffect(() => {
    // TODO: wrap this code block to be excecuted only on debugging
    const unlisten = history.listen((location, action) => {
      logger.debug('TriggersRoutes -> location', location)
      logger.debug('TriggersRoutes -> action', action)
    })
    return (): void => {
      unlisten()
    }
  }, [history])

  if (triggersEnabled) {
    return (
      <Switch>
        <Redirect
          exact
          from={ROUTES.TRIGGERS.BASE}
          to={ROUTES.TRIGGERS.SELL.BASE}
        />

        <TabsTemplate
          title="Notification Services"
          value={getTabValueFromLocation(
            TABS, ROUTES.TRIGGERS.SELL.BASE,
          )(pathname)}
          tabs={TABS}
        >
          <Switch>
            <Route path={ROUTES.TRIGGERS.SELL.BASE}>
              <Switch>
                <Redirect
                  exact
                  from={ROUTES.TRIGGERS.SELL.BASE}
                  to={ROUTES.TRIGGERS.SELL.BASE}
                />
                <Route
                  exact
                  path={ROUTES.TRIGGERS.SELL.BASE}
                // component={TriggersSellPage}
                />
                <Route component={NotFound} />
              </Switch>
            </Route>
          </Switch>
        </TabsTemplate>
      </Switch>
    )
  }

  return (
    <Switch>
      <Route
        exact
        path={ROUTES.TRIGGERS.BASE}
        component={TriggersLandingPage}
      />
      <Redirect from="*" to={ROUTES.TRIGGERS.BASE} />
    </Switch>
  )
}

export default TriggersRoutes

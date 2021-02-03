import React, { FC, useEffect } from 'react'
import {
  Redirect, Route, Switch, useHistory,
} from 'react-router-dom'

import networkConfig from 'config'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import { NotFound } from '..'
import TriggersLandingPage from './TriggersLandingPage'

const logger = Logger.getInstance()

const TriggersRoutes: FC = () => {
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
          to={ROUTES.TRIGGERS.BUY.BASE}
        />

        <Route component={NotFound} />
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

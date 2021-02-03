import React, { useEffect } from 'react'
import {
  Route, Switch, useHistory,
} from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import {
  AboutPage, FAQPage, LandingPage, NotFound,
} from './pages'
import RnsRoutes from './pages/rns/RnsRoutes'
import StorageRoutes from './pages/storage/StorageRoutes'
import TriggersRoutes from './pages/triggers/TriggersRoutes'

const logger = Logger.getInstance()

const Routes = (): JSX.Element => {
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      logger.debug('Routes -> location', location)
      logger.debug('Routes -> action', action)
    })
    return (): void => {
      unlisten()
    }
  }, [history])

  return (
    <Switch>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.FAQ} component={FAQPage} />
      <Route path={ROUTES.RNS.BASE} component={RnsRoutes} />
      <Route path={ROUTES.STORAGE.BASE} component={StorageRoutes} />
      <Route path={ROUTES.TRIGGERS.BASE} component={TriggersRoutes} />
      <Route exact path={ROUTES.ABOUT} component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Routes

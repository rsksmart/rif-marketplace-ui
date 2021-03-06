import React, { useEffect } from 'react'
import {
  Route, Switch, useHistory,
} from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import ErrorBoundary from './error-boundary/ErrorBoundary'
import {
  AboutPage, FAQPage, LandingPage, NotFound,
} from './pages'
import RnsRoutes from './pages/rns/RnsRoutes'
import StorageRoutes from './pages/storage/StorageRoutes'
import NotifierRoutes from './pages/notifier/NotifierRoutes'

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
    <ErrorBoundary>
      <Switch>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route exact path={ROUTES.FAQ} component={FAQPage} />
        <Route path={ROUTES.RNS.BASE} component={RnsRoutes} />
        <Route path={ROUTES.STORAGE.BASE} component={StorageRoutes} />
        <Route path={ROUTES.NOTIFIER.BASE} component={NotifierRoutes} />
        <Route exact path={ROUTES.ABOUT} component={AboutPage} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  )
}

export default Routes

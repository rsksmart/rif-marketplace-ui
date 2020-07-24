import React, { useEffect } from 'react'
import {
  Route, Switch, useHistory,
} from 'react-router-dom'
import ROUTES from 'routes'
import Logger from 'utils/Logger'
import {
  AboutPage, FAQPage, LandingPage, NotFound,
} from './pages'
import StorageLandingPage from './pages/storage/StorageLandingPage'
import RnsRoutes from './pages/rns/RnsRoutes'

const logger = Logger.getInstance()

const Routes = () => {
  const history = useHistory()

  useEffect(() => {
    const unlisten = history.listen((location, action) => {
      logger.debug('Routes -> location', location)
      logger.debug('Routes -> action', action)
    })
    return () => {
      unlisten()
    }
  }, [history])

  return (
    <Switch>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.STORAGE} component={StorageLandingPage} />
      <Route exact path={ROUTES.FAQ} component={FAQPage} />
      <Route path={ROUTES.DOMAINS.BASE} component={RnsRoutes} />
      <Route exact path={ROUTES.ABOUT} component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Routes

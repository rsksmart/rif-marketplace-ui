import React from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import ROUTES from 'routes'
import networkConfig from 'config'
import { NotFound } from '..'
import RnsLandingPage from './RnsLandingPage'
import RNSTabedPages from './RnsTabedPages'

const RnsRoutes = () => {
  const { services } = networkConfig
  const rnsEnabled = services && (services as string[]).includes('rns')

  if (rnsEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.DOMAINS.BASE} to={ROUTES.DOMAINS.BUY.BASE} />
        <Route component={RNSTabedPages} />
        <Route component={NotFound} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path={ROUTES.DOMAINS.BASE} component={RnsLandingPage} />
      <Redirect from="*" to={ROUTES.DOMAINS.BASE} />
    </Switch>
  )
}

export default RnsRoutes

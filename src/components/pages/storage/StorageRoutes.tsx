import React, { FC } from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import ROUTES from 'routes'
import networkConfig from 'config'
import StorageLandingPage from './StorageLandingPage'
import StorageTabedPages from './StorageTabedPages'

const StorageRoutes: FC = () => {
  const { services } = networkConfig
  const storageEnabled = services && (services as string[]).includes('storage')

  if (storageEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.STORAGE.BASE} to={ROUTES.STORAGE.BUY.BASE} />
        <Route component={StorageTabedPages} />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route exact path={ROUTES.STORAGE.BASE} component={StorageLandingPage} />
      <Redirect from="*" to={ROUTES.STORAGE.BASE} />
    </Switch>
  )
}

export default StorageRoutes

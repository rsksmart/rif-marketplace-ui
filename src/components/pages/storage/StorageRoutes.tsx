import React, { FC } from 'react'
import {
  Switch, Route,
} from 'react-router-dom'
import ROUTES from 'routes'
import { NotFound } from '..'
import StorageLandingPage from './StorageLandingPage'

const StorageRoutes: FC<{}> = () => (
  <Switch>
    <Route exact path={ROUTES.STORAGE} component={StorageLandingPage} />
    <Route component={NotFound} />
  </Switch>
)

export default StorageRoutes

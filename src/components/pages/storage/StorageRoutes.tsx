import React from 'react'
import {
  Switch, Route, Redirect,
} from 'react-router-dom'
import ROUTES from 'routes'
import { NotFound } from '..'
import StorageLandingPage from './StorageLandingPage'
import StorageOffersPage from './buy/StorageOffersPage'
import StorageListingPage from './sell/StorageListingPage'

const StorageRoutes = () => (

  <Switch>
    <Redirect exact from={ROUTES.STORAGE.BASE} to={ROUTES.STORAGE.BUY} />
    <Route exact path={ROUTES.STORAGE.BASE} component={StorageLandingPage} />
    <Route exact path={ROUTES.STORAGE.BUY} component={StorageOffersPage} />
    <Route exact path={ROUTES.STORAGE.SELL} component={StorageListingPage} />
    <Route component={NotFound} />
  </Switch>
)

export default StorageRoutes

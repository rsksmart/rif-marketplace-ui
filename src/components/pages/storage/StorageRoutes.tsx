/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import withTabs from 'components/hoc/withTabs'
import networkConfig from 'config'
import React, { FC } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import ROUTES from 'routes'
import { StorageListingStoreProvider } from 'store/Market/storage/ListingStore'
import { StorageListingPage, StorageOffersPage } from '.'
import { NotFound } from '..'
import StorageOfferListed from './sell/StorageOfferListed'
import StorageLandingPage from './StorageLandingPage'

const TABS: StyledNavTabProps[] = [
  {
    label: 'Buy',
    to: ROUTES.STORAGE.BUY.BASE,
    value: ROUTES.STORAGE.BUY.BASE,
  },
  {
    label: 'Sell',
    to: ROUTES.STORAGE.SELL.BASE,
    value: ROUTES.STORAGE.SELL.BASE,
  },
  {
    label: 'My offers',
    to: ROUTES.STORAGE.MYOFFERS.BASE,
    value: ROUTES.STORAGE.MYOFFERS.BASE,
  },
  {
    label: 'My purchases',
    to: ROUTES.STORAGE.MYPURCHASES.BASE,
    value: ROUTES.STORAGE.MYPURCHASES.BASE,
  },
]

const StorageRoutes: FC = () => {
  const { services } = networkConfig
  const storageEnabled = services && (services as string[]).includes('storage')

  if (storageEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.STORAGE.BASE} to={ROUTES.STORAGE.BUY.BASE} />
        {
          withTabs({ tabs: TABS, title: 'Storage' })(() => (
            <Switch>
              <Route exact path={ROUTES.STORAGE.BUY.BASE} component={StorageOffersPage} />
              <Route exact path={ROUTES.STORAGE.SELL.BASE}>
                <StorageListingStoreProvider>
                  <StorageListingPage />
                </StorageListingStoreProvider>
              </Route>
              <Route exact path={ROUTES.STORAGE.SELL.DONE} component={StorageOfferListed} />
              <Route component={NotFound} />
            </Switch>
          ))
        }
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

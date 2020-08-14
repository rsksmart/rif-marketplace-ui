import React from 'react'
import {
  Switch, Route, Redirect, useHistory,
} from 'react-router-dom'
import ROUTES from 'routes'
import networkConfig from 'config'
import { StorageListingStoreProvider } from 'store/Market/storage/ListingStore'
/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import { NotFound } from '..'
import StorageLandingPage from './StorageLandingPage'
import StorageOffersPage from './buy/StorageOffersPage'
import StorageListingPage from './sell/StorageListingPage'
import StorageOfferListed from './sell/StorageOfferListed'
import TabsTemplate from '../../templates/TabsTemplate'

const TabedPages = () => {
  const history = useHistory()
  // TODO: register routes and components for the new pages
  const tabs: StyledNavTabProps[] = [
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
      to: '/storage/myoffers',
      value: '/storage/myoffers',
    },
    {
      label: 'My purchases',
      to: '/storage/mypurchases',
      value: '/storage/mypurchases',
    },
  ]

  const getTabValueFromLocation = () => {
    const { location: { pathname } } = history
    const activeTab = tabs.find(tab => pathname.includes(tab.to))
    return activeTab?.to || ROUTES.STORAGE.BUY.BASE
  }

  return (
    <TabsTemplate title="Storage"
      value={getTabValueFromLocation()}
      tabs={tabs}>
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
    </TabsTemplate>
  )
}

const StorageRoutes = () => {
  const { services } = networkConfig
  const storageEnabled = services && (services as string[]).includes('storage')

  if (storageEnabled) {
    return (
      <Switch>
        <Redirect exact from={ROUTES.STORAGE.BASE} to={ROUTES.STORAGE.BUY.BASE} />
        <Route component={TabedPages} />
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

import React, { FC } from 'react'
import { useLocation, Route, Switch } from 'react-router-dom'
import ROUTES from 'routes'
import TabsTemplate from 'components/templates/TabsTemplate'
import { StorageListingStoreProvider } from 'store/Market/storage/ListingStore'
/* eslint-disable-next-line import/no-unresolved */
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'
import { NotFound } from '..'
import StorageOffersPage from './buy/StorageOffersPage'
import StorageListingPage from './sell/StorageListingPage'
import StorageOfferListed from './sell/StorageOfferListed'

const StorageTabedPages: FC = () => {
  const location = useLocation()
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
      to: ROUTES.STORAGE.MYOFFERS.BASE,
      value: ROUTES.STORAGE.MYOFFERS.BASE,
    },
    {
      label: 'My purchases',
      to: ROUTES.STORAGE.MYPURCHASES.BASE,
      value: ROUTES.STORAGE.MYPURCHASES.BASE,
    },
  ]

  const getTabValueFromLocation = () => {
    const { pathname } = location
    const activeTab = tabs.find((tab) => pathname.includes(tab.to))
    return activeTab?.to || ROUTES.STORAGE.BUY.BASE
  }

  return (
    <TabsTemplate
      title="Storage"
      value={getTabValueFromLocation()}
      tabs={tabs}
    >
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

export default StorageTabedPages

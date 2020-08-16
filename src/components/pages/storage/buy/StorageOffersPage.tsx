import React, { FC, useContext, useState } from 'react'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import StorageOffersContext from 'store/Market/storage/OffersContext'

const StorageOffersPage: FC = () => {

  const offersContext = useContext(StorageOffersContext)
  const [state, setState] = useState(offersContext)

  const headers = {
    provider: 'Provider',
    location: 'Location',
    system: 'System',
    availableSize: 'Available Size',
    subscriptionOptions: 'Subscription Options',
    pricePerGb: 'Price/GB',
    action1: '',
  }
  const itemCollection = []

  // const heading = () => <Typography>Result</Typography>

  return (
    <MarketPageTemplate
      className="Storage Offers"
      filterItems={<StorageFilters />}
      itemCollection={itemCollection}
      headers={headers}
      dispatch={() => { }}
      outdatedCt={0}
      // heading={heading}
    />
  )
}

export default StorageOffersPage

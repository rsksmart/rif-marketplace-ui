import React, { FC, useContext, useEffect } from 'react'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { TableHeaders, MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { SelectRowButton, AddressItem } from 'components/molecules'
import StorageOffersContext, { StorageOffersContextProps } from 'context/Services/storage/OffersContext'
import ItemWUnit from 'components/atoms/ItemWUnit'

const headers: TableHeaders = {
  provider: 'Provider',
  system: 'System',
  availableSize: 'Available Size',
  subscriptionOptions: 'Subscription Period',
  averagePrice: 'Price/GB/Day',
  action1: '',
}

const StorageOffersPage: FC = () => {
  const {
    state: {
      listing: { items },
    },
    dispatch,
  } = useContext<StorageOffersContextProps>(StorageOffersContext)
  // const history = useHistory()

  useEffect(() => () => {
    dispatch({
      type: 'CLEAN_UP',
      payload: {},
    })
  }, [dispatch])

  const collection = items
    .map<MarketplaceItem>((item) => {
      const {
        id, system, availableSizeGB, averagePrice, subscriptionOptions,
      } = item

      return {
        id,
        provider: <AddressItem value={id} />,
        system,
        availableSize: <ItemWUnit type="mediumPrimary" unit="GB" value={availableSizeGB.toString()} />,
        subscriptionOptions: subscriptionOptions
          .map((plan: BillingPlan) => plan.period as string)
          .reverse()
          .reduce((lastWord, currentWord) => `${lastWord} - ${currentWord}`),
        averagePrice: <ItemWUnit type="mediumPrimary" value={averagePrice.toString()} unit="USD" />,
        action1: <SelectRowButton
          id={id}
          handleSelect={() => {
            // dispatch({
            //   type: 'SET_ORDER',
            //   payload: {
            //     item,
            //   } as OrderPayload,
            // })
            // history.push(ROUTES.STORAGE.BUY.CHECKOUT)
          }}
        />,
      }
    })

  return (
    <MarketPageTemplate
      className="Storage Offers"
      filterItems={<StorageFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
    />
  )
}

export default StorageOffersPage

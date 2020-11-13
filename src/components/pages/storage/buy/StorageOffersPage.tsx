import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { TableHeaders, MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { SelectRowButton, AddressItem } from 'components/molecules'
import { StorageOffersContext, StorageOffersContextProps } from 'context/Services/storage/offers'
import { OrderPayload } from 'context/Services/storage/offers/offersActions'
import ItemWUnit from 'components/atoms/ItemWUnit'
import ROUTES from 'routes'

const headers: TableHeaders = {
  provider: 'Provider',
  system: 'System',
  availableSize: 'Available Size',
  availableCurrencies: 'Currency',
  subscriptionOptions: 'Subscription Period',
  averagePrice: 'Price/GB/Month',
  action1: '',
}

const StorageOffersPage: FC = () => {
  const history = useHistory()
  const {
    state: {
      listing: { items },
    },
    dispatch,
  } = useContext<StorageOffersContextProps>(StorageOffersContext)

  const collection = items
    .map<MarketplaceItem>((item) => {
      const {
        id, system, availableSizeGB, averagePrice,
        subscriptionOptions, acceptedCurrencies,
      } = item
      return {
        id,
        provider: <AddressItem value={id} />,
        system,
        availableSize: <ItemWUnit type="mediumPrimary" unit="GB" value={availableSizeGB.toString()} />,
        subscriptionOptions: Array.from(new Set(
          subscriptionOptions.map((plan: BillingPlan) => plan.period as string),
        )).join(' - '),
        availableCurrencies: acceptedCurrencies.join(' - ').toUpperCase(),
        averagePrice: <ItemWUnit type="mediumPrimary" value={averagePrice.toString()} unit="USD" />,
        action1: <SelectRowButton
          id={id}
          handleSelect={(): void => {
            dispatch({
              type: 'SET_ORDER',
              payload: {
                item,
              } as OrderPayload,
            })
            history.push(ROUTES.STORAGE.BUY.CHECKOUT)
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

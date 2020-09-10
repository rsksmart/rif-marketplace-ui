import React, { FC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { TableHeaders, MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { CombinedPriceCell, SelectRowButton, AddressItem } from 'components/molecules'
import MarketContext from 'context/Market/MarketContext'
import StorageOffersContext, { StorageOffersContextProps } from 'context/Services/storage/OffersContext'
import ItemWUnit from 'components/atoms/ItemWUnit'
import ROUTES from 'routes'
import { OrderPayload } from 'context/Services/storage/offersActions'

const headers: TableHeaders = {
  provider: 'Provider',
  system: 'System',
  availableSize: 'Available Size',
  subscriptionOptions: 'Subscription Period',
  averagePrice: 'Price/GB/Day',
  action1: '',
}

const StorageOffersPage: FC = () => {
  const history = useHistory()
  const {
    state: {
      exchangeRates: {
        currentFiat,
        crypto,
      },
    },
  } = useContext(MarketContext)
  const {
    state: {
      listing: { items },
    },
    dispatch,
  } = useContext<StorageOffersContextProps>(StorageOffersContext)

  const collection = items
    .map<MarketplaceItem>((item) => {
      const {
        id, system, availableSizeGB, averagePrice, subscriptionOptions,
      } = item

      const { rate, displayName } = crypto.rbtc // FIXME: remove hard-coded currency

      return {
        id,
        provider: <AddressItem value={id} />,
        system,
        availableSize: <ItemWUnit type="mediumPrimary" unit="GB" value={availableSizeGB.toString()} />,
        subscriptionOptions: subscriptionOptions
          .map((plan: BillingPlan) => plan.period as string)
          .reverse()
          .reduce((lastWord, currentWord) => `${lastWord} - ${currentWord}`),
        averagePrice: <CombinedPriceCell
          price={averagePrice.toString()}
          priceFiat={(averagePrice * rate).toString()}
          currency={displayName}
          currencyFiat={currentFiat.displayName}
          divider=" "
        />,
        action1: <SelectRowButton
          id={id}
          handleSelect={() => {
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

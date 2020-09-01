import React, { FC, useContext } from 'react'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { TableHeaders, MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { CombinedPriceCell, SelectRowButton, AddressItem } from 'components/molecules'
import MarketContext from 'context/Market/MarketContext'
import StorageOffersContext, { StorageOffersCtxProps } from 'context/Services/storage/OffersContext'
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
  } = useContext<StorageOffersCtxProps>(StorageOffersContext)
  // const history = useHistory()

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
          .map((plan: BillingPlan) => plan.period)
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

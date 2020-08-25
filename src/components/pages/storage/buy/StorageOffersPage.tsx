import React, { FC, useContext } from 'react'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { TableHeaders } from 'components/templates/marketplace/Marketplace'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { CombinedPriceCell, SelectRowButton, AddressItem } from 'components/molecules'
import MarketContext from 'context/Market/MarketContext'
import StorageOffersContext, { StorageOffersCtxProps } from 'context/Services/storage/OffersContext'
import ItemWUnit from 'components/atoms/ItemWUnit'

const TABLE_HEADERS: TableHeaders = {
  provider: 'Provider',
  system: 'System',
  availableSize: 'Available Size',
  subscriptionOptions: 'Subscription Period',
  pricePGBPDay: 'Price/GB/Day',
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

  const itemCollection = items.map((item) => {
    const {
      id, system, availableSize, pricePGBPDay, subscriptionOptions,
    } = item

    const { rate, displayName } = crypto.rbtc // FIXME: remove hard-coded currency

    return {
      id,
      provider: <AddressItem value={id} />,
      system,
      availableSize: <ItemWUnit type="mediumPrimary" unit="GB" value={availableSize.toString()} />,
      subscriptionOptions: subscriptionOptions
        .map((plan: BillingPlan) => plan.period)
        .reduce((lastWord, currentWord) => `${lastWord} - ${currentWord}`),
      pricePGBPDay: <CombinedPriceCell
        price={pricePGBPDay.toString()}
        priceFiat={pricePGBPDay.times(rate).toString()}
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
  }) as any // FIXME: remove as any -> Change the itemCollection type

  // const heading = () => <Typography>Result</Typography>

  return (
    <MarketPageTemplate
      className="Storage Offers"
      filterItems={<StorageFilters />}
      itemCollection={itemCollection}
      headers={TABLE_HEADERS}
      dispatch={dispatch as any} // FIXME: Change the type in the MarketPageTemplate
      outdatedCt={0}
    // heading={heading}
    />
  )
}

export default StorageOffersPage

import React, { FC, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import StorageFilters from 'components/organisms/filters/storage/StorageFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { TableHeaders, MarketplaceItem } from 'components/templates/marketplace/Marketplace'
import { BillingPlan } from 'models/marketItems/StorageItem'
import { SelectRowButton, RifAddress } from 'components/molecules'
import { StorageOffersContext, StorageOffersContextProps } from 'context/Services/storage/offers'
import ItemWUnit from 'components/atoms/ItemWUnit'
import ROUTES from 'routes'
import { Web3Store } from '@rsksmart/rif-ui'
import AppContext from 'context/App'
import { STORAGE_DISCLAIMER_MSG } from 'constants/strings'

const headers: TableHeaders = {
  provider: 'Provider',
  system: 'System',
  availableSize: 'Available Size',
  availableCurrencies: 'Currency',
  subscriptionOptions: 'Subscription Period',
  averagePrice: 'Price/GB/Month (AVG)',
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
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)
  const {
    dispatch: appDispatch,
  } = useContext(AppContext)

  useEffect(() => {
    appDispatch({
      type: 'SET_ALERT',
      payload: {
        message: STORAGE_DISCLAIMER_MSG,
      },
    })
  }, [appDispatch])

  useEffect(() => (): void => {
    appDispatch({
      type: 'HIDE_ALERT',
    })
  }, [appDispatch])

  const collection = items
    .map<MarketplaceItem>((item) => {
      const {
        id, system, availableSizeGB, averagePrice,
        subscriptionOptions, acceptedCurrencies,
      } = item

      const isOwnAccount = account === id

      return {
        id,
        provider: <RifAddress value={id} />,
        system,
        availableSize: <ItemWUnit type="mediumPrimary" unit="GB" value={availableSizeGB.toString()} />,
        subscriptionOptions: Array.from(new Set(
          subscriptionOptions.map((plan: BillingPlan) => plan.period as string),
        )).join(' - '),
        availableCurrencies: acceptedCurrencies.join(' - ').toUpperCase(),
        averagePrice: <ItemWUnit type="mediumPrimary" value={averagePrice.toString()} unit="USD" />,
        action1: isOwnAccount ? 'your offer' : (
          <SelectRowButton
            id={id}
            handleSelect={(): void => {
              dispatch({
                type: 'SET_ORDER',
                payload: item,
              })
              history.push(ROUTES.STORAGE.BUY.CHECKOUT)
            }}
          />
        ),
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

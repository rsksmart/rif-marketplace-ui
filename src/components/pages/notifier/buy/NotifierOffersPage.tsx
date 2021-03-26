import { Web3Store } from '@rsksmart/rif-ui'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
import NotifierOffersFilters from 'components/organisms/filters/notifier/OffersFilters'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import MarketContext, { MarketContextProps } from 'context/Market'
import { NotifierOffersContext, NotifierOffersContextProps } from 'context/Services/notifier/offers'
import React, { FC, useContext } from 'react'
import { mapPlansToOffers } from './utils'

const headers: TableHeaders = {
  provider: 'Provider',
  notifLimitRange: 'Notifications',
  channels: 'Channels',
  currencies: 'Currencies',
  priceFiatRange: 'Price',
  action1: '',
}

const NotifierOffersPage: FC = () => {
  const {
    state: {
      contextID,
      listing: { items },
    },
    dispatch,
  } = useContext<NotifierOffersContextProps>(NotifierOffersContext)
  const {
    state: {
      exchangeRates: {
        currentFiat: {
          displayName: currentFiat,
        },
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  if (!crypto.rbtc) return null

  const providers = Array.from(new Set(items.map(({ provider }) => provider)))

  const collection: MarketplaceItem[] = providers
    .map<MarketplaceItem>((provider) => {
      const providerPlans = items.filter((item) => item.provider === provider)

      const { priceFiatRange, ...offerDetails } = mapPlansToOffers(
        providerPlans, crypto,
      )

      return {
        id: provider,
        provider: <AddressItem value={provider} />,
        ...offerDetails,
        priceFiatRange: (
          <ItemWUnit
            type="mediumPrimary"
            value={priceFiatRange}
            unit={currentFiat}
          />
        ),
        action1: account === provider ? 'your offer' : (
          <SelectRowButton
            id={provider}
            handleSelect={(): void => {
              // TODO: dispatch order and redirect to the checkout page
              // dispatch({
              //   type: 'SET_ORDER',
              //   payload: item,
              // })
              // history.push(ROUTES.STORAGE.BUY.CHECKOUT)
            }}
          />
        ),
      }
    })

  return (
    <MarketPageTemplate
      className={contextID}
      filterItems={<NotifierOffersFilters />}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
    />
  )
}

export default NotifierOffersPage

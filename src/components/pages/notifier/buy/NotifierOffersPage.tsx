import { Web3Store } from '@rsksmart/rif-ui'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
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

  const collection: MarketplaceItem[] = items
    .map<MarketplaceItem>((item) => {
      const {
        id,
        provider,
      } = item

      const { priceFiatRange, ...offerDetails } = mapPlansToOffers(
        item, crypto,
      )

      return {
        id,
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
      filterItems={null}
      items={collection}
      headers={headers}
      dispatch={dispatch}
      outdatedCt={0}
    />
  )
}

export default NotifierOffersPage

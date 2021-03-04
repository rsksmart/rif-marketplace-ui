import React, { FC, useContext } from 'react'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import { NotifierOffersContextProps, NotifierOffersContext } from 'context/Services/notifier/offers'
import { AddressItem, SelectRowButton } from 'components/molecules'
import ItemWUnit from 'components/atoms/ItemWUnit'
import MarketContext, { MarketContextProps } from 'context/Market'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { Web3Store } from '@rsksmart/rif-ui'

const headers: TableHeaders = {
  provider: 'Provider',
  amountRange: 'Notifications',
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
      },
    },
  } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  const collection: MarketplaceItem[] = items
    .map<MarketplaceItem>((item) => {
      const {
        id,
        channels,
        currencies,
        amountRange,
        priceFiatRange,
        provider,
      } = item
      return {
        id,
        provider: <AddressItem value={provider} />,
        channels: channels.join(', '),
        currencies: currencies
          .map((currency) => SUPPORTED_TOKEN_RECORDS[currency]
            .displayName)
          .join(', '),
        amountRange: amountRange.join(', '),
        priceFiatRange: (
          <ItemWUnit
            type="mediumPrimary"
            value={priceFiatRange.join(', ').toString()}
            unit={currentFiat}
          />
        ),
        action1: account === provider ? 'your offer' : (
          <SelectRowButton
            id={id}
            handleSelect={(): void => {
              dispatch({
                type: 'SET_ORDER',
                payload: item,
              })
              // TODO: redirect to the checkout page history.push(ROUTES.STORAGE.BUY.CHECKOUT)
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

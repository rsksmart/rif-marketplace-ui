import { Web3Store } from '@rsksmart/rif-ui'
import ItemWUnit from 'components/atoms/ItemWUnit'
import { AddressItem, SelectRowButton } from 'components/molecules'
import MarketPageTemplate from 'components/templates/MarketPageTemplate'
import { MarketplaceItem, TableHeaders } from 'components/templates/marketplace/Marketplace'
import MarketContext, { MarketContextProps } from 'context/Market'
import { NotifierOffersContext, NotifierOffersContextProps } from 'context/Services/notifier/offers'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import React, { FC, useContext } from 'react'

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
        crypto,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)
  const {
    state: {
      account,
    },
  } = useContext(Web3Store)

  if (!crypto.rif) return null

  const collection: MarketplaceItem[] = items
    .map<MarketplaceItem>((item) => {
      const {
        id: provider,
        plans,
      } = item

      // FIXME: Refactor
      const channels = Array.from(new Set(plans.flatMap((plan) => plan.channels))).join(', ')
      const allCurrencis = plans.flatMap((plan) => plan.priceOptions.map((option) => SUPPORTED_TOKEN_RECORDS[option.token].displayName))
      const allAmounts = plans.flatMap((plan) => plan.limit).sort()
      const allPrices = plans.flatMap((plan) => plan.priceOptions.map((option) => {
        const xrRate = crypto[option.token].rate
        return option.value.mul(xrRate)
      })).sort()

      const currencies = allCurrencis.length - 1 ? `${allCurrencis[0]}, ${allCurrencis[allCurrencis.length - 1]}` : allCurrencis[0]
      const amountRange = allAmounts.length - 1 ? `${allAmounts[0]}-${allAmounts[allAmounts.length - 1]}` : allAmounts[0]
      const priceRangeFiat = allPrices.length - 1 ? `${allPrices[0].toString()}-${allPrices[allPrices.length - 1].toString()}` : allPrices[0].toString()

      return {
        id: provider,
        provider: <AddressItem value={provider} />,
        channels,
        currencies,
        amountRange,
        priceFiatRange: (
          <ItemWUnit
            type="mediumPrimary"
            value={priceRangeFiat}
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

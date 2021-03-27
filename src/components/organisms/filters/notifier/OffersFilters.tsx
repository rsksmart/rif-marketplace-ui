import { CheckboxProps } from '@material-ui/core'
import { Accordion, FilterCheckboxCard } from '@rsksmart/rif-ui'
import MarketContext from 'context/Market'
import { NotifierOffersContext } from 'context/Services/notifier/offers'
import { SUPPORTED_TOKEN_RECORDS } from 'contracts/interfaces'
import { MinMaxFilter } from 'models/Filters'
import { SupportedTokenSymbol } from 'models/Token'
import React, { FC, useContext } from 'react'
import { Modify } from 'utils/typeUtils'
import RangeFilter from '../RangeFilter'

const SIZE_STEP = 0.01

const NotifierOffersFilters: FC = () => {
  const {
    state: {
      filters: {
        size: sizeFilter,
        price: priceFilter,
        currency: currencies,
      },
      limits: {
        price: priceLimits,
        size: sizeLimits,
      },
    },
    dispatch,
  } = useContext(NotifierOffersContext)
  const {
    state: { exchangeRates: { currentFiat: { symbol: fiatSymbol } } },
  } = useContext(MarketContext)

  const onSizeChange = ((size: MinMaxFilter): void => {
    dispatch({
      type: 'FILTER',
      payload: { size },
    })
  })

  const onPriceChange = ((price: MinMaxFilter): void => {
    dispatch({
      type: 'FILTER',
      payload: {
        price: {
          ...price,
          fiatSymbol,
        },
      },
    })
  })

  const onCurrencyChange = (
    symbol: SupportedTokenSymbol,
  ) => (_: unknown, checked: boolean): void => {
    const currency = new Set(currencies)

    if (checked) currency.add(symbol)
    else currency.delete(symbol)

    dispatch({
      type: 'FILTER',
      payload: { currency },
    })
  }

  const supportedSymbols = Array.from(
    Object.keys(SUPPORTED_TOKEN_RECORDS) as SupportedTokenSymbol[],
  )
  const currencyOptions: Modify<CheckboxProps, {
    labelText: string
    id: SupportedTokenSymbol
  }>[] = supportedSymbols.map((symbol) => ({
    labelText: SUPPORTED_TOKEN_RECORDS[symbol].displayName,
    id: symbol,
    onChange: onCurrencyChange(symbol),
  }))

  return (
    <>
      <RangeFilter
        title="Number of notifications"
        values={{
          start: Math.floor(sizeFilter.min),
          end: Math.ceil(sizeFilter.max),
        }}
        edgeValues={sizeLimits}
        unit=""
        handleChange={onSizeChange}
        step={SIZE_STEP}
      />
      <RangeFilter
        title="Price"
        values={{
          start: priceFilter.min,
          end: priceFilter.max,
        }}
        edgeValues={priceLimits}
        unit="USD"
        handleChange={onPriceChange}
      />
      <Accordion
        id="periodsFilter"
        expanded
        title="Currency"
      >
        <FilterCheckboxCard items={currencyOptions} />
      </Accordion>
    </>
  )
}

export default NotifierOffersFilters

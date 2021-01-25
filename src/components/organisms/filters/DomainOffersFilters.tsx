import React, { FC, useContext } from 'react'
import RnsOffersContext from 'context/Services/rns/OffersContext'
import { MinMaxFilter } from 'models/Filters'
import { SUPPORTED_FIAT } from 'api/rif-marketplace-cache/rates/xr'
import RangeFilter from './RangeFilter'
import SearchFilter from './SearchFilter'

const DomainOfferFilters: FC<{}> = () => {
  // - juraj
  // symbol from:
  // 1. props: DomainOffersPage
  // 2. MarketContext.symbol: SupportedFiat
  const {
    state: {
      filters: {
        name,
        price: {
          min: minPrice,
          max: maxPrice,
          // symbol: 'usd',
        },
      },
      limits: {
        price: {
          min: absMinPrice,
          max: absMaxPrice,
        },
      },
    },
    dispatch,
  } = useContext(RnsOffersContext)

  return (
    <>
      <SearchFilter
        value={name}
        onChange={(evt) => {
          const { currentTarget } = evt
          const value = currentTarget.value.trim()
          dispatch({
            type: 'FILTER',
            payload: { name: value },
          })
        }}
        placeholder="Search your domain"
      />
      <RangeFilter
        title="Price"
        values={{
          start: minPrice,
          end: maxPrice,
        }}
        edgeValues={{
          min: absMinPrice,
          max: absMaxPrice,
        }}
        // - juarj
        // [SUPPORTED_FIAT, symbol: from *[props, context]]*
        // string not needed
        unit={SUPPORTED_FIAT['usd'/* symbol */].displayName as string}
        handleChange={(price: MinMaxFilter) => {
          dispatch({
            type: 'FILTER',
            payload: { price },
          })
        }}
      />
    </>
  )
}

export default DomainOfferFilters

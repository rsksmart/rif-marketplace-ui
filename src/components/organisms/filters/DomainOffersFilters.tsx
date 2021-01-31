import React, { FC, useContext } from 'react'
import RnsOffersContext from 'context/Services/rns/OffersContext'
import { MinMaxFilter } from 'models/Filters'
import MarketContext, { MarketContextProps } from 'context/Market'
import RangeFilter from './RangeFilter'
import SearchFilter from './SearchFilter'

const DomainOfferFilters: FC<{}> = () => {
  const {
    state: {
      filters: {
        name,
        price: {
          min: minPrice,
          max: maxPrice,
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

  const {
    state: {
      exchangeRates: {
        currentFiat,
      },
    },
  } = useContext<MarketContextProps>(MarketContext)

  return (
    <>
      <SearchFilter
        value={name}
        onChange={(evt): void => {
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
        unit={currentFiat.displayName}
        handleChange={(price: MinMaxFilter): void => {
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

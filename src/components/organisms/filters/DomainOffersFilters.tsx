import { PriceFilter } from 'api/models/RnsFilter'
import React, { FC, useContext } from 'react'
import RnsOffersStore from 'store/Market/rns/OffersStore'
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
  } = useContext(RnsOffersStore)

  return (
    <>
      <SearchFilter
        value={name || ''}
        onChange={(evt) => {
          const { currentTarget } = evt
          const value = currentTarget.value.trim()
          dispatch({
            type: 'FILTER',
            payload: { name: value },
          })
        }}
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
        unit="RIF"
        handleChange={(price: PriceFilter) => {
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

import React, { FC, useContext } from 'react'
import RnsOffersContext from 'context/Services/rns/OffersContext'
import { MinMaxFilter } from 'models/Filters'
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
        unit="RIF"
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

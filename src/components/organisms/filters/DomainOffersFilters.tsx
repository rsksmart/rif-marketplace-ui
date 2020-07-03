import React, { FC, useContext, useState, useEffect } from 'react'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore from 'store/Market/MarketStore'
import RangeFilter from './RangeFilter'
import SearchFilter from './SearchFilter'
import { RnsFilter, PriceFilter } from 'api/models/RnsFilter'
import RnsOffersStore from 'store/Market/rns/OffersStore'
import AppStore from 'store/App/AppStore'

const DomainOfferFilters: FC<{}> = () => {
  const {
    state: {
      filters: {
        name,
        price: {
          min: minPrice,
          max: maxPrice
        },
      },
    },
    dispatch,
  } = useContext(RnsOffersStore)
  const {
    state: {
      apis: {
        offers: {
          fetchPriceLimits
        }
      }
    }
  } = useContext(AppStore)

  const [absMinPrice, setAbsMinPrice] = useState(minPrice)
  const [absMaxPrice, setAbsMaxPrice] = useState(maxPrice)

  useEffect(() => {
    const fetchLimits = async () => {
      const price = await fetchPriceLimits()
      dispatch({
        type: 'FILTER',
        payload: { price }
      })

      setAbsMinPrice(price.min)
      setAbsMaxPrice(price.max)
    }
    fetchLimits()
  }, [])


  return (
    <>
      <SearchFilter
        value={name || ''}
        onChange={(evt) => {
          const { currentTarget } = evt
          const name = currentTarget.value.trim()
          dispatch({
            type: 'FILTER',
            payload: { name },
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

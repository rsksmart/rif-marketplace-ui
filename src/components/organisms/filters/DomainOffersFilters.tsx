import React, {
  FC, useContext, useState, useEffect,
} from 'react'
import MarketStore from 'store/Market/MarketStore'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import { fetchMinMaxPrice } from 'api/rif-marketplace-cache/domainsController'
import SearchFilter from './SearchFilter'
import RangeFilter from './RangeFilter'

const DomainOfferFilters: FC<{}> = () => {
  const {
    state: {
      currentListing,
      filters: {
        domainOffers: {
          domain,
          price: {
            $gte: curMinPrice,
            $lte: curMaxPrice,
          },
        },
      },
    },
    dispatch,
  } = useContext(MarketStore)
  const nameFilter = domain?.name
  const servicePath = currentListing?.servicePath
  const searchValue = (nameFilter && nameFilter.$like) || ''
  const [absMinPrice, setAbsMinPrice] = useState(curMinPrice)
  const [absMaxPrice, setAbsMaxPrice] = useState(curMaxPrice)

  useEffect(() => {
    if (servicePath) {
      fetchMinMaxPrice()
        .then(({ minPrice, maxPrice }) => {
          dispatch({
            type: MARKET_ACTIONS.SET_FILTER,
            payload: {
              filterItems: {
                price: {
                  $gte: minPrice,
                  $lte: maxPrice,
                },
              },
            },
          })
          setAbsMinPrice(minPrice)
          setAbsMaxPrice(maxPrice)
        })
    }
  }, [servicePath, dispatch])

  const handlePriceChange = ({ min, max }) => {
    dispatch({
      type: MARKET_ACTIONS.SET_FILTER,
      payload: {
        filterItems: {
          price: {
            $gte: min,
            $lte: max,
          },
        },
      },
    })
  }
  return (
    <>
      <SearchFilter
        value={searchValue}
        onChange={(evt) => {
          const { currentTarget } = evt
          const value = currentTarget.value.trim()
          dispatch({
            type: MARKET_ACTIONS.SET_FILTER,
            payload: {
              filterItems: {
                domain: value && {
                  name: { $like: value },
                },
              },
            },
          })
        }}
      />
      <RangeFilter
        title="Price"
        values={{
          start: curMinPrice,
          end: curMaxPrice,
        }}
        edgeValues={{
          min: absMinPrice,
          max: absMaxPrice,
        }}
        unit="RIF"
        handleChange={({ min, max }) => {
          handlePriceChange({ min, max })
        }}
      />
    </>
  )
}

export default DomainOfferFilters

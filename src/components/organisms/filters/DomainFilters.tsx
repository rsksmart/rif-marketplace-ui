import React, { useContext } from 'react'
import { MARKET_ACTIONS } from 'store/Market/marketActions'
import MarketStore, { TxType } from 'store/Market/MarketStore'
import { SellDomainStatus } from 'models/marketItems/DomainItem'
import RadioFilter from './RadioFilter'
import SearchFilter from './SearchFilter'

const DomainFilters = () => {
  const {
    state: {
      filters: {
        domains: {
          name: nameFilter,
          status: statusFilter,
        },
      },
    },
    dispatch,
  } = useContext(MarketStore)

  const searchValue = (nameFilter && nameFilter.$like) || ''

  const domainStatusFilters = [
    {
      value: SellDomainStatus.OWNED,
      label: 'Your domains',
    },
    {
      value: SellDomainStatus.PLACED,
      label: 'Your offers',
    },
    {
      value: SellDomainStatus.SOLD,
      label: 'Sold domains',
    },
  ]

  const handleOnRadioChange = (_: any, value: string) => {
    dispatch({
      type: MARKET_ACTIONS.SET_FILTER,
      payload: {
        filterItems: {
          status: value,
        },
      },
    })
    dispatch({
      type: MARKET_ACTIONS.TOGGLE_TX_TYPE,
      payload: {
        txType: TxType.SELL,
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
          const name = value ? { $like: value } : undefined
          dispatch({
            type: MARKET_ACTIONS.SET_FILTER,
            payload: {
              filterItems: {
                name,
              },
            },
          })
        }}
      />
      <RadioFilter
        title="Domain Status"
        items={domainStatusFilters}
        value={statusFilter}
        onChange={handleOnRadioChange}
      />
    </>
  )
}

export default DomainFilters

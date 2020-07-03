import React, { useContext } from 'react'
import RadioFilter from './RadioFilter'
import SearchFilter from './SearchFilter'
import RnsDomainsStore from 'store/Market/rns/DomainsStore'
import { DomainsSaleStatus } from 'api/models/RnsFilter'

type StatusFilter = {
  value: DomainsSaleStatus
  label: string
}

const DomainFilters = () => {
  const {
    state: {
      filters: {
        name,
        status: statusFilter,
      },
    },
    dispatch,
  } = useContext(RnsDomainsStore)

  const domainStatusFilters: StatusFilter[] = [
    {
      value: 'owned',
      label: 'Your domains',
    },
    {
      value: 'placed',
      label: 'Your offers',
    },
    {
      value: 'sold',
      label: 'Sold domains',
    },
  ]

  const handleOnRadioChange = (_: any, value: string) => {
    dispatch({
      type: 'FILTER',
      payload: {
        status: value,
      },
    })
  }

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

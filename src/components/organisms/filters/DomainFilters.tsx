import React, { FC, useContext } from 'react'
import RnsDomainsContext from 'context/Services/rns/DomainsContext'
import { DomainsSaleStatus } from 'api/models/RnsFilter'
import RadioFilter from './RadioFilter'
import SearchFilter from './SearchFilter'

type StatusFilter = {
  value: DomainsSaleStatus
  label: string
}

const DomainFilters: FC = () => {
  const {
    state: {
      filters: {
        name,
        status: statusFilter,
      },
    },
    dispatch,
  } = useContext(RnsDomainsContext)

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

  const handleOnRadioChange = (_, value: string): void => {
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

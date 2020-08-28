import React, { useContext } from 'react'
import { Accordion, LabeledCheckbox } from '@rsksmart/rif-ui'

import StorageOffersContext from 'context/Services/storage/OffersContext'
import { MinMaxFilter } from 'models/Filters'
import AutoCompleteCheckbox from '../AutoCompleteCheckbox'
import RangeFilter from '../RangeFilter'
import SearchFilter from '../SearchFilter'

const StorageFilters = () => {
  const {
    state: {
      filters: {
        name,
        price: priceFilter,
        size: sizeFilter,
      },
      limits: {
        price: priceLimits,
        size: sizeLimits,
      },
    },
    dispatch,
  } = useContext(StorageOffersContext)

  const storageCurrencyFilters = [
    { labelText: 'RIF', id: 'RIF' },
    { labelText: 'R-BTC', id: 'R-BTC' },
    { labelText: 'DOC (Dollar on Chain)', id: 'DOC (Dollar on Chain)' },
  ]

  const storageSystemFilters = [
    { labelText: 'Swarm', id: 'Swarm' },
    { labelText: 'IPFS', id: 'IPFS' },
    { labelText: 'SIA', id: 'SIA' },
  ]

  const countryOptions = [
    { labelText: 'Ukraine', id: 'UA' },
    { labelText: 'Czech Republic', id: 'CZ' },
    { labelText: 'Slovakia', id: 'SK' },
    { labelText: 'Uruguay', id: 'UY' },
    { labelText: 'Argentina', id: 'AR' },
    { labelText: 'Spain', id: 'ES' },
  ]

  const onSearch = ({ currentTarget: { value } }) => {
    dispatch({
      type: 'FILTER',
      payload: { name: value.trim() },
    })
  }

  const onSizeChange = ((size: MinMaxFilter) => {
    dispatch({
      type: 'FILTER',
      payload: { size },
    })
  })

  const onPriceChange = ((price: MinMaxFilter) => {
    dispatch({
      type: 'FILTER',
      payload: { price },
    })
  })

  return (
    <>
      <SearchFilter
        value={name}
        onChange={onSearch}
        placeholder="Search provider"
      />
      <RangeFilter
        title="Size"
        values={{
          start: sizeFilter.min,
          end: sizeFilter.max,
        }}
        edgeValues={sizeLimits}
        unit="GB"
        handleChange={onSizeChange}
      />
      <RangeFilter
        title="Price"
        values={{
          start: priceFilter.min,
          end: priceFilter.max,
        }}
        edgeValues={priceLimits}
        unit="RIF"
        handleChange={onPriceChange}
      />
      <AutoCompleteCheckbox options={countryOptions} />
      <Accordion
        id="currencyFilters"
        expanded
        title="Currency"
      >
        <div>
          {
            storageCurrencyFilters.map((currencyFilter) => (
              <LabeledCheckbox
                key={`labeledCheckbox-${currencyFilter.id}`}
                labelText={currencyFilter.labelText}
              />
            ))
          }
        </div>
      </Accordion>
      <Accordion
        id="systemFilters"
        expanded
        title="Storage System"
      >
        {
          storageSystemFilters.map((systemFilter) => (
            <LabeledCheckbox
              key={`labeledCheckbox-${systemFilter.id}`}
              labelText={systemFilter.labelText}
            />
          ))
        }
      </Accordion>
    </>
  )
}

export default StorageFilters

import React, { FC, useState } from 'react'
import { Accordion, LabeledCheckbox } from '@rsksmart/rif-ui'
import SearchFilter from '../SearchFilter'
import RangeFilter from '../RangeFilter'
import AutoCompleteCheckbox from '../AutoCompleteCheckbox'

const StorageFilters: FC = () => {
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

  const [minPrice, setMinPrice] = useState(10)
  const [maxPrice, setMaxPrice] = useState(90)
  const [minSize, setMinSize] = useState(5)
  const [maxSize, setMaxSize] = useState(95)
  const [searchText, setSearchText] = useState('')

  const onSearchTextChange = ({ target: { value } }) => {
    setSearchText(value)
  }

  return (
    <>
      <SearchFilter
        value={searchText}
        onChange={onSearchTextChange}
        placeholder="Search provider"
      />
      <RangeFilter
        title="Size"
        values={{
          start: minSize,
          end: maxSize,
        }}
        edgeValues={{
          min: 0,
          max: 100,
        }}
        unit="GB"
        handleChange={({ min, max }) => {
          setMinSize(min)
          setMaxSize(max)
        }}
      />
      <RangeFilter
        title="Price"
        values={{
          start: minPrice,
          end: maxPrice,
        }}
        edgeValues={{
          min: 0,
          max: 100,
        }}
        unit="RIF"
        handleChange={({ min, max }) => {
          setMinPrice(min)
          setMaxPrice(max)
        }}
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

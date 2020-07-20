import React, { FC, useState } from 'react'
import { Accordion, FilterCheckboxCard } from '@rsksmart/rif-ui'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  Checkbox,
  TextField,
} from '@material-ui/core'
import SearchFilter from '../SearchFilter'
import RangeFilter from '../RangeFilter'

const StorageFilters: FC = () => {
  const storageCurrencyFilters = [
    { labelText: 'RIF' },
    { labelText: 'R-BTC' },
    { labelText: 'DOC (Dollar on Chain)' },
  ]

  const storageSystemFilters = [
    { labelText: 'Swarm' },
    { labelText: 'IPFS' },
    { labelText: 'SIA' },
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
<<<<<<< HEAD
        value={searchText}
        onChange={onSearchTextChange}
=======
        value=""
>>>>>>> feat: handles country and available size on the store
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
      <AutocompleteCheckbox />
      <Accordion
        id="currencyFilters"
        expanded
        title="Currency"
      >
        <FilterCheckboxCard items={storageCurrencyFilters} />
      </Accordion>
      <Accordion
        id="currencyFilters"
        expanded
        title="Storage System"
      >
        <FilterCheckboxCard items={storageSystemFilters} />
      </Accordion>
    </>
  )
}

const countryFilters = [
  { name: 'Ukraine' },
  { name: 'Czech Republic' },
  { name: 'Slovakia' },
  { name: 'Uruguay' },
  { name: 'Argentina' },
  { name: 'Spain' },
]

const AutocompleteCheckbox = () => (
  <Autocomplete
    multiple
    id="checkboxes-tags-demo"
    options={countryFilters}
    disableCloseOnSelect
    getOptionLabel={(option) => option.name}
    renderOption={(option, { selected }) => (
      <>
        <Checkbox
          color="primary"
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option.name}
      </>
    )}
    style={{ width: '100%' }}
    renderInput={(params) => (
      <TextField {...params} variant="outlined" label="Prefered locations" placeholder="Select your prefered locations" />
    )}
  />
)

export default StorageFilters

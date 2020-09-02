import React, { useContext } from 'react'
import { Accordion, FilterCheckboxCard } from '@rsksmart/rif-ui'

import StorageOffersContext from 'context/Services/storage/OffersContext'
import { MinMaxFilter } from 'models/Filters'
import { SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { CheckboxProps } from '@material-ui/core'
import { Modify } from 'utils/typeUtils'
import SearchFilter from '../SearchFilter'
import RangeFilter from '../RangeFilter'

const StorageFilters = () => {
  const {
    state: {
      filters: {
        name,
        price: priceFilter,
        size: sizeFilter,
        periods: planPeriodFilter,
      },
      limits: {
        price: priceLimits,
        size: sizeLimits,
      },
    },
    dispatch,
  } = useContext(StorageOffersContext)

  // const storageCurrencyFilters = [
  //   { labelText: 'RIF', id: 'RIF' },
  //   { labelText: 'R-BTC', id: 'R-BTC' },
  //   { labelText: 'DOC (Dollar on Chain)', id: 'DOC (Dollar on Chain)' },
  // ]

  // const storageSystemFilters = [
  //   { labelText: 'Swarm', id: 'Swarm' },
  //   { labelText: 'IPFS', id: 'IPFS' },
  //   { labelText: 'SIA', id: 'SIA' },
  // ]

  // const countryOptions = [
  //   { labelText: 'Ukraine', id: 'UA' },
  //   { labelText: 'Czech Republic', id: 'CZ' },
  //   { labelText: 'Slovakia', id: 'SK' },
  //   { labelText: 'Uruguay', id: 'UY' },
  //   { labelText: 'Argentina', id: 'AR' },
  //   { labelText: 'Spain', id: 'ES' },
  // ]

  const onSearch = ({ currentTarget: { value } }): void => {
    dispatch({
      type: 'FILTER',
      payload: { name: value.trim() },
    })
  }

  const onSizeChange = ((size: MinMaxFilter): void => {
    dispatch({
      type: 'FILTER',
      payload: { size },
    })
  })

  const onPriceChange = ((price: MinMaxFilter): void => {
    dispatch({
      type: 'FILTER',
      payload: { price },
    })
  })

  const onPlanChange = (
    plan: SubscriptionPeriod,
  ) => (_: unknown, checked: boolean): void => {
    const curPeriods: Set<SubscriptionPeriod> = new Set(planPeriodFilter)

    if (checked) curPeriods.add(plan)
    else curPeriods.delete(plan)

    dispatch({
      type: 'FILTER',
      payload: {
        periods: curPeriods,
      },
    })
  }

  const planPeriodOptions: Modify<CheckboxProps, {
    labelText: SubscriptionPeriod
    id: SubscriptionPeriod
  }>[] = [
    { labelText: 'Daily', id: 'Daily', onChange: onPlanChange('Daily') },
    { labelText: 'Weekly', id: 'Weekly', onChange: onPlanChange('Weekly') },
    { labelText: 'Monthly', id: 'Monthly', onChange: onPlanChange('Monthly') },
  ]

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
      <Accordion
        id="periodsFilter"
        expanded
        title="Subscription period"
      >
        <FilterCheckboxCard items={planPeriodOptions} />
      </Accordion>
      {/* <AutoCompleteCheckbox options={countryOptions} />
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
        <FilterCheckboxCard items={storageSystemFilters} />
      </Accordion> */}
    </>
  )
}

export default StorageFilters

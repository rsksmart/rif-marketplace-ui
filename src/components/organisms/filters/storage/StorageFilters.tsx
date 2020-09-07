/* eslint-disable @typescript-eslint/no-empty-function */ // FIXME: make onClick non-required prop for FilterCheckboxCard
/* eslint-disable @typescript-eslint/explicit-function-return-type */ // FIXME: make onClick non-required prop for FilterCheckboxCard
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
        <FilterCheckboxCard items={planPeriodOptions} onClick={() => {}} />
      </Accordion>
    </>
  )
}

export default StorageFilters

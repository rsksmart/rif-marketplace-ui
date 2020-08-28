import { MarketFilter } from 'models/Market'
import { MinMaxFilter } from 'models/Filters'
import { PeriodInSeconds } from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'

export interface StorageFiltersTransport extends MarketFilter {
  averagePrice: MinMaxFilter
  totalCapacity: MinMaxFilter
  period: PeriodInSeconds
}

export const mapToTransport = ({
  period, price, size,
}: StorageOffersFilters) => ({
  period: period ? {

  } : undefined,
  averagePrice: price ? {

  } : undefined,
  totalCapacity: size ? {

  } : undefined,
})

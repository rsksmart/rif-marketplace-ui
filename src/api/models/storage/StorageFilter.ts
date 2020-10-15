import { MarketFilter } from 'models/Market'
import { MinMaxFilter } from 'models/Filters'
import {
  PeriodInSeconds,
  SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

export interface StorageFiltersTransport extends MarketFilter {
  averagePrice?: MinMaxFilter
  totalCapacity?: MinMaxFilter
  periods: PeriodInSeconds[]
}

export const mapToTransport = ({
  periods,
  price,
  size: sizeGB,
  provider,
}: StorageOffersFilters): StorageFiltersTransport => ({
  periods: Array.from(periods).map(
    (p: SubscriptionPeriod) => PeriodInSeconds[p],
  ),
  averagePrice: {
    min: price.min - 1,
    max: price.max + 1,
  },
  totalCapacity: {
    min: sizeGB.min * UNIT_PREFIX_POW2.KILO,
    max: sizeGB.max * UNIT_PREFIX_POW2.KILO,
  },
  provider: {
    $like: provider,
  },
})

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
  periods?: PeriodInSeconds[]
}

export const mapToTransport = ({
  periods,
  price,
  size: sizeGB,
  provider,
  withInactive,
}: StorageOffersFilters): StorageFiltersTransport => ({
  provider: {
    $like: provider,
  },
  withInactive,
  periods:
    periods
      ? Array.from(periods).map(
        (p: SubscriptionPeriod) => PeriodInSeconds[p],
      )
      : undefined,
  averagePrice:
    price
      ? {
        min: price.min - 1,
        max: price.max + 1,
      }
      : undefined,
  totalCapacity:
    sizeGB
      ? {
        min: sizeGB.min * UNIT_PREFIX_POW2.KILO,
        max: sizeGB.max * UNIT_PREFIX_POW2.KILO,
      }
      : undefined,
})

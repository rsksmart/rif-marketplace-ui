import { MarketFilter } from 'models/Market'
import { MinMaxFilter } from 'models/Filters'
import { PeriodInSeconds, SubscriptionPeriod } from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'

export interface StorageFiltersTransport extends MarketFilter {
  averagePrice?: MinMaxFilter
  totalCapacity?: MinMaxFilter
  periods: PeriodInSeconds[]
  // These should probably change to sequelize structure
}

export const mapToTransport = ({
  periods, price, size,
}: StorageOffersFilters): StorageFiltersTransport => ({
  periods: periods.map((p: SubscriptionPeriod) => PeriodInSeconds[p]),
  averagePrice: price,
  totalCapacity: size,
})

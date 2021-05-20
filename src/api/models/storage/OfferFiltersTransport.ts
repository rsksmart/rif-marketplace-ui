import { MinMaxFilter } from 'models/Filters'
import {
  PeriodInSeconds,
  SubscriptionPeriod,
} from 'models/marketItems/StorageItem'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { UNIT_PREFIX_POW2 } from 'utils/utils'

export default class OfferFiltersTransport {
  averagePrice?: MinMaxFilter

  totalCapacity?: MinMaxFilter

  periods?: PeriodInSeconds[]

  provider?: {
    $like: string
  }

  withInactive?: boolean

  constructor({
    periods,
    price,
    size: sizeGB,
    provider,
    withInactive,
  }: StorageOffersFilters) {
    if (provider) {
      this.provider = {
        $like: provider,
      }
    }
    this.withInactive = withInactive

    this.periods = periods
      ? Array.from(periods).map(
        (p: SubscriptionPeriod) => PeriodInSeconds[p],
      )
      : undefined
    this.averagePrice = price
      ? {
        min: price.min - 1,
        max: price.max + 1,
      }
      : undefined
    this.totalCapacity = sizeGB
      ? {
        min: sizeGB.min * UNIT_PREFIX_POW2.KILO,
        max: sizeGB.max * UNIT_PREFIX_POW2.KILO,
      }
      : undefined
  }
}

import { MarketFilter } from 'models/Market'
import { MinMaxFilter } from 'models/Filters'
import { SubscriptionPeriod } from './StorageItem'

export interface StorageOffersFilters extends MarketFilter {
    price: MinMaxFilter
    size: MinMaxFilter // total capacity. NOT available capacity!
    periods: Set<SubscriptionPeriod>
    name: string
}

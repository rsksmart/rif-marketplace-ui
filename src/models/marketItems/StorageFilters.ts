import { MarketFilter } from 'models/Market'
import { MinMaxFilter } from 'models/Filters'
import { SubscriptionPeriods } from './StorageItem'

export interface StorageOffersFilters extends MarketFilter {
    price: MinMaxFilter
    size: MinMaxFilter // total capacity. NOT available capacity!
    period?: SubscriptionPeriods
}

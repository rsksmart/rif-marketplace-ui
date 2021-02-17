import { MinMaxFilter } from 'models/Filters'
import { SubscriptionPeriod } from './StorageItem'

export interface StorageOffersFilters {
    price: MinMaxFilter
    size: MinMaxFilter // total capacity. NOT available capacity!
    periods?: Set<SubscriptionPeriod>
    provider?: string
    withInactive?: boolean
}

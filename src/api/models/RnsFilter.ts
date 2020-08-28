import { MarketFilter } from 'models/Market'
import { MinMaxFilter } from 'models/Filters'

export type DomainsSaleStatus = 'owned' | 'placed' | 'sold'

export interface RnsFilter extends MarketFilter {
    price: MinMaxFilter
    name?: string
    status?: DomainsSaleStatus
    ownerAddress?: string
}

import { MarketFilter } from 'models/Market'

export type DomainsSaleStatus = 'owned' | 'placed' | 'sold'

export interface RnsFilter extends MarketFilter {
    price: {
        min: number
        max: number
    }
    name?: string
    status?: DomainsSaleStatus
    ownerAddress?: string
}

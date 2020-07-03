import { MarketFilter } from 'models/Market'

export type DomainsSaleStatus = 'owned' | 'placed' | 'sold'


export type PriceFilter = {
    min: number,
    max: number
}

export interface RnsFilter extends MarketFilter {
    price: PriceFilter
    name?: string
    status?: DomainsSaleStatus
    ownerAddress?: string
}

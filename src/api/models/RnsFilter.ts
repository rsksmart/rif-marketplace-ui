import { MarketFilter } from 'models/Market'

export interface DomainOffersFilter extends MarketFilter {
    price: {
        $lte: number
        $gte: number
    }
    domain?: {
        name: {
            $like: string
        }
    }
    ownerAddress?: {
        $ne: string
    }
}
export interface DomainFilter extends MarketFilter {
    ownerAddress: string
    name?: {
        $like: string
    }
    price?: {
        $lte: number
        $gte: number
    }
}

export type RnsFilterType = DomainFilter & DomainOffersFilter

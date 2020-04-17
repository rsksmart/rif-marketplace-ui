import { MarketFilter } from 'models/Market';


export interface DomainOffersFilter extends MarketFilter {
    price?: {
        $lte: number,
        $gte: number
    },
    name?: {
        $like: string
    }
}
export interface DomainFilter extends MarketFilter {
}
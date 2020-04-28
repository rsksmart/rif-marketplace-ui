import { MarketFilter } from 'models/Market';


export interface DomainOffersFilter extends MarketFilter {
    price?: {
        $lte: number,
        $gte: number
    },
    sellerDomain?: { //FIXME: change to domain: { name }
        $like: string
    },
    sellerAddress?: {
        $ne: string
    },
}
export interface DomainFilter extends MarketFilter {
}
import { MarketItemIface } from 'models/Market';

export interface DomainItemIface extends MarketItemIface {
    paymentToken: string
    sellerDomain: string
    expirationDate: number
    price_fiat: number
    price: number
    sellerAddress: string
}

export class DomainItem implements DomainItemIface {
    _id!: string
    paymentToken!: string
    sellerDomain!: string
    expirationDate!: number
    price_fiat!: number
    price!: number
    sellerAddress!: string
}
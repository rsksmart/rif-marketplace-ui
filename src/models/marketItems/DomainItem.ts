import { MarketItem } from 'models/Market';

export interface DomainItemType extends MarketItem {
    currency: string
    domain: string
    expirationDate: number
    price_fiat: number
    price: number
    seller: string
    tld: string
}

export class DomainItem implements DomainItemType {
    _id!: string
    currency!: string
    domain!: string
    expirationDate!: number
    price_fiat!: number
    price!: number
    seller!: string
    tld!: string
}
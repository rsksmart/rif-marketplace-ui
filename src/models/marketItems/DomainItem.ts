import { MarketItemIface } from 'models/Market';

export interface DomainOffer extends MarketItemIface {
    paymentToken: string
    domainName: string
    expirationDate: number
    price_fiat: number
    price: number
    sellerAddress: string
}

export interface Domain extends MarketItemIface {
    expirationDate: number,
    ownerAddress: string,
    name: string,
}
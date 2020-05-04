import { MarketItemIface } from 'models/Market';

export interface DomainOffer extends MarketItemIface {
    paymentToken: string
    domainName: string
    expirationDate: Date
    price: number
    sellerAddress: string
}

export interface Domain extends MarketItemIface {
    expirationDate: Date,
    ownerAddress: string,
    name: string,
}
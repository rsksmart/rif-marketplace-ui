import { MarketItemIface } from 'models/Market';

export interface DomainOffer extends MarketItemIface {
    tokenId: string,
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
    tokenId: string,
}

export interface SoldDomain extends MarketItemIface {
    tokenId: string,
    paymentToken: string,
    price: number,
    soldDate: Date,
    domainName: string,
    buyer: string,
}
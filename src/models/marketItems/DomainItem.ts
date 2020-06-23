import { MarketItem } from 'models/Market'

export interface DomainOffer extends MarketItem {
    tokenId: string
    paymentToken: string
    domainName: string
    expirationDate: Date
    price: number
    ownerAddress: string
}

export interface Domain extends MarketItem {
    expirationDate: Date
    ownerAddress: string
    name: string
    tokenId: string
    offer?: Pick<DomainOffer, 'price' | 'paymentToken'>
}

export interface SoldDomain extends MarketItem {
    tokenId: string
    paymentToken: string
    price: number
    soldDate: Date
    domainName: string
    buyer: string
}

export type RnsItem = Domain & DomainOffer & SoldDomain
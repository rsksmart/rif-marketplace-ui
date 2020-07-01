import { Item } from 'models/Market'

export interface DomainOffer extends Item {
    tokenId: string
    paymentToken: string
    domainName: string
    expirationDate: Date
    price: number
    ownerAddress: string
}

export interface Domain extends Item {
    expirationDate: Date
    ownerAddress: string
    name: string
    tokenId: string
    offer?: Pick<DomainOffer, 'price' | 'paymentToken'>
}

export interface SoldDomain extends Item {
    tokenId: string
    paymentToken: string
    price: number
    soldDate: Date
    domainName: string
    buyer: string
}

export type RnsItem = Domain & DomainOffer & SoldDomain
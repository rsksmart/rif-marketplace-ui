import { Item } from 'models/Market'
import Big from 'big.js'

export interface RnsDomainOffer extends Item {
    tokenId: string
    paymentToken: string
    domainName: string
    expirationDate: Date
    price: Big
    ownerAddress: string
}

export interface RnsDomain extends Item {
    expirationDate: Date
    ownerAddress: string
    name: string
    tokenId: string
    offer?: Pick<RnsDomainOffer, 'price' | 'paymentToken'>
}

export interface RnsSoldDomain extends Item {
    tokenId: string
    paymentToken: string
    price: Big
    soldDate: Date
    domainName: string
    buyer: string
}

export type RnsItem = RnsDomain & RnsDomainOffer & RnsSoldDomain

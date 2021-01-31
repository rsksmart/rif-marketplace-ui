import { Item } from 'models/Market'
import Big from 'big.js'
import { BaseToken } from 'models/Token'

export interface RnsDomainOffer extends Item {
    tokenId: string
    paymentToken: BaseToken
    domainName: string
    expirationDate: Date
    price: Big
    ownerAddress: string
    priceFiat: number
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
    paymentToken: BaseToken
    price: Big
    soldDate: Date
    domainName: string
    buyer: string
}

export type RnsItem = RnsDomain | RnsDomainOffer | RnsSoldDomain

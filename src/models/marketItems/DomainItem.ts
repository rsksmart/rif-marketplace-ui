import { MarketItemIface } from 'models/Market'

export interface DomainOffer extends MarketItemIface {
    tokenId: string
    paymentToken: string
    domainName: string
    expirationDate: Date
    price: number
    ownerAddress: string
}

export interface Domain extends MarketItemIface {
    expirationDate: Date
    ownerAddress: string
    name: string
    tokenId: string
    offer?: Pick<DomainOffer, 'price' | 'paymentToken'>
}

export interface SoldDomain extends MarketItemIface {
    tokenId: string
    paymentToken: string
    price: number
    soldDate: Date
    domainName: string
    buyer: string
}

export type RnsItemType = Domain & DomainOffer & SoldDomain
export const SellDomainStatus = {
  OWNED: 'owned',
  PLACED: 'placed',
  SOLD: 'sold',
}

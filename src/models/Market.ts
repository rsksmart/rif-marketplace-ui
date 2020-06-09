import { RnsFilterType } from 'api/models/RnsFilter'
import { RnsItemType } from './marketItems/DomainItem'
import { StorageItemIface } from './marketItems/StorageItem'

export interface MarketItemIface {
    id: string
}

export enum MarketListingTypes {
    DOMAINS = 'domains',
    DOMAIN_OFFERS = 'domainOffers',
    STORAGE = 'storage',
}

export type MarketItemType = RnsItemType & StorageItemIface


export interface MarketFilter {
    [filterFieldName: string]: {
        [filterType: string]: any
    } | any | undefined
}

export type MarketFilterType = RnsFilterType

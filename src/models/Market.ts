import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from './marketItems/DomainItem'
import { StorageItem } from './marketItems/StorageItem'

export interface MarketItem {
    id: string
}

export enum MarketListingTypes {
    DOMAINS = 'domains',
    DOMAIN_OFFERS = 'domainOffers',
    STORAGE = 'storage',
}

export type MarketItemType = RnsItem & StorageItem

export interface MarketFilter {
    [filterFieldName: string]: {
        [filterType: string]: string | number
    } | string | number | undefined
}

export type MarketFilterType = RnsFilter

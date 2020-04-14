import { DomainItemIface } from "./marketItems/DomainItem"
import { StorageItemIface } from "./marketItems/StorageItem"
import { DomainsFilterIface } from "api/models/RnsFilter"

export interface MarketItemIface {
    _id: string;
}

export enum MarketListingTypes {
    domains = 'domains',
    storage = 'storage',
}

export type MarketItemType = DomainItemIface & StorageItemIface


export interface MarketFilterIface {
    [filterFieldName: string]: {
        [filterType: string]: any
    }
}

export type MarketFilterType = DomainsFilterIface
import { DomainItemIface } from "./marketItems/DomainItem"
import { StorageItemIface } from "./marketItems/StorageItem"
import { DomainsFilterIface } from "api/models/RnsFilter"

export interface MarketItemIface {
    _id: string;
}

export enum MarketListingTypes {
    domainListing = 'domainListing',
    storageListing = 'storageListing',
}

export type MarketItemType = DomainItemIface & StorageItemIface


export interface MarketFilterIface {
    [filterFieldName: string]: {
        [filterType: string]: any
    }
}

export type MarketFilterType = DomainsFilterIface
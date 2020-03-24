import { DomainItemType } from "./marketItems/DomainItem"
import { StorageItemType } from "./marketItems/StorageItem"

export interface MarketItem {
    _id: string;
}

export enum MarketListingType {
    domainListing = 'domainListing',
    storageListing= 'storageListing',
}

export type MarketItemType = DomainItemType & StorageItemType
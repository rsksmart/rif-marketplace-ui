import { DomainOffer, Domain } from "./marketItems/DomainItem"
import { StorageItemIface } from "./marketItems/StorageItem"
import { DomainOffersFilter, DomainFilter } from "api/models/RnsFilter"

export interface MarketItemIface {
    _id: string;
}

export enum MarketListingTypes {
    DOMAINS = 'domains',
    DOMAIN_OFFERS = 'domainOffers',
    STORAGE = 'storage',
}

export type MarketItemType = Domain & DomainOffer & StorageItemIface


export interface MarketFilter {
    [filterFieldName: string]: {
        [filterType: string]: any
    } | any | undefined
}

export type MarketFilterType = DomainFilter & DomainOffersFilter
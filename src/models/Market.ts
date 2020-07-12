import { RnsFilter } from 'api/models/RnsFilter'
import { XEFilter } from 'api/rif-marketplace-cache/rates/exchangeRateController'
import { RnsItem } from './marketItems/DomainItem'
import { StorageItem } from './marketItems/StorageItem'

export interface Item {
    id: string
}

export type MarketItem = RnsItem & StorageItem

export interface MarketFilter {
    [filterFieldName: string]: {
        [filterType: string]: string | number | boolean
    } | string | number | undefined | boolean
}

export type MarketFilterType = RnsFilter & XEFilter

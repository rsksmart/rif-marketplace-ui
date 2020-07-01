import { RnsFilter } from 'api/models/RnsFilter'
import { RnsItem } from './marketItems/DomainItem'
import { StorageItem } from './marketItems/StorageItem'

export interface Item {
    id: string
}

export type MarketItem = RnsItem & StorageItem

export interface MarketFilter {
    [filterFieldName: string]: {
        [filterType: string]: string | number
    } | string | number | undefined
}

export type MarketFilterType = RnsFilter

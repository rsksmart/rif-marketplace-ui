import { RnsFilter } from 'api/models/RnsFilter'
import { XRFilter } from 'api/rif-marketplace-cache/rates/xr'
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

export type MarketFilterType = RnsFilter & XRFilter

export type MarketCrypto = {
    displayName: string
    rate: number
  }

export type MarketCryptoRecord = Record<string, MarketCrypto>

import { RnsFilter } from 'api/models/RnsFilter'
import { XRFilter } from 'api/rif-marketplace-cache/rates/xr'
import { SupportedTokens } from '../contracts/interfaces'
import { RnsItem } from './marketItems/DomainItem'
import { StorageItem } from './marketItems/StorageItem'

export interface Item {
  id: string
}

export type MarketItem = RnsItem & StorageItem

export interface MarketFilter {
  [filterFieldName: string]: unknown
}

export type MarketFilterType = RnsFilter & XRFilter

export type MarketCrypto = {
  displayName: string
  rate: number
}

export type MarketCryptoRecord = Record<SupportedTokens, MarketCrypto>
